var config = require('config'),
    io = require('socket.io'),
    __ = require('underscore');

var entities = __.map(config.entities, function(name) {

    return {
        namespace: '/' + name,
        prefix: name
    };

});

exports = __.object(config.entities, entities);
