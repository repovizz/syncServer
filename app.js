/*
 * SocketIO + BackboneIO + Redis + Exress/HBS
 */

var backboneio = require('backbone.io'),
    config = require('./config/config.json'),
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
        app.set('view engine', 'hbs');
        app.set('views', __dirname + '/views');
        hbs.registerPartials(__dirname + '/views/partials');
        app.get('/', function(req,res) {
            res.render('main', {
                config: JSON.stringify(config.common)
            });
        });
        app.use(express.static(__dirname + '/dist'));
        app.use(express.static(__dirname + '/public'));
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
    console.log(req.entity + ':' + req.id + ':' + req.method);
    if (req.model)
        console.log(JSON.stringify(req.model));
    else
        console.log(JSON.stringify(req.id));
    next();
});
backend.use(db.middleware.auth());
backend.use(db.middleware.store());
backend.use(backboneio.middleware.channel());

// When a user connects, we force the creation of a session for it
backend.on('connection', function(socket) {
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
    socket.emit('init',{
        sessionID: socket.id,
        event: 'backend'
    });
});

var io = backboneio.listen(
    server,
    {entities: backend},
    {static: false}
);

// Send updates on the database to the clients
['update','destroy'].forEach(function(method) {
    db.updates.on(method, function(data) {
        var channel = data.entity + ':' + data.id;
        backend.send(method, data, channel);
    });
});

io.set('log level',2);
