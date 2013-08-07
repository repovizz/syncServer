var engine = require('engine.io')
  , http = require('http').createServer().listen(3000)
  , redis = require('redis')
  , client = redis.createClient()
  , server = engine.attach(http);

var apiHandlers = {

    create: function(req, res, next) {
        var newKey = false;
        var key = '';
        var id = '';
        if (req.id) {
            key = req.backend + ':' + req.id;
            if (client.exists(key)) {
                newKey = true;
            }
        } else {
            newKey = true;
        }
        id = newKey ? random_key() : req.id;
        key = req.backend + ':' + id;
        client.sadd(req.backend, id);
        client.hmset(key, data);

        var res = {};
        if (newKey) res.id = id;
        return res;
    },

    read: function(req, res, next) {
        var key = req.backend + ':' + req.id;
        var res;
        if (req.data)
            res = client.hmget(key, req.data);
        else
            res = client.hgetall(key);
        return res;
    },

    update: function(req, res, next) {
        key = req.backend + ':' + req.id;
        client.sadd(req.backend, req.id);
        client.hmset(key, data);
    },

    delete: function(req, res, next) {
        // This should be managed by the server!
        var key = req.backend;
        var id = req.id || data;
        key += ':' + id;
        client.del(key);
    },

    listen: function(req, res, next) {
        var me = req.backend + ':' + req.id;
        var it = req.data.backend + ':' + req.data.id;
        var multi = client.multi();
        multi.sadd([me,'listens'].join(':'), it);
        multi.sadd([me,'listens',req.data.backend].join(':'), it);
        multi.sadd([it,'tells'].join(':'), me)
        multi.execute();
    },

    send: function(req, res, next) {
        var key = req.backend;
        if (req.id)
            key += ':' + req.id;
        client.publish(key, req.data);
    },

    list: function(req, res, next) {
        var key = req.backend;
        if (req.id) {
            key += ':req.id';
        }
        key += ':listeners'
        if (req.data)
            key += ':' + req.data;
        }
        var res = client.smembers(key);
        return res;
    }

};

var callbacks = {

}

server.on('connection', function (socket) {

    socket.on('message', function (name, data) {
        var routes = name.split(':');
        var req = {
            backend: routes[0],
            id: routes[2],
            data: data
        };
        var action = routes[1];
        var response = handlers[action](req);
        if (response) socket.emit(response);
    });

    socket.on('close', function () {
        //doSomething
    });

});
