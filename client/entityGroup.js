define(['backbone','entity'], function(Backbone, Entity) {

	var EntityGroup = Backbone.Collection.extend({

		model: Entity,
		type: null,
		socket: null,

		initialize: function() {
			_.bindAll(this,'_create','_read','_update','_destroy');
			this.socket.on({
				create: this._create,
				read: this._read,
				update: this._update,
				destroy: this._destroy
			});
		},

		remove: function(models) {
			_.each(models, _.partial(this.socket.send, 'destroy'));
			this.__super__.remove.apply(this,arguments);
			return this;
		},

		set: function(models) {
			_.each(models, _.partial(this.socket.send, 'update'));
			this.__super__.set.apply(this,arguments);
			return this;
		},

		_create: function() {

		},

		_read: function() {

		},

		_update: function() {

		},

		_destroy: function() {

		}

	});

	return EntityGroup;

});

// existing methods:
// add, remove, set, get, reset, push, pop,
// fetch, create, parse, clone, _reset

// existing events:
// add, remove, destroy (both model and collection)
// reset, sort, change, request, sync, error, invalid (only model)
