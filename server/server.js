/*
 * This is a stub of a socket.io server that responds to CRUD operations
 */

var backboneio = require('backbone.io'),
    config = require('../shared/config'),
    __ = require('underscore'),
    express = require('express'),
    http = require('http');

var app = express();
var server = app.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '../test/runner.html');
});

app.use(express.static(__dirname + '/..'));

var backends = __.map(config.entities, function(name) {

    var backend = backboneio.createBackend();
    backend.use(backboneio.middleware.memoryStore());
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

