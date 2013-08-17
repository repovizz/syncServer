define(['backbone'], function(Backbone) {

    var Promise = function(context, methods) {
        _.extend(this, Backbone.Events);
        if (_.isArray(context)) {
            methods = context;
            context = null;
        }
        this.bind(context || this, methods);
        this.callbacks = [];
        this.resolved = undefined;
    };

    Promise.prototype.proxy = function(methods) {
        this._methods = methods;
        _.each(methods, function(name, fun) {
            if (!fun) fun = name;
            if (_.isString(fun) && _.isFunction(this.context[fun])) {
                fun = _.bind(this.context[fun],this.context);
            }
            if (fun) {
                this[name] = function() {
                    var _fun = _.partial(fun, arguments);
                    this.then(_fun);
                };
            }
        });
    };

    Promise.prototype.bind = function(context, methods) {
        this.context = context;
        this.proxy(methods || this._methods);
    };

    Promise.prototype.then = function(callback) {
        if (this.resolved !== undefined) {
            callback.apply(this.context, this.resolved);
        } else {
            this.callbacks.push(callback);
        }
    };

    Promise.prototype.resolve = function() {
        if (this.resolved) throw new Error('Promise already resolved');

        var self = this;
        this.resolved = arguments;

        _.each(this.callbacks, function(callback) {
            callback.apply(self.context, self.resolved);
        });
    };

    return Promise;

});
