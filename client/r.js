require.config({
    baseUrl: "./",
    paths: {
        jquery: "vendor/jquery/jquery",
        requirejs: "vendor/requirejs/require",
        "socket.io": "vendor/socket.io/index",
        async: "vendor/requirejs-plugins/src/async",
        json: "vendor/requirejs-plugins/src/json",
        text: "vendor/requirejs-plugins/lib/text",
        backbone: "vendor/backbone-amd/backbone",
        gridster: "vendor/gridster/dist/jquery.gridster",
        underscore: "vendor/underscore-amd/underscore"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        underscore: {
            exports: "_"
        }
    }
});