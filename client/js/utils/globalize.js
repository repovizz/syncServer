/*
 * Shim that exposes AMD modules as global variables
 * Very useful for debugging on the console
 */

window.globalize = function(module, name) {
	if (!name) name = module;
	require([module], function(obj) {
		window[name] = obj;
	});
};