// This is the class that represents the stream entity
// It listens to new frames, buffers them and dispatches animation events

define(['entities','backbone', 'base64'],
function(Entities, Backbone) {

    var Stream = Backbone.Model.extend({
        initialize: function(attrs, opts) {
            Entities.stream.add(this);
            this.on('backend:frame', function(meta, frame) {
                frame = Base64Binary.decode(frame);
                this.trigger('frame', frame, meta);
            }, this);
        }
    });

    return Stream;

});