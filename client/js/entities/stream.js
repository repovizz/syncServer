// This is the class that represents the stream entity
// It listens to new frames, buffers them and dispatches animation events

define(['entities','backbone', 'utils/base64-binary'],
function(Entities, Backbone, Base64Binary) {

    var Stream = Backbone.Model.extend({
        initialize: function(attrs, opts) {
            opts || (opts = {});
            Entities.stream.add(this);

            this.on('backend:frame', function(meta, frame) {
                if (! opts.raw)
                    frame = Base64Binary.decode(frame);
                this.trigger('frame', frame, meta);
            }, this);
        }
    });

    return Stream;

});