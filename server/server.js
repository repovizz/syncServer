/*
 * This is a stub of a socket.io server that responds to CRUD operations
 */

var io = require('socket.io').listen(3000),
    entities = require('entities'),
    config = require('config'),
    __ = require('underscore');

var entities = __.map(config.entities, function(name) {

    var socket = io.p;

    return {
        namespace: '/' + name,
        prefix: name
    };

});

exports = __.object(config.entities, entities);










// creates the event to push to listening clients
var event = function (operation, sig) {
    var e = operation + ':';
    e += sig.endPoint;
    if (sig.ctx) e += (':' + sig.ctx);

    return e;
};

var create = function (socket, signature) {
    var e = event('create', signature);
    socket.emit(e, {id : 1});
};

var read = function (socket, signature) {
    var e = event('read', signature), data;
    data.push({});
    socket.emit(e, data);
};

var update = function (socket, signature) {
    var e = event('update', signature);
    socket.emit(e, {success : true});
};

var destroy = function (socket, signature) {
    var e = event('delete', signature);
    socket.emit(e, {success : true});
};

io.sockets.on('connection', function (socket) {
    socket.on('create', function (data) {
        create(socket, data.signature);
    });
    socket.on('read', function (data) {
        read(socket, data.signature);
    });
    socket.on('update', function (data) {
        update(socket, data.signature);
    });
    socket.on('delete', function (data) {
        destroy(socket, data.signature);
    });
});
