////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Cinemagraph Hotspots
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.global.cinemagraph");

BARBOUR.christmas.views.global.cinemagraph.Hotspots = function(selector) {

	var _public = NATION.EventDispatcher();

	//------------------------------------------------
	// Returns hotspot's ID
	//------------------------------------------------
	_public.getClickedHotspotID = function() {
		return _private.clickedHotspotID;
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		hotspots: [],
		clickedHotspotID: 0,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.positionHotspots();
			this.createListeners();
		},

		//------------------------------------------------
		// Set top and left on each hotspot
		//------------------------------------------------
		positionHotspots: function() {
			var hotspots = this.SELECTOR.find("li");
			var i = 0, length = hotspots.length, hotspot = null, xPos = 0, yPos = 0;
			for (; i < length; i++) {
				hotspot = new BARBOUR.christmas.views.global.cinemagraph.SingleHotspot($(hotspots[i]));
			}
		},

		//------------------------------------------------
		// Listen for user interaction
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find("a").on("click", function(e) {_private.onHotspotClicked(e);});
		},

		//------------------------------------------------
		// Signal a hotspot has been clicked
		//------------------------------------------------
		onHotspotClicked: function(e) {
			this.clickedHotspotID = this.SELECTOR.find("a").index(e.currentTarget);
			_public.trigger(BARBOUR.christmas.Events.HOTSPOT_CLICKED)
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};