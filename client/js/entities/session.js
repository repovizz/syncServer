// The Session Entity is a singleton that manages which widgets
// are there on screen and which streams are we subscribed to.

define(['entities', 'backbone'], function(Entities, Backbone) {

	var Session = Backbone.Model.extend({
		initialize: function(attrs, opts) {
			opts || (opts = {});
			Entities.session.add(this);
			// do stuff and bind events
		}
	});

	return Session;

});