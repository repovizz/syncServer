var redis = require('redis');

var config; // NOT IMPLEMENTED

var backend = function(name) {
    var listener = redis.createClient();
    var handle = function(channel, data) {
        var key = channel.split(':');
        if (key[1] === 'create') {
            return data;
        }
    };
    listener.subscribe(name + ':create');
    listener.on('message', handle);
};

var middlewareAuth = function(options) {
    options || (options = {});

    var client = options.client ||
                 redis.createClient(options.port,options.host,options);

    return function(req, res, next) {
        var key = req.entity + ':' + req.id;
        client.exists(key, function(err, exists) {
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
    };

};

var middlewareStore = function(options) {
    options || (options = {});

    var client = options.client ||
                 redis.createClient(options.port,options.host,options);

    var noop = function(){};

    var apiHandlers = {

        create: function(req, res, next) {
            var key = req.entity + ':' + req.id;
            client.sadd(req.entity, req.id);
            apiHandlers.update(req,res,noop);
            apiHandlers.join(req,res,noop);
            next();
        },

        read: function(req, res, next) {
            var key = req.entity + ':' + req.id;
            apiHandlers.join(req,res,noop);
            //if (req.model)
            //    client.hmget(key, req.model, res.end);
            //else
            client.hgetall(key, function(err, resp) {
                res.end(resp);
            });
        },

        update: function(req, res, next) {
            var key = req.entity + ':' + req.id;
            apiHandlers.join(req,res,noop);
            client.hmset(key, req.model);
            next();
        },

        delete: function(req, res, next) {
            // Some are missing: delete id:listens...
            var key = req.entity + ':' + req.id;
            client.leave(req,res,next);
            client.multi()
                  .del(key)
                  .srem(req.entity, req.id)
                  .exec();
        },

        join: function(req, res, next) {
            var me = 'session:' + req.socket.id;
            var it = req.entity + ':' + req.id;
            client.multi()
                  .sadd([me,'listens'].join(':'), it)
                  .sadd([me,'listens',req.entity].join(':'), req.id)
                  .sadd([it,'tells'].join(':'), me)
                  .exec(next);
        },

        leave: function(req, res, next) {
            var me = 'session:' + req.socket.id;
            var it = req.entity + ':' + req.id;
            client.multi()
                  .srem([me,'listens'].join(':'), it)
                  .srem([me,'listens',req.entity].join(':'), req.id)
                  .srem([it,'tells'].join(':'), me)
                  .exec(next);
        },

        send: function(req, res, next) {
            var key = req.entity;
            if (req.id)
                key += ':' + req.id;
            key += ':feed';
            client.publish(key, req.model, next);
        },

        list: function(req, res, next) {
            var key = req.entity;
            if (req.id)
                key += ':' + req.id + ':listens';
            client.smembers(key, next, res.end);
        }

    };

    return function(req, res, next) {

        apiHandlers[req.method](req, res, next);

    };

};

module.exports = {
    middleware: {
        store: middlewareStore,
        auth: middlewareAuth
    },
    backend: backend,
    config: function(newConfig) {
        config = newConfig;
    }
};
