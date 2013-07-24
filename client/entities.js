define(['config',
        'entity',
        'backbone',
        'io',
        'underscore'],
function(config,Entity,Backbone,io,_) {

    var entities = _.map(config.entities, function(name) {

        var Socket = io.connect(
                io.WS_ROOT + name
            ),
            Model = Entity.extend({
                type: name,
                entitySocket: socket
            }),
            Collection = Backbone.Collection.extend({
                type: name,
                model: entity
            }),
            all = new Collection();

        socket.on('create', all.create.bind(all));
        all.socket = socket;
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