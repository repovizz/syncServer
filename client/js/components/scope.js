// This is a widget that displays a unidimensional stream as a scope

define(['components/widget'], function(Widget) {

    var Scope = function(stream) {
        Widget.call(this, arguments);
        this.$canvas = $('<canvas id="scope"></canvas>');
        this.$el.append(canvas);
        this.stream = stream;
        this.stream.on('frame', this.render, this);
        return this;
    };

    Scope.prototype.render = function(frame) {
        var context = this.$canvas.getContext('2d');
        var len = this.stream.get('frameLength');
        // ...

    };

    return Scope;

});