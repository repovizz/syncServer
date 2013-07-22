define(['backbone','sockets'], function(Backbone,Sockets) {

    var Entity = Backbone.Model.extend({
        socket: null,
        type: null,
        initialize: function(attr,opt) {
            var type = opt.type || this.type;
            if (this.has('id'))
                this.socket = Sockets[type].at(this.get('id'));
            this.on({
                'change': this.sync,
                'destroy': this.destroy
            });
            this.socket.on({
                'change': this.change,
                'destroy': this.destroy
            });
        },
        sync: function(data) {
            if (data.hasOwnProperty('id'))
                return false;
            this.socket.send('change',data);
            return true;
        },
        destroy: function() {
            // sholud be sent only when local
            this.socket.send('destroy');
            this.socket.off();
        },
        change: function(data) {
            this.set(data);
        }
    });

    return Entity;

});