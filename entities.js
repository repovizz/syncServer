define(['entity'], function(Entity) {

    Entities = {
        Widget: Entity.extend({type: 'widget'}),
        Session: Entity.extend({type: 'session'}),
        Stream: Entity.extend({type: 'stream'}),
        View: Entity.extend({type: 'view'}),
        Source: Entity.extend({type: 'source'})
    };

    return Entities;

});