require.config({
    "baseUrl": "js",
    "paths": {
        "jquery": "../vendor/jquery/jquery",
        "requirejs": "../vendor/requirejs/require",
        "socket.io": "../vendor/socket.io-client/dist/socket.io",
        "async": "../vendor/requirejs-plugins/src/async",
        "json": "../vendor/requirejs-plugins/src/json",
        "text": "../vendor/requirejs-plugins/lib/text",
        "backbone": "../vendor/backbone-amd/backbone",
        "gridster": "../vendor/gridster/dist/jquery.gridster",
        "underscore": "../vendor/underscore-amd/underscore",
        "bootstrap": "../vendor/bootstrap/dist/js/bootstrap.js",
        "backbone.io": "../vendor/backbone.io",
        "jquery-ui": "../vendor/jquery-ui",
        "jquery-migrate": "../vendor/jquery-migrate"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        },
        "underscore": {
            "exports": "_"
        },
        "backbone.io": {
            "deps": ["backbone", "socket.io"],
            "exports": "Backbone.io"
        },
        "gridster": {
            "deps": ["jquery-migrate"]
        }
    }
});

define(['jquery', 'underscore'], function() {

    require(['gridster', 'jquery-ui'], function() {

        $(function(){ //DOM Ready

            var gridster = $(".gridster").gridster({
                widget_margins: [10, 10],
                widget_base_dimensions: [140, 140],
                widget_selector: "div"
            }).data('gridster');

            console.log(gridster);

            var grid_size = 10,
                grid_margin = 2;

            $('.ui-resizable-handle').hover(function() {
                gridster.disable();
            }, function() {
                gridster.enable();
            });

            function resizeBlock(elmObj) {

                elmObj = $(elmObj);
                var w = elmObj.width() - grid_size;
                var h = elmObj.height() - grid_size;

                for (var grid_w = 1; w > 0; w -= (grid_size + (grid_margin * 2))) {

                    grid_w++;
                }

                for (var grid_h = 1; h > 0; h -= (grid_size + (grid_margin * 2))) {

                    grid_h++;
                }

                gridster.resize_widget(elmObj, grid_w, grid_h);
            }

            $('.widget').resizable({
                grid: [grid_size + (grid_margin * 2), grid_size + (grid_margin * 2)],
                animate: false,
                minWidth: grid_size,
                minHeight: grid_size,
                containment: '.gridster',
                autoHide: true,
                stop: function() {
                    var resized = $(this);
                    setTimeout(function() {
                        resizeBlock(resized);
                    }, 300);
                    gridster.enable();
                },
                start: function() {
                    gridster.disable();
                }
            });

        });

        require(['entities'], function(entities) {
            console.log(entities);
        });

    });

/*
    require(['jquery-ui'], function() {
        $(".widgets").sortable({
            grid: [10, 10]
        });
    });
*/

});
