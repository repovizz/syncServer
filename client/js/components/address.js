/* JavaScript Class Definition
 *
 * Name: Address
 * Dependencies: Widget
 * Descriptions: Displays an address selector
 *
 */

define(['entities/widget'],
function(Widget) {

    var Address = function(id, container, stream) {
        var self = this;
        Widget.apply(this, arguments);

        this.$el.addClass('address');
        this.$form = $('<div class="form-group"><label for="address">Register address</label><input type="text" class="form-control" id="address" placeholder="Address"></div>');
        this.$input = this.$form.find('#address');
        this.$el.append(this.$form);
        this.stream = stream;

        var that = this;
        this.stream.on('change:address', function(foo, add) {
            that.$input.val(add.toString(16));
        });

        this.$input.change(function(ev) {
            ev.preventDefault();
            that.stream.set('address', parseInt(that.$input.val(), 16));
        });

        return this;
    };

    // Inherit methods from Widget
    _.extend(Address.prototype, Widget.prototype);

    return Address;

});
