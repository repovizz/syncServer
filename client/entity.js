define(['backbone','sockets'], function(Backbone,Sockets) {

    var Entity = Backbone.Model.extend({
        socket: null,
        entitySocket: null,
        type: null,
        initialize: function(attr, opt) {
            var type = opt.type || this.type;
            if (this.has('id'))
                this.socket = this.entitySocket.at(this.get('id'));
            this.on({
                change: this.sync.bind(this),
                destroy: this.destroy.bind(this)
            });
            this.socket.on({
                change: this.remoteChange.bind(this),
                destroy: this.remoteDestroy.bind(this)
            });
        },
        sync: function() {
            var data = this.changedAttributes();
            if (data.hasOwnProperty('id') || this._syncing) {
                this._syncing = false;
                this.trigger('error','ID cannot be changed');
            } else {
                this.socket.send('change',data);
            }
        },
        remoteDestroy: function() {
            this._syncing = true;
            this.trigger('destroy');
        },
        destroy: function() {
            // sholud be sent only when local
            if(!this._syncing) {
                this.socket.send('destroy');
            }
            this._syncing = false;
            this.socket.off();
        },
        remoteChange: function(data) {
            // Prevent a sync on remote updates
            if (data.hasOwnProperty('id'))
                this.socket = this.entitySocket.at(this.get('id'));
            this._syncing = true;
            this.set(data);
        },
        _syncing: false
    });

    return Entity;

});