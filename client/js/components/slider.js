/* JavaScript Class Definition
 *
 * Name: Slider
 * Dependencies: expects a Backbone.Model as input
 * Description: Provides logic for a wrapped HTML element with a slider on it
 *
 */

define(['jquery-ui'], function() {

	function Slider(key, model, options, container) {
		var self = this;
		var setter = function(model,value) {
			self.$el.slider('value', parseFloat(value));
		};
		this.model = model;
		this.$el = $('<div class="slider"></div>');
		this.$title = $('<h4 class="text-muted title">'+key+'</h4>');
		this.$el.append(this.$title);
		this.$el.slider(_.extend({
			'animate': 'fast',
			'slide': function(ev, ui) {
				self.model.off('change:'+key, setter);
				self.model.set(key, ui.value);
				self.model.on('change:'+key, setter);
			}
		}, options));
		this.model.on('change:'+key, setter);
		if (this.model.has(key)) setter(this.model.get(key));
		else this.model.set(key, 0);
		if (container) container.append(this.$el);
		return this;
	}

	return Slider;

});