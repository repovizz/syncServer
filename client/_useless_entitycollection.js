// USELESS

define(['backbone','entity'], function(Backbone, Entity) {

    var EntityCollection = Backbone.Collection.extend({
        model: Entity,
        socket: null,
        type: null
    });

    return EntityCollection;

});