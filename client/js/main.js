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

// Require globally available stuff
require(['jquery', 'underscore'], function() {

    // Now do all the bindings

    require(['entities','components/widget'], function(Entities,Widget) {
        // Take some predefined widgets and sync them
        $('.widget').each(function() {
            var w = new Widget(Math.random(), $('.container'));
            w.$el.append(this);
            Entities.widget.add(w.model);
        });
        // Create a shared widget, just for fun
        window.w = new Widget(1, $('.container'));
        Entities.widget.add(window.w.model);
    });

    // Expose some modules for easy hacking on-the-fly
    globalize('entities');
    globalize('components/widget');

});
