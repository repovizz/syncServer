/* JavaScript Class Definition
 *
 * Name: Scope
 * Dependencies: Widget
 * Descriptions: Oscilloscope-like display of unidimensional streams
 *
 */

define(['components/widget','utils/colors'], function(Widget,colors) {

    var Scope = function(id, container, stream) {
        Widget.apply(this, arguments);
        this.$el.addClass('scope');
        this.canvas = $('<canvas id="scope" class="expand"></canvas>')[0];
        this.context = this.canvas.getContext('2d');
        if (stream) this.setStream(stream);
        var self = this;
        this.$el.on('dialogresize', function() {
            self.render(self._lastFrame);
        });
        this.$el.append(this.canvas);
        return this;
    };

    Scope.prototype.render = function(data, meta) {
        if (!data) return;

        var ctx = this.context;
        var nSamp = this.stream.get('frameLength');
        var nSig = this.stream.get('dimensions');
        var w = this.canvas.width = this.$el.width();
        var h = this.canvas.height = this.$el.height();

        // Clear background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        ctx.lineWidth = 2;
        var heightSlot = h / nSig;
        for (var i = 0; i < nSig; i++) {
            ctx.beginPath();
            var lastIdx = 0;
            var centerY = ~~ ((heightSlot*i + (heightSlot/2.0)) + 0.5);
            for (var t = 0; t < w; t++) {
                var idx = ~~ ((t / w) * nSamp);
                if (idx > lastIdx) {
                    var y = ~~ ( data[nSamp*i + idx] * -1 *
                        heightSlot/2.1  + centerY + 0.5 );
                    if (t === 0)
                        ctx.moveTo(t, y);
                    ctx.lineTo(t, y); // Bottom Right
                    lastIdx = idx;
                }
            }
            ctx.strokeStyle = colors[i%colors.length];
            ctx.stroke();
            ctx.closePath();
        }
        this._lastFrame = data;
    };

    Scope.prototype.setStream = function(stream) {
        if (this.stream) this.stream.off('frame', this.render);
        this.stream = stream;
        this.stream.on('frame', this.render, this);
    };

    return Scope;

});