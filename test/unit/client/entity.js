define(['entities','backbone'], function(Entities,Backbone) {

	var widgets = Entities.widget;
	widgets.add(new Backbone.Model());
	window.widgets = widgets;

});