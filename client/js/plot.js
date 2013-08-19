/* JavaScript Module Definition
 *
 * Name: Plot
 * Dependencies: Player
 * Publishes:
 * Provides: setCanvas, update, start, stop
 *
 */

define(['lib/player'], function (Player) {

    var canvas, context, w, h, interval;

    var exports = {
        buffer: null
    };

    var drawMonitor = new Stats();

    var setRate = function(rate) {
        player.fps = rate;
        interval = 1000 / rate;
    };

    var resize = function() {
        w = canvas.width = canvas.clientWidth;
        h = canvas.height = canvas.clientHeight;
    };

    var setCanvas = function(newCanvas) {
        if (canvas)
            canvas.removeEventListener('resize',resize);
        canvas = newCanvas;
        canvas.addEventListener('resize',resize);
        context = canvas.getContext('2d');
        resize();
    };

    var redrawCanvas = function (timestamp, offsetTime) {

        while((offsetTime-interval) > interval) {
            console.log("better slow down, it hadn't been drawn yet...");
            exports.buffer.read();
            offsetTime -= interval;
        }

        drawMonitor.begin();

        if (exports.buffer.empty) {
            drawMonitor.end();
            return;
        }

        var msg = exports.buffer.read();

        if (!msg) {
            drawMonitor.end();
            return;
        }

        var nSig = msg.nSignals,
            nSamp = ~~ (msg.data.length / msg.nSignals),
            data = msg.data;

        // Clear background
        context.fillStyle = '#000';
        context.fillRect(0, 0, w, h);

        context.lineWidth = 2;

        var heightSlot = h / nSig;

        for (var i = 0; i < nSig; i++) {
            context.beginPath();
            var lastIdx = 0;
            var centerY = ~~ ((heightSlot*i + (heightSlot/2.0)) + 0.5);
            for (var t = 0; t < w; t++) {
                var idx = ~~ ((t / w) * nSamp);
                if (idx > lastIdx) {
                    var y = ~~ ( ( data[((nSamp*i) + idx)] *
                        (heightSlot/2.1) ) + centerY + 0.5 );
                    if (t === 0)
                        context.moveTo(t, y);
                    context.lineTo(t, y); // Bottom Right
                    lastIdx = idx;
                }
            }
            context.strokeStyle = colors[i%colors.length];
            context.stroke();
            context.closePath();
        }

        drawMonitor.end();

    };

    var player = new Player(redrawCanvas,25);

    drawMonitor.setMode(0);

    exports.update = redrawCanvas;
    exports.setCanvas = setCanvas;
    exports.setRate = setRate;
    exports.start = player.start;
    exports.stop = player.stop;
    exports.monitor = drawMonitor;

    return exports;

});