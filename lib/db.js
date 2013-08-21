var redis = require('redis');
var EventEmitter = require('events').EventEmitter;

var listener, client, pipe;
var noop = function(){};
var snoop = function(err) {
    if (err) console.log(err);
};

var updates = new EventEmitter();

var handleUpdate = function(channel, message) {
    var key = channel.split(':');
    message = JSON.parse(message);
    if (message.clientID === 'nodejs') return;
    delete message.clientID;
    message.entity = key[0];
    if (key.length > 1) message.id = key[1];
    var data = message.data;
    delete message.data;
    updates.emit(message.method, message, data);
};

var handleFrame = function(channel, message) {
    var key = channel.split(':');
    updates.emit('frame', {
        entity: key[0],
        id: key[1]
    }, message);
};

var init = function(options) {

    options || (options = {});

    client = options.client ||
             redis.createClient(options.port,options.host,options);

    listener = options.listener ||
               redis.createClient(options.port,options.host,options);

    pipe = options.pipe ||
               redis.createClient(options.port,options.host,options);

    listener.on('message', handleUpdate);
    pipe.on('message', handleFrame);

};

var middlewareAuth = function() { return function(req, res, next) {
    var key = req.entity + ':' + req.id;
    client.exists(key, function(err, exists) {
        if (err) res.error(err);
        if (req.method == 'create' && exists == 1) {
            //res.error({
            //    name: 409,
            //    message: 'Resource already exists'
            //});
            req.method = 'read';
        }
        if (req.method !== 'create' && exists == 0) {
            res.error({
                name: 404,
                message: 'Resource not found'
            });
            return;
        }
        if (req.method == 'delete' && req.entity !== 'widget') {
            res.error({
                name: 403,
                message: "Only widgets can be deleted by users"
            });
            return;
        }
        // Check R/W permissions using req.cookie + session
        next();
    });
};};

var apiHandlers = {

    create: function(req, res, next) {
        //var key = req.entity + ':' + req.id;
        client.sadd(req.entity, req.id, snoop);
        if (req.data)
            apiHandlers.update(req,res,noop);
        apiHandlers.join(req,res,noop);
        var id = req.id;
        delete req.id;
        apiHandlers.send(req,res,noop);
        req.id = id;
        next();
    },

    read: function(req, res, next) {
        var key = req.entity + ':' + req.id;
        apiHandlers.join(req,res,noop);
        //if (req.data)
        //    client.hmget(key, req.data, res.end);
        //else
        client.hgetall(key, function(err, resp) {
            if (err) res.error(err);
            else res.end(resp);
            next();
        });
    },

    update: function(req, res, next) {
        if (!req.data) {
            res.error(500, 'Empty update');
        } else {
            var key = req.entity + ':' + req.id;
            apiHandlers.join(req,res,noop);
            client.hmset(key, req.data, snoop);
            apiHandlers.send(req,res,noop);
        }
        next();
    },

    delete: function(req, res, next) {
        // Some are missing: delete id:listens...
        var key = req.entity + ':' + req.id;
        apiHandlers.leave(req,res,noop);
        client.multi()
              .del(key)
              .srem(req.entity, req.id)
              .exec(snoop);
        apiHandlers.send(req,res,noop);
        next();
    },

    join: function(req, res, next) {
        if (req.entity !== 'session') {
            var me = 'session:' + req.socket.id;
            var it = req.entity + ':' + req.id;
            listener.subscribe(it + ':feed');
            client.multi()
                  .sadd([me,'listens'].join(':'), it)
                  .sadd([me,'listens',req.entity].join(':'), req.id)
                  .sadd([it,'tells'].join(':'), me)
                  .exec(snoop);
            if (req.entity === 'stream') {
                pipe.subscribe(it + ':pipe');
            }
        }
        next();
    },

    leave: function(req, res, next) {
        if (req.entity !== 'session') {
            var me = 'session:' + req.socket.id;
            var it = req.entity + ':' + req.id;
            listener.unsubscribe(it + ':feed');
            client.multi()
                  .srem([me,'listens'].join(':'), it)
                  .srem([me,'listens',req.entity].join(':'), req.id)
                  .srem([it,'tells'].join(':'), me)
                  .exec(snoop);
            if (req.entity === 'stream') {
                pipe.unsubscribe(it + ':pipe');
            }
        }
        next();
    },

    send: function(req, res, next) {
        var key = req.entity;
        if (req.id)
            key += ':' + req.id;
        key += ':feed';
        var msg = req.message || {
            method: req.method,
            clientID: 'nodejs',
            timestamp: new Date().getTime()
        };
        client.publish(key, JSON.stringify(msg), snoop);
        next();
    },

    list: function(req, res, next) {
        var key = req.entity;
        if (req.id)
            key += ':' + req.id + ':listens';
        client.smembers(key, function(err, resp) {
            if (err) res.error(err);
            res.end(resp);
            next();
        });
    }

};

var middlewareStore = function() { return function(req, res, next) {
    if (apiHandlers[req.method]) apiHandlers[req.method](req,res,next);
};};

module.exports = {
    middleware: {
        store: middlewareStore,
        auth: middlewareAuth
    },
    init: init,
    updates: updates
};
