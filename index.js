"use strict";

const { viewFor }			= require("sdk/view/core");
const { browserWindows }	= require("sdk/windows");

const window_utils			= require("sdk/window/utils");


const initials = {
	gBrowser__replaceTabWithWindow: {}
};

function patch (window) {
	const window_id = window_utils.getOuterId(window);
	initials.gBrowser__replaceTabWithWindow[window_id] = window.gBrowser.replaceTabWithWindow;

	window.gBrowser.replaceTabWithWindow = function () {}
}
function unpatch (window) {
	const window_id = window_utils.getOuterId(window);

	window.gBrowser.replaceTabWithWindow = initials.gBrowser__replaceTabWithWindow[window_id];
	delete initials.gBrowser__replaceTabWithWindow[window_id];
}


function get_windows () {
	return window_utils.windows(null, { includePrivate: true });
}

function startup () {
	get_windows().forEach(patch);
	browserWindows.on("open", window => {
		patch(viewFor(window));
	});
}
function shutdown () {
	get_windows().forEach(unpatch);
}

exports.main = startup;
exports.onUnload = shutdown;
