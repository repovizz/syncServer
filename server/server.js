/*
 * This is a stub of a socket.io server that responds to CRUD operations
 */

var backboneio = require('backbone.io'),
    config = require('../shared/config'),
    __ = require('underscore'),
    express = require('express'),
    http = require('http');

var app = express();
var server = http.createServer(app);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '../test/runner.html');
});

// app.use(express.directory('../'));
// app.use(express.static('../'));

var entities = __.map(config.entities, function(name) {

    var backend = backboneio.createBackend(),
        options = {};

    backend.use(backboneio.middleware.memoryStore());
    options[name] = backend;
    backboneio.listen(server, options).disable('heartbeats');

    return backend;

});

entities = __.object(config.entities, entities);

entities.widget.use(function(req, res, next) {
    console.log(req.backend);
    console.log(req.method);
    console.log(JSON.stringify(req.model));
    next();
});

