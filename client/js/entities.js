// THIS IS NOT OPTIMAL AT ALL. REFACTOR PENDING.

define(['backbone','backbone.io'],
function(Backbone) {

    Backbone.io.connect(
        window.location.origin, {
        // SOCKET.IO options go here
    });

    var entities = _.map(Config.entities, function(name) {

        var collection = new Backbone.Collection([], {
            backend: 'entities',
            entity: name
        });
        collection.bindBackend().autoSync();

        return collection;

    });

    return _.object(Config.entities, entities);

});
