var redis = require('redis');
var EventEmitter = require('events').EventEmitter;

var client = redis.createClient();
var listener = redis.createClient();
var events = new EventEmitter();

var noop = function(){};

var Stream = function(id) {
	this.id = id;
	this.frameLength = 128;
	this.dimensions = 1;
	this.frameRate = 12;
	// Subscribe to parameter changes from the client
	listener.subscribe('stream:'+id+':feed');
	events.on(id + ':update', function(message) {
		if (message.model.frameLength)
			this.frameLength = message.model.frameLength;
		else if (message.model.frameRate)
			this.interval = 1 / message.model.frameRate;
	});
	// Create the entity in the DB
	var defaults = {
		id: id,
		frameLength: 128,
		dimensions: 1,
		frameRate: 12
	};
	var message = {
		// little hack because we're not creating it every time
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
	var signal = new Buffer(this.frameLength * 2);
	for (var i = 0; i < this.frameLength; ++i) {
		signal.writeFloatLE(Math.random() * 2 - 1, i);
	}
	client.publish('stream:'+this.id+':pipe', signal, noop);
	setTimeout(this.newFrame.bind(this), this.interval);
};

listener.on('message', function(channel, data) {
	channel = channel.split(':');
	data = JSON.parse(data);
	events.trigger(channel[1]+':'+data.method, data);
});

new Stream(1);
new Stream(2);