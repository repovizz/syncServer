/*
 * SocketIO + BackboneIO + Redis + Exress/HBS
 */

var backboneio = require('backbone.io'),
    express = require('express'),
    hbs = require('hbs'),
    db = require('./lib/db'),
    config = require('./config/config'),
    rconfig = require('./config/r');

var init = {
    development: function(app) {
        var settings = require('./config/development');
        var server = init._common(app,settings);
        app.use(express.static(__dirname + '/client'));
        app.use(express.static(__dirname + '/config'));
        return server;
    },
    production: function(app) {
        var settings = require('./config/production');
        var server = init._common(app,settings);
        app.use(express.static(__dirname + '/client'));
        app.use(express.static(__dirname + '/config'));
        return server;
    },
    _common: function(app, settings) {
        var server = app.listen(settings.port || 3000);
        /*
        app.set('view engine', 'hbs');
        app.set('views', __dirname + '/views');
        hbs.registerPartials(__dirname + '/views/partials');
        app.get('/s/:id', function(req,res) {
            config.common.sessionID = req.params.id;
            res.render('main', {
                config: JSON.stringify(config.common),
                title: config.title,
                theme: config.theme,
                requirejs: JSON.stringify(rconfig)
            });
        });
        app.get('/', function(req,res) {
            var id = (Math.round(Math.random()*1e16)).toString(36);
            res.redirect('/s/'+id);
        });
        app.use(express.static(__dirname + '/dist'));
        app.use(express.static(__dirname + '/public'));
        */
        return server;
    }
};

var app = express();
var server = init[app.get('env')](app);

db.init({
    host: 'localhost',
    port: 6379
});

var backend = backboneio.createBackend();

backend.use(function(req, res, next) {
    if (req.method !== 'update') {
        console.log(req.entity + ':' + req.id + ':' + req.method);
        if (req.data) console.dir(req.data);
    }
    next();
});
backend.use(db.middleware.auth());
backend.use(db.middleware.store());
backend.use(backboneio.middleware.channel());

backend.on('connection', function(socket) {
    // Send it info about the session and the server
    socket.emit('init',{
        event: 'backend'
    }, function(id) {
        // When a user connects, we force the creation of a session for it
        // Here we should bootstrap it with sources or something
        // var req = {
        //     socket: socket,
        //     method: 'create',
        //     entity: 'session',
        //     backend: backend,
        //     id: id
        // };
        // var res = {
        //     end: function(data) {
        //         socket.emit('msg',data);
        //     },
        //     error: function(err) {
        //         console.log(err);
        //     }
        // };
        // backend.handle(req, res, function(){});
    });
});

// Start the websockets server
var io = backboneio.listen(
    server,
    {entities: backend},
    {
        static: false,
        transports: ['xhr-polling', 'htmlfile', 'jsonp-polling'],
        'log level': 2,
        resource: '/sync/socket.io'
    }
);

// Send updates on the database to the clients

['update','destroy'].forEach(function(method) {
    db.updates.on(method, function(meta, data) {
        meta.method = method;
        backend.send(meta, data);
    });
});

db.updates.on('frame', function(meta, data) {
    meta.method = 'frame';
    backend.send(meta, data.toString('base64'), {volatile: true});
});
