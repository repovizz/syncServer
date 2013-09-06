// Load globally available modules before starting
// Loading touch-punch will already load jquery-ui and jquery
require(['jquery-touch-punch', 'underscore', 'utils/rAF'], function() {

    // Now do all the bindings
    require(['components/scope','components/video','entities/stream'],
    function(Scope, Video, Stream) {
        // Create some widgets after the page loads
        $(function() {
            var stream, scope, i;
            for (i = 1; i < 3; i++) {
                stream = new Stream({id:i});
                scope = new Scope(Config.sessionID+i, $('.widgets'), stream);
            }
            window.videoFeed = new Stream({id:'videoFeed'}, {raw: true});
            window.video = new Video(Config.sessionID+'videoFeed', $('.widgets'), videoFeed);
        });
    });

    // Expose some modules for easy hacking on-the-fly
    require(['utils/globalize'], function() {
        globalize('entities');
        globalize('entities/widget');
    });

});
