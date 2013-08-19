/* JavaScript Module Definition
 *
 * Name: Buffer
 * Dependencies: 
 * Publishes: update, empty, full
 * Provides: read, write, size, overwrite, empty
 *
 * Implements a Producer/Consumer style queue
 *
 */

define([], function () {

    var Buffer = function(size) {

        Eventjs(this,'update','empty','full');

        this.size = size || 128;
        this.empty = true;
        this.overwrite = true;

        var buffer = [];
        var _this = this;

        this.read = function() {
            if (buffer.length === 1) {
                this.trigger('empty');
                this.empty = true;
            }
            if (buffer.length > 0) {
                return buffer.shift();
            } else {
                console.log("Error: buffer empty.");
            }
        };

        this.write = function(msg) {
            if (buffer.length === _this.size - 1) {
                _this.trigger('full');
            }
            if (buffer.length >= _this.size) {
                if (_this.overwrite) {
                    buffer.shift();
                    _this.write(msg);
                }
                console.log("Error: buffer full.");
            } else {
                _this.empty = false;
                buffer.push(msg);
                _this.trigger('update');
            }
        };

        this.flush = function() {
            buffer = [];
            _this.empty = true;
            _this.trigger('empty');
        };

    };

    return Buffer;

});