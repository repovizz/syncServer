var redis = require('redis');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

var client = redis.createClient();
var listener = redis.createClient();
var events = new EventEmitter();

var noop = function(){};

var VideoStream = function(id) {
    var self = this;
    this.id = id;
    this.format = 'png';
    this.interval = 500;
    // Subscribe to parameter changes from the client
    listener.subscribe('stream:'+id+':feed');
    events.on(id + ':update', function(message) {
        if (!message) return;
        if (message.frameRate) {
            var frameRate = parseFloat(message.frameRate);
            self.interval = (1 / frameRate) * 1000;
        }
    });
    // Create the entity in the DB
    var defaults = {
        format: 'png',
        frameRate: 2
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
    this.files = fs.readdirSync(__dirname+'/images').map(function(name) {
        return fs.readFileSync(__dirname+'/images/'+name);
    });

    this.newFrame();
};

VideoStream.prototype.newFrame = function() {
    var frame = this.files.pop();
    this.files.unshift(frame);
    client.publish('stream:'+this.id+':pipe', frame, noop);
    this.timer = setTimeout(this.newFrame.bind(this), this.interval);
};

listener.on('message', function(channel, message) {
    channel = channel.split(':');
    message = JSON.parse(message);
    if (message.method == 'update') {
        events.emit(channel[1]+':'+message.method, message.data);
    }
});

new VideoStream('videoFeed');