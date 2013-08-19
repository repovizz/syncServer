// This is the class that represents the stream entity
// It listens to new frames, buffers them and dispatches animation events

define(['entities','buffer','player'], function(Entities, Buffer, Player) {

    var Stream = function(id) {
        this.model = Entities.stream.create({id: id});
        this.model.on('backend:frame', function(frame) {
            this.buffer.push(frame);
        });
        return this;
    };

    return Stream;

});