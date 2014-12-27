////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Instructional panel for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.HelpPanel = function(selector) {

	var _public = {

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