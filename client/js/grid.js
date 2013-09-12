// THIS IS NO LONGER USED BECAUSE GRIDSTER WAS BUGGY
// I'LL LEAVE IT FOR A FEW COMMITS IN CASE I TRY TO FIX IT

define(['utils/promise','jquery-ui','gridster'], function(Promise) {

    var Grid = new Promise([
        'serialize','add_widget','remove_widget','resize_widget',
        'serialize_changed','enable','disable'
    ]);

    $(function(){ //DOM Ready

        var margin = Config.widget.margin,
            size = Config.widget.size,
            fullSize = size + 2*margin;

        var gridster = $(".gridster").gridster({
            widget_margins: [margin,margin],
            widget_base_dimensions: [size, size],
            widget_selector: "div",
            avoid_overlapped_widgets: true,
            serialized_params: function($w, wgd) { return wgd; }
        }).data('gridster');

        function resizeBlock(ui) {
            var grid_w = ~~((ui.size.width + 2*margin) / fullSize + 0.5);
            var grid_h = ~~((ui.size.height + 2*margin) / fullSize + 0.5);
            gridster.resize_widget(ui.element, grid_w, grid_h);
            Grid.trigger('resize',{
                id: ui.element.get('id'),
                width: grid_w,
                height: grid_h
            });
        }

        $('.widget').resizable({
            grid: [fullSize,fullSize],
            animate: false,
            containment: '.gridster',
            autoHide: true,
            stop: function(event,ui) {
                _.delay(resizeBlock,100,ui);
            }
        });

        $('.ui-resizable-handle').hover(function() {
            gridster.disable();
        }, function() {
            gridster.enable();
        });

        Grid.bind(gridster);
        Grid.resolve();

    });

    return Grid;

});