define(['json!shared/config.json',
        'entity',
        'backbone',
        'socket.io'],
function(config,Entity,Backbone,io) {

    var entities = _.map(config.entities, function(name) {

        var Socket = io.connect(
                config.WS_ROOT + name
            ),
            Model = Entity.extend({
                type: name,
                entitySocket: Socket
            }),
            Collection = Backbone.Collection.extend({
                type: name,
                model: Entity
            }),
            all = new Collection();

        Socket.on('create', all.create.bind(all));
        all.socket = Socket;
        all.create = function() {
            this.socket.send('create',arguments);
            Backbone.Collection.create.apply(this,arguments);
        };

        return {
            model: Model,
            collection: Collection,
            socket: Socket,
            all: all
        };

    });

    return _.object(config.entities, entities);

});