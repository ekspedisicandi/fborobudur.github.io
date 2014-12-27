////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Bottom nav bar for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.BottomNav = function(selector) {

	var _public = {

		//------------------------------------------------
		// Slides up from bottom
		//------------------------------------------------
		show: function() {
			_private.SELECTOR.stop().show().animate({bottom: 0}, 400, "easeInOutQuad");
		},

		//------------------------------------------------
		// Immediately moves down off-screen
		//------------------------------------------------
		hide: function() {
			_private.SELECTOR.stop().css({bottom: "-40px"}).hide();
		}
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
		}
	};

	_private.init();
	return _public;
};