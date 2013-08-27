/* JavaScript Class Definition
 *
 * Name: Video
 * Dependencies: Widget
 * Descriptions: Displays images as they arrive as frames
 *
 */

define(['components/widget'],
function(Widget) {

    var Video = function(id, container, stream) {
        var self = this;
        Widget.apply(this, arguments);

        this.$image = $('<img class="expand"></img>');
        this.$el.append(this.$image);
        if (stream) this.setStream(stream);

        return this;
    };

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
