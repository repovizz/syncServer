// This is the class that represents the stream entity
// It listens to new frames, buffers them and dispatches animation events

define(['entities','utils/buffer','utils/player'],
function(Entities, Buffer, Player) {

    var Stream = Backbone.Model.extend({
        initialize: function(attrs, opts) {
            this.on('backend:frame', function(frame) {
                this.trigger('frame', frame);
            }, this);
            Entities.stream.add(this);
        }
    });

    // var Stream = function(id) {
    //     this.model = Entities.stream.create({id: id});
    //     this.model.on('backend:frame', function(frame) {
    //         this.buffer.push(frame);
    //         this.trigger('frame', frame);
    //     });
    //     return this;
    // };

    return Stream;

});