/*
 * This is a stub of a socket.io server that responds to CRUD operations
 */

var backboneio = require('backbone.io'),
    config = require('./config/config.json'),
    __ = require('underscore'),
    express = require('express'),
    hbs = require('hbs'),
    db = require('./lib/db');

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
        return server;
    },
    _common: function(app, settings) {
        var server = app.listen(settings.port || 3000);
        db.init({
            host: 'localhost',
            port: 6379
        });
        app.set('view engine', 'hbs');
        app.set('views', __dirname + '/views');
        hbs.registerPartials(__dirname + '/views/partials');
        app.get('/', function(req,res) {
            res.render('main', {
                config: JSON.stringify(config.common),
                widgets: config.widgets,
                sidebar: config.sidebar
            });
        });
        app.use(express.static(__dirname + '/dist'));
        app.use(express.static(__dirname + '/public'));
        return server;
    }
};

var app = express();
var server = init[app.get('env')](app);
var backend = backboneio.createBackend();

backend.use(function(req, res, next) {
    console.log(req.entity + ' : ' + req.method);
    if (req.model)
        console.log(JSON.stringify(req.model));
    else
        console.log(JSON.stringify(req.id));
    next();
});
backend.use(db.middleware.auth());
backend.use(db.middleware.store());
backend.use(backboneio.middleware.channel());

var io = backboneio.listen(server,{entities: backend}, {
    // When a user connects, we force the creation of a session for it
    init: function(socket) {
        var req = {
            socket: socket,
            method: 'create',
            entity: 'session',
            backend: backend,
            id: socket.id
        };
        var res = {
            end: function(data) {
                socket.emit('msg',data);
            },
            error: function(err) {
                console.log(err);
            }
        };
        backend.handle(req, res, function(){});
        return {
            sessionID: socket.id
        };
    }
});

['update','destroy'].forEach(function(method) {
    db.updates.on(method, function(data) {
        data.method = method;
        io.of('entities').broadcast.to(data.entity + ':' + data.id)
            .emit('msg', data);
    });
});

io.set('log level',2);
