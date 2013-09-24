// KNOB WAS REMOVED FROM THE LIBRARIES BECAUSE IT DIDN'T WORK WELL
// I'm KEEPING THIS JUST IN CASE SOMEBODY WANTS TO GIVE IT ANOTHER TRY

/* JavaScript Class Definition
 *
 * Name: Knob
 * Dependencies: jquery-knob (and expects a Backbone.Model as input)
 * Description: Provides logic for a wrapped HTML element with a knob on it
 *
 */

define(['jquery-knob'], function() {

	function Knob(key, model, options, container) {
		var self = this;
		this.model = model;
		this.$el = $('<div class="knob"></div>');
		this.$input = $('<input type="text"></input>');
		this.$el.append(this.$input);
		this.$input.knob(_.extend({
			'change': function(value) {
				self.model.set(key, value);
			}
		}, options));
		this.model.on('change:'+key, function(foo,value){
			self.$input.val(value);
		});
		this.$input.val(this.model.get(key));
		if (container) container.append(this.$el);
		return this;
	}

	Knob.prototype.resize = function() {
		var s = Math.min(this.$el.height(),this.$el.width());
		this.$input.trigger('configure', {width: s});
	};

	return Knob;

});