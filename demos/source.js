var redis = require('redis');
var EventEmitter = require('events').EventEmitter;

var client = redis.createClient();
var listener = redis.createClient();
var events = new EventEmitter();

var noop = function(){};

var Stream = function(id) {
    var self = this;
    this.id = id;
    this.frameLength = 256;
    this.dimensions = 1;
    this.interval = 100;
    // Subscribe to parameter changes from the client
    listener.subscribe('stream:'+id+':feed');
    events.on(id + ':update', function(message) {
        if (!message) return;
        if (message.frameLength)
            self.frameLength = message.frameLength;
        if (message.frameRate)
            self.interval = (1 / message.frameRate) * 1000;
        if (message.frequency)
            self.frequency = message.frequency;
    });
    // Create the entity in the DB
    var defaults = {
        frameLength: 256,
        dimensions: 1,
        frameRate: 10
    };
    var message = {
        // little hack because we're not creating it at every run
        method: 'update',
        clientID: 'fakeStreams',
        timestamp: new Date().getTime(),
        data: defaults
    };
    client.multi()
        .sadd('stream',id)
        .hmset('stream:'+id, defaults)
        .publish('stream:'+id+':feed', JSON.stringify(message))
        .exec();
    // Start generating data
    this.newFrame();
};

Stream.prototype.newFrame = function() {
    this.oldFrame = this.frame;
    this.frame = new Buffer(this.frameLength*2);
    var i;
    var smooth = this.oldFrame && this.oldFrame.length >= this.frame.length;
    var value;
    for (i = 0; i < this.frameLength; ++i) {
        if (smooth) value = 0.5 * value + 0.5 * this.oldFrame.readUInt8(i);
        value = value + (Math.random()-0.5) * 40;
        value = Math.round(value);
        value = Math.max(value, 0) || 0;
        value = Math.min(value, 255);
        this.frame.writeUInt8(value, i);
    }
    client.publish('stream:'+this.id+':pipe', this.frame, noop);
    this.timer = setTimeout(this.newFrame.bind(this), this.interval);
};

listener.on('message', function(channel, message) {
    channel = channel.split(':');
    message = JSON.parse(message);
    if (message.method == 'update') {
        events.emit(channel[1]+':'+message.method, message.data);
    }
});

new Stream(1);
new Stream(2);
new Stream(3);
new Stream(4);
new Stream(5);