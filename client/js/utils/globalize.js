window.globalize = function(module, name) {
	name || (name = module);
	require([module], function(obj) {
		window[name] = obj;
	});
};