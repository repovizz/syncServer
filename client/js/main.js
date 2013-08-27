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
        "underscore": "../vendor/underscore-amd/underscore",
        "bootstrap": "../vendor/bootstrap/dist/js/bootstrap.js",
        "backbone.io": "../vendor/backbone.io",
        "jquery-ui": "../vendor/jquery-ui",
        "jquery-touch-punch": "../vendor/jquery.ui.touch-punch",
        "base64": "../vendor/base64-binary",
        "jquery-knob": "../vendor/jquery-knob/js/jquery.knob"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        },
        "underscore": {
            "exportsvide": "_"
        },
        "backbone.io": {
            "deps": ["backbone", "socket.io"],
            "exports": "Backbone.io"
        }
    }
});

// Require globally available stuff
require(['jquery', 'underscore', 'utils/rAF'], function() {

    // Make sure that touch-punch is loaded after jquery-ui
    // and jquery-ui after jquery
    require(['jquery-ui'], function() {
        require(['jquery-touch-punch']);
    });

    // Now do all the bindings
    require(['components/scope','components/video','stream',],
    function(Scope, Video, Stream) {
        // Create some widgets after the page loads
        $(function() {
            var stream, scope, i;
            for (i = 1; i < 3; i++) {
                stream = new Stream({id: i});
                scope = new Scope(i, $('.widgets'), stream);
            }
            window.videoFeed = new Stream({id:'videoFeed'}, {raw: true});
            window.video = new Video('videoFeed', $('.widgets'), videoFeed);
        });
    });

    // Expose some modules for easy hacking on-the-fly
    require(['utils/globalize'], function() {
        globalize('entities');
        globalize('components/widget');
    });

});
