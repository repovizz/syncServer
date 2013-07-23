define(['Backbone','Entity'], function(Backbone, Entity) {

    var EntityCollection = Backbone.Collection.extend({
        model: Entity,
        socket: null,
        initialize: function(attr, opt) {
            var type = opt.type || this.model.type || this.type;
            this.socket = Sockets[type];
            this.socket.on({
                create: this.create.bind(this)
            });
            this.on({
                add: this.remoteAdd
            });
        },
        remoteAdd: function(model) {
            this.socket.send('create',model);
        }
    });

    return EntityCollection;

});