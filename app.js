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
        db.config({
            host: 'localhost',
            port: 6379
        });
        app.set('view engine', 'hbs');
        app.set('views', __dirname + '/views');
        hbs.registerPartials(__dirname + '/views/partials');
        app.get('/', function(req,res) {
            res.render('main', {
                config: JSON.stringify(config),
                widgets: [
                    {
                        row: 1,
                        col: 1,
                        width: 1,
                        height: 1
                    },{
                        row: 2,
                        col: 1,
                        width: 1,
                        height: 1
                    },{
                        row: 1,
                        col: 2,
                        width: 1,
                        height: 1
                    },{
                        row: 2,
                        col: 2,
                        width: 1,
                        height: 1
                    }
                ],
                sidebar: {
                    row: 1,
                    col: 3,
                    width: 1,
                    height: 2
                }
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
    // BACKBONE.IO options go here
    init: function(socket) {
        return {
            sessionID: socket.id
        };
    }
});

io.set('log level',2);
