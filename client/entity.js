define(['backbone'], function(Backbone) {

    var Entity = Backbone.Model.extend({
        socket: [],
        entitySocket: null,
        type: null,
        initialize: function() {
            if (this.has('id')) {
                this.socket = this.entitySocket.of(this.get('id'));
                this.socket.on({
                    change: this.remoteChange.bind(this),
                    destroy: this.remoteDestroy.bind(this)
                });
            }
            this.on({
                change: this.sync.bind(this),
                destroy: this.destroy.bind(this)
            });
        },
        sync: function(data) {
            data = data || this.changedAttributes();
            if (data.hasOwnProperty('id') || this._syncing) {
                this._syncing = false;
                this.trigger('error','ID cannot be changed');
            } else if (_.isArray(this.socket)) {
                this.socket.shift(data);
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
            if(!this._syncing)
                this.socket.send('destroy');
            this._syncing = false;
            this.socket.off();
        },
        remoteChange: function(data) {
            // Prevent a sync on remote updates
            if (data.hasOwnProperty('id')) {
                if (_.iSArray(this.socket))
                    _.each(this.socket, this.sync);
                else
                    this.socket.off();
                this.socket = this.entitySocket.at(data.id);
                this.socket.on({
                    change: this.remoteChange.bind(this),
                    destroy: this.remoteDestroy.bind(this)
                });
            }
            this._syncing = true;
            this.set(data);
        },
        _syncing: false
    });

    return Entity;

});