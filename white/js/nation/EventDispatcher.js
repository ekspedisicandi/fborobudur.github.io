////////////////////////////////////////////////////////////////////////////////
// Nation Library
// Basic Event Dispatcher
////////////////////////////////////////////////////////////////////////////////
var NATION = NATION || {};

NATION.EventDispatcher = function() {

	var _public = {

		//------------------------------------------------
		// Add event listener
		//------------------------------------------------
		addListener: function(type, handler) {
			if (type === "mousewheel") {
				type = _private.normaliseMouseWheelEvent();
			}

			if (typeof _private.eventHandlers[type] === "undefined") {
				_private.eventHandlers[type] = [];
			}
			_private.eventHandlers[type].push(handler);
		},

		//------------------------------------------------
		// Remove event listener
		//------------------------------------------------
		removeListener: function(type, handler) {
			if (type === "mousewheel") {
				type = _private.normaliseMouseWheelEvent();
			}
			if (_private.eventHandlers[type] instanceof Array) {
				var handlers = _private.eventHandlers[type],
				i = 0, length = handlers.length;
				// Remove all handlers for this type
				if (!handler) {
					_private.eventHandlers[type] = [];
					return;
				}
				// Remove a specific handler
				for (; i < length; i++) {
					if (String(handlers[i]) === String(handler)) {
						handlers.splice(i, 1);
					}
				}
			}
		},

		//------------------------------------------------
		// Trigger an event on this object
		//------------------------------------------------
		trigger: function(type) {
			var i = 0, length, listeners, listener, event,
			args = Array.prototype.slice.call(arguments).splice(2);
			if (type === "mousewheel") {
				type = _private.normaliseMouseWheelEvent();
			}
			if (typeof type === "string") {
				event = {type: type};
			} else {
				event = type;
			}
			if (!event) {
				throw new Error("Type is undefined");
			}
			if (!event.target) {
				event.target = this;
			}
			if (!event.type) {
				throw new Error("Object missing 'type' property");
			}
			if (_private.eventHandlers[event.type] instanceof Array) {
				listeners = _private.eventHandlers[event.type];
				length = listeners.length;
				args.unshift(event);
				for (; i < length; i++) {
					listener = listeners[i];
					if (listener) {
						listener.apply(this, args);
					}
				}
			}
		}
	};

	var _private = {

		//------------------------------------------------
		// Variables
		//------------------------------------------------
		eventHandlers: [],

		//------------------------------------------------
		// Handle mouse events in lesser browsers
		//------------------------------------------------
		normaliseMouseWheelEvent: function() {
			if (!NATION.Utils.isEventSupported("mousewheel")) {
				type = "DOMMouseScroll";
			}
			return type;
		}
	}

	return _public;
};