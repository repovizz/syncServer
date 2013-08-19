/* JavaScript Module Definition
 *
 * Name: Player
 * Dependencies: EventJS
 * Publishes: start, stop, update
 * Provides: start, stop, seek, isLooping, offset
 *
 */

define([], function() {

    var Player = function(callback,fps) {

        // Register events that will be triggered
        Eventjs(this,'start', 'stop', 'update');

        var _this = this,       // copy of self
            _looping = false,   // are we looping?
            _startOffset = 0,   // offset time where playback started
            _startTime = 0,     // timestamp where playback started
            _lastTime = 0;      // timestamp from previous render

        this.pointer = null;    // reference to the AnimationFrame request
        this.offset = 0;        // offset time (i.e. cursor position)
        this.fps = fps || 0;    // maximum update rate (usually defaults to 60)

        this.start = function(fps) {
            if (fps !== undefined)
                _this.fps = fps;
            if (_looping) return;
            _looping = true;
            _startTime = Date.now();
            _lastTime = _startTime;
            _startOffset = _this.offset;
            _this.trigger('start');
            _this._loop();
        };

        this.stop = function() {
            _looping = false;
            _this.trigger('stop');
            cancelAnimationFrame(_this.pointer);
        };

        this.seek = function(where) {
            if (where !== undefined)
                _this.offset = where;
            _startOffset = _this.offset;
            _startTime = Date.now();
            _lastTime = _startTime;
            if (!_looping)
                _this.trigger('update', where);
        };

        this.isLooping = function() {
            return _looping;
        };

        this._loop = function() {
            _this.pointer = requestAnimationFrame(_this._loop);
            var now = Date.now(),
                delta = now - _lastTime;
            if (! (_this.fps && delta < 1000/_this.fps) ) {
                _lastTime = now - (delta % (1000/_this.fps));
                _this.offset = _startOffset + (now - _startTime);
                _this.trigger('update', _this.offset, _this.delta);
            }
        };

        if (callback)
            this.on('update',callback);

        return this;

    };

    return Player;

});