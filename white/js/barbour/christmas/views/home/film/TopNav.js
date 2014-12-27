////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Top nav bar for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.TopNav = function(selector) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Slides down from top
	//------------------------------------------------
	_public.show = function() {
		_private.SELECTOR.stop().animate({top: 0}, 400, "easeInOutQuad");
	};

	//------------------------------------------------
	// Immediately moves up off-screen
	//------------------------------------------------
	_public.hide = function() {
		_private.SELECTOR.stop().css({top: "-40px"});
	};

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
			this.createListeners();
		},

		//------------------------------------------------
		// Listen for user interaction
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".close").on("click", function(e) {_private.onCloseClicked(e);});
		},

		//------------------------------------------------
		// Signal a close is required
		//------------------------------------------------
		onCloseClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.CLOSE_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};