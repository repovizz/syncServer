// Load globally available modules before starting
// Loading touch-punch will already load jquery-ui and jquery
require(['jquery-touch-punch', 'bootstrap', 'underscore', 'utils/rAF'], function() {

    // Now do all the bindings
    require(['components/scope','components/video', 'entities/stream'],
    function(Scope, Video, Stream) {

        // Create some widgets after the page loads
        $(function() {

            // Some scopes
            var stream, scope, i;
            for (i = 1; i < 3; i++) {
                stream = new Stream({id:i});
                scope = new Scope(Config.sessionID+i, $('.widgets'), stream);
                scope.title('Fake source #' + i);
            }

            // A XKCD video feed
            // window.videoFeed = new Stream({id:'videoFeed'}, {raw: true});
            // window.video = new Video(Config.sessionID+'videoFeed', $('.widgets'), videoFeed);
            // video.title('XKCD Fun :)');

            // And the super-duper C sources

            window.cStream = new Stream({id:'c_stream'});
            window.cScope = new Scope(Config.sessionID+'c', $('.widgets'), cStream);
            cScope.title('Look ma, no javascript!');

        });
    });

    // Expose some modules for easy on-the-fly hacking
    require(['utils/globalize'], function() {
        // globalize('entities');
    });

});
