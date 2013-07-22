define(['socket.io','backbone'], function(io,Backbone) {

    var WS_ROOT = 'http://streaming.local';

    var sockets = {
        session: io.connect(WS_ROOT+'/session'),
        source: io.connect(WS_ROOT+'/source'),
        view: io.connect(WS_ROOT+'/view'),
        stream: io.connect(WS_ROOT+'/stream')
    };

    return sockets;

});