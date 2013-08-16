var redis = require('redis');
var EventEmitter = require('events').EventEmitter;

var listener, client;
var noop = function(){};
var snoop = function(err) {
    if (err) console.log(err);
};

var updates = new EventEmitter();

var handleUpdate = function(channel, data) {
    var key = channel.split(':');
    data = JSON.parse(data);
    if (data.clientID === 'nodejs') return;
    delete data.clientID;
    data.entity = key[0];
    if (key.length > 1) data.id = key[1];
    if (data.method == 'update') {
        var modelKey = data.entity + ':' + data.id;
        client.hgetall(modelKey, function(err,resp) {
            if (err) throw err;
            data.model = resp;
            updates.emit('update', data);
        });
    } else if (data.method == 'destroy') {
        updates.emit('destroy', data);
    }
};

var init = function(options) {

    options || (options = {});

    client = options.client ||
             redis.createClient(options.port,options.host,options);

    listener = options.listener ||
               redis.createClient(options.port,options.host,options);

    listener.on('message', handleUpdate);

};

var middlewareAuth = function() { return function(req, res, next) {
    var key = req.entity + ':' + req.id;
    client.exists(key, function(err, exists) {
        if (err) res.error(err);
        if (req.method === 'create' && exists == 1) {
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
        if (req.method === 'delete' && req.entity !== 'widget') {
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
        //if (req.model)
        //    client.hmget(key, req.model, res.end);
        //else
        client.hgetall(key, function(err, resp) {
            if (err) res.error(err);
            res.end(resp);
            next();
        });
    },

    update: function(req, res, next) {
        var key = req.entity + ':' + req.id;
        apiHandlers.join(req,res,noop);
        client.hmset(key, req.model || {id:req.id}, snoop);
        apiHandlers.send(req,res,noop);
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
