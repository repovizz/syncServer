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
		else if (message.frameRate)
			self.interval = (1 / message.frameRate) * 1000;
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
	var signal = new Buffer(this.frameLength * 4);
	for (var i = 0; i < this.frameLength; ++i) {
		var value = Math.round(Math.random()*255);
		signal.writeUInt8(value, i);
	}
	client.publish('stream:'+this.id+':pipe', signal, noop);
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