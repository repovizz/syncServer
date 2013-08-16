// This is like a Backbone View, but made from scratch
// We are using custom DOM events, so the built-in View is rather useless

define(['backbone', 'jquery-ui'], function(Backbone) {

	var Widget = function(id, context) {
		id = this.id = id || new Date().getTime();
		var model = this.model = new Backbone.Model({
			id: this.id,
			'class': 'generic'
		});
		this.$el = $('<div id="'+this.id+'" class="widget"></div>');
		this.$el.dialog({
			stack: '.widget',
			appendTo: context,
			resize: function(event,ui) {
				model.set({
					width: ui.size.width,
					height: ui.size.height,
					position: JSON.stringify(ui.position)
				});
			},
			drag: function(event,ui) {
				model.set('position', JSON.stringify(ui.position));
			}
		});
		this.model.on('change:position', setPosition, this);
		this.model.on('change:width', setWidth, this);
		this.model.on('change:height', setHeight, this);
		return this;
	};

	var setPosition = function(model, position) {
		position = JSON.parse(position);
		this.$el.dialog('option','position', [position.left, position.top]);
	};

	var setWidth = function(model, width) {
		this.$el.dialog('option','width', width);
	};

	var setHeight = function(model, height) {
		this.$el.dialog('option','height', height);
	};

	return Widget;

});