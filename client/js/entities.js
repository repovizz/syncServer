define(['backbone','backbone.io'],
function(Backbone) {

    Backbone.io.connect(
        'http://localhost:3000', {
        // SOCKET.IO options go here
    });

    var entities = _.map(Config.entities, function(name) {

        var collection = new Backbone.Collection([], {
            backend: name
        });

        collection.bindBackend().autoSync();

        return collection;

    });

    return _.object(Config.entities, entities);

});
