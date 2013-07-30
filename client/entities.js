define(['json!shared/config.json','backbone','backbone.io'],
function(config,Backbone) {

    Backbone.io.connect(
        'http://localhost:3000', {
        // SOCKET.IO options go here
    });

    var entities = _.map(config.entities, function(name) {

        var collection = new Backbone.Collection({
            backend: name
        });

        collection.bindBackend()
                  .autoSync();

        return collection;

    });

    return _.object(config.entities, entities);

});