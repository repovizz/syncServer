// This is the class that represents the stream entity
// It listens to new frames, buffers them and dispatches animation events

define(['entities','backbone'],
function(Entities, Backbone) {

    var Stream = Backbone.Model.extend({
        initialize: function(attrs, opts) {
            this.on('backend:frame', function(meta, frame) {
                frame = new Float32Array(frame);
                this.trigger('frame', frame, meta);
            }, this);
            Entities.stream.add(this);
        }
    });

    return Stream;

});