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
        "gridster": "../vendor/jquery.gridster",
        "underscore": "../vendor/underscore-amd/underscore",
        "bootstrap": "../vendor/bootstrap/dist/js/bootstrap.js",
        "backbone.io": "../vendor/backbone.io",
        "jquery-ui": "../vendor/jquery-ui",
        "jquery-migrate": "../vendor/jquery-migrate",
        "jquery-touch-punch": "../vendor/jquery.ui.touch-punch"
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
        },
        "jquery-ui": {
            "deps": ["jquery-touch-punch"]
        }
    }
});

// Require globally available stuff
require(['jquery', 'underscore', 'utils/rAF'], function() {

    // Now do all the bindings
    require(['components/widget','components/scope','stream'],
    function(Widget,Scope,Stream) {
        // Create some widgets

        window.w = new Widget(1, $('.container'));

        window.stream = new Stream({id: 1});
        window.scope = new Scope(2, $('.container'), stream);

    });

    // Expose some modules for easy hacking on-the-fly
    require(['utils/globalize'], function() {
        globalize('entities');
        globalize('components/widget');
    });

});
