define(['json!shared/config.json','backbone','backbone.io'],
function(config,Backbone) {

    Backbone.io.connect(
        'http://localhost:3000', {
        // SOCKET.IO options go here
    });

    var entities = _.map(config.entities, function(name) {

        var Collection = Backbone.Collection.extend({
            backend: name,
            initialize: function() {
                var self = this;
                this.bindBackend();
                this.autoSync();
            }
        });

        return Collection;

    });

    return _.object(config.entities, entities);

});