/*
 * This is a stub of a socket.io server that responds to CRUD operations
 */

var backboneio = require('backbone.io'),
    config = require('./config/config.json'),
    __ = require('underscore'),
    express = require('express'),
    hbs = require('hbs'),
    redisObjectStore = require('./lib/redisObjectStore');

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
                ]
            });
        });
        app.use(express.static(__dirname + '/dist'));
        app.use(express.static(__dirname + '/public'));
        return server;
    }
};

var app = express();
var server = init[app.get('env')](app);

var backends = __.map(config.entities, function(name) {

    var backend = backboneio.createBackend(name);
    //backend.use(backboneio.middleware.channel());
    //backend.use(redisObjectStore());
    return backend;

});

backends = __.object(config.entities, backends);

backboneio.listen(server,backends, {
    // SOCKET.IO options go here
});

backends.widget.use(function(req, res, next) {
    console.log(req.backend);
    console.log(req.method);
    console.log(JSON.stringify(req.model));
    next();
});
