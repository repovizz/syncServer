define(['backbone','sockets'], function(Backbone,Sockets) {

    var Entity = Backbone.Model.extend({
        socket: null,
        type: null,
        initialize: function(attr, opt) {
            var type = opt.type || this.type;
            if (this.has('id'))
                this.socket = Sockets[type].at(this.get('id'));
            this.on({
                change: this.sync.bind(this),
                destroy: this.destroy.bind(this)
            });
            this.socket.on({
                change: this.change.bind(this),
                destroy: this.destroy.bind(this)
            });
        },
        sync: function() {
            var data = this.changedAttributes();
            if (data.hasOwnProperty('id') || this._syncing) {
                this._syncing = false;
                return false;
            } else {
                this.socket.send('change',data);
                return true;
            }
        },
        destroy: function() {
            // sholud be sent only when local
            this.socket.send('destroy');
            this.socket.off();
        },
        change: function(data) {
            // Should prevent a sync
            this._syncing = true;
            this.set(data);
        },
        _syncing: false
    });

    return Entity;

});