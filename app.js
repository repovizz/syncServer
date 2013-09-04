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
        app.use(express.static(__dirname + '/client'));
        app.use(express.static(__dirname + '/config'));
        return server;
    },
    _common: function(app, settings) {
        var server = app.listen(settings.port || 3000);
        app.set('view engine', 'hbs');
        app.set('views', __dirname + '/views');
        hbs.registerPartials(__dirname + '/views/partials');
        app.get('/s/:id', function(req,res) {
            config.common.sessionID = req.params.id;
            res.render('main', {
                config: JSON.stringify(config.common)
            });
        });
        app.get('/', function(req,res) {
            var id = (Math.round(Math.random()*1e16)).toString(36);
            res.redirect('/s/'+id);
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
    // When a user connects, we force the creation of a session for it
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
    // We also send it info about the session and the server
    socket.emit('init',{
        event: 'backend'
    });
});

// Start the websockets server
var io = backboneio.listen(
    server,
    {entities: backend},
    {static: false}
);
io.set('log level',2);

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
