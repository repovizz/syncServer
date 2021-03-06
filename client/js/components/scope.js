/* JavaScript Class Definition
 *
 * Name: Scope
 * Dependencies: Widget, Slider
 * Descriptions: Oscilloscope-like display of unidimensional streams
 *
 */

define(['entities/widget','utils/colors', 'components/slider'],
function(Widget, colors, Slider) {

    var Scope = function(id, container, stream) {
        var self = this;
        Widget.apply(this, arguments);

        this.$el.addClass('scope');
        this.canvas = $('<canvas id="scope" class="expand"></canvas>')[0];
        this.context = this.canvas.getContext('2d');
        if (stream) this.setStream(stream);
        this.$el.on('dialogresize', function() {
            self.render(self._lastFrame);
        });
        this.render = _.throttle(this.render);
        this.$el.append(this.canvas);

        var knobs = $('<div class="knobs"></div>');
        var rate = new Slider('frameRate', this.stream, {min:3,max:60,width:100}, knobs);
        var len = new Slider('frameLength', this.stream, {min:16,max:512,width:100}, knobs);
        this.$el.append(knobs);

        var resize = function(value) {
            self.canvas.width = $(self.canvas).width();
            self.canvas.height = $(self.canvas).height();
        };
        this.model.on('change:width change:height', resize);
        resize();

        return this;
    };

    // Inherit methods from Widget
    _.extend(Scope.prototype, Widget.prototype);

    Scope.prototype.render = function(data, meta) {
        if (!data) return;

        data = new Uint8Array(data);

        var ctx = this.context;
        var nSamp = this.stream.get('frameLength');
        var nSig = this.stream.get('dimensions');
        var w = this.canvas.width;
        var h = this.canvas.height;

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
                    var y = ~~ ( (data[nSamp*i + idx]/255-0.5) * -1 *
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
        if (this.stream) this.stream.off('frame', this.render, this);
        this.stream = stream;
        this.stream.on('frame', this.render, this);
    };

    return Scope;

});
