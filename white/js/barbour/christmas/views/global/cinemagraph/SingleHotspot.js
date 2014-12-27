////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Cinemagraph Hotspots
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.global.cinemagraph");

BARBOUR.christmas.views.global.cinemagraph.SingleHotspot = function(selector) {

	var _public = new NATION.Sprite(selector.find("a"), 54, false, 24);

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.positionHotspot();
			this.createListeners();
		},

		//------------------------------------------------
		// Set initial position
		//------------------------------------------------
		positionHotspot: function() {
			var xPos = this.SELECTOR.data("xpos");
			var yPos = this.SELECTOR.data("ypos");
			this.SELECTOR.css({left: xPos + "%", top: yPos + "%"});
		},

		//------------------------------------------------
		// Control sprite animation
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.on("mouseenter", function(e) {_private.onMouseEnter(e);});
			this.SELECTOR.on("mouseleave", function(e) {_private.onMouseLeave(e);});
		},

		//------------------------------------------------
		// Enlarge hotspot by playing sprite animation
		//------------------------------------------------
		onMouseEnter: function(e) {
			_public.animateTo(_public.getTotalFrames()-1);
		},

		//------------------------------------------------
		// Shrink hotspot by reversing animation
		//------------------------------------------------
		onMouseLeave: function(e) {
			_public.animateTo(0);
		}
	};

	_private.init();
	return _public;
};