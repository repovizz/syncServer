/* JavaScript Class Definition
 *
 * Name: Video
 * Dependencies: Widget, Slider
 * Descriptions: Displays images as they arrive as frames
 *
 */

define(['entities/widget','components/slider'],
function(Widget, Slider) {

    var Video = function(id, container, stream) {
        var self = this;
        Widget.apply(this, arguments);

        this.$el.addClass('video');
        this.$image = $('<img/>');
        this.$el.append(this.$image);
        if (stream) this.setStream(stream);
        var slider = new Slider(
            'frameRate',
            this.stream,
            {min:1, max:10},
            this.$el
        );

        return this;
    };

    // Inherit methods from Widget
    _.extend(Video.prototype, Widget.prototype);

    Video.prototype.render = function(data, meta) {
        if (!data) return;
        var format = this.stream.get('format');
        this.$image.attr('src', 'data:image/'+format+';base64,'+data);
    };

    Video.prototype.setStream = function(stream) {
        if (this.stream) this.stream.off('frame', this.render, this);
        this.stream = stream;
        this.stream.on('frame', this.render, this);
    };

    return Video;

});
