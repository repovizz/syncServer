// NOT BEING USED RIGHT NOW

define(['socket.io'], function(io) {

  // Hack socket.io to make it faster
  io.Transport.prototype.onData = function(data) {
    this.stillAlive = true;

    if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
      this.setCloseTimeout();
    }

    if (data !== '') {
      // todo: we should only do decodePayload for xhr transports
      var msgs = io.parser.decodePayload(data);
      if (msgs && msgs.length) {
        for (var i = 0, l = msgs.length; i < l; i++) {
          this.onPacket(msgs[i]);
        }
      }
      //this.onPacket(data);
    }

    return this;
  };

  io.Transport.prototype.setCloseTimeout = function () {
    if (!this.closeTimeout) {
      var self = this;

      this.closeTimeout = setTimeout(function () {
        if (self.stillAlive) {
          this.stillAlive = false;
          self.setCloseTimeout();
        }
        else
          self.onDisconnect();
      }, this.socket.closeTimeout);
    }
  };

});
