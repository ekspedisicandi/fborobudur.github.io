var NATION = NATION || {};

NATION.Utils = (function() {

	var _public = {

		//------------------------------------------------
		// Dynamically generate a namespace from a string
		//------------------------------------------------
		createNamespace: function(namespace) {
			var parts = namespace.split("."),
			parent = window,
			currentPart = "",
			i = 0, length = parts.length;

			for (; i < length; i++) {
				currentPart = parts[i];
				parent[currentPart] = parent[currentPart] || {};
				parent = parent[currentPart];
			}
			return parent;
		},

		//------------------------------------------------
		// Check if an event exists in current browser
		//------------------------------------------------
		isEventSupported: function(eventName) {
			var TAGNAMES = {
				"select": "input", "change": "input",
				"submit": "form", "reset": "form",
				"error": "img", "load": "img", "abort": "img"
			}
			var element = document.createElement(TAGNAMES[eventName] || "div");
			eventName = "on" + eventName;
			var isSupported = (eventName in element);
			if (!isSupported) {
				element.setAttribute(eventName, "return;");
				isSupported = typeof element[eventName] === "function";
			}
			element = null;
			return isSupported;
		},

		//------------------------------------------------
		// Convert a string to camelcase formatting
		//------------------------------------------------
		camelcaseString: function(value) {
			return value.replace(/(?:^|\s)\w/g, function(match) {
				return match.toUpperCase();
			});
		}
	};

	return _public;
}());