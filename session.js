define(['sockets','backbone'], function(sockets,Backbone) {

    var widgets = new Backbone.Collection({
        model: Widget,
        layout: new Layout()
    });

    sockets.session.on('create', function(data) {
        widgets.add(new Widget());
    });

    return ;

});