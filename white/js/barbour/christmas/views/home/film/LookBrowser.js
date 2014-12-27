////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Look browser for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.flim");

BARBOUR.christmas.views.home.film.LookBrowser = function(selector) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Slide open panel and change visible look
	//------------------------------------------------
	_public.show = function(lookID) {
		_private.prepareLook(lookID);
		_private.SELECTOR.stop().show().animate({left: "33.3%"}, 600, "easeInOutQuad");
		_private.SELECTOR.find(".win-promo").show();
	};

	//------------------------------------------------
	// Slide panel off-screen to the right
	//------------------------------------------------
	_public.hide = function(immediate) {
		if (immediate) {
			_private.SELECTOR.stop().css({left: "100%"}).hide();
		} else {
			_private.SELECTOR.stop().animate({left: "100%"}, 600, "easeInOutQuad", function() {_private.onPanelHidden();});
		}
	};

	//------------------------------------------------
	// Reset to first slide
	//------------------------------------------------
	_public.reset = function() {
		var i = 0, length = _private.slideshows.length;
		for (; i < length; i++) {
			_private.slideshows[i].reset();
		}
	};

	//------------------------------------------------
	// Returns ID of look currently in slideshow
	//------------------------------------------------
	_public.getCurrentLookID = function() {
		return _private.currentLookID;
	};

	//------------------------------------------------
	// Returns ID of cinemagraph relating to this look
	//------------------------------------------------
	_public.getCurrentCinemagraphID = function() {
		return _private.cinemagraphID;
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		slideshows: [],
		currentLookID: 0,
		cinemagraphID: 0,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.createSlideshows();
			this.createListeners();
		},

		//------------------------------------------------
		// Unique slideshow for each look
		//------------------------------------------------
		createSlideshows: function() {
			this.slideshows = [];
			var looks = this.SELECTOR.find(".look");
			var slideshow = null, i = 0, length = looks.length;
			for (; i < length; i++) {
				slideshow = new BARBOUR.christmas.views.home.film.LookSlideshow(looks[i]);
				this.slideshows.push(slideshow);
			}
		},

		//------------------------------------------------
		// Listen for user interaction
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".back-button").on("click", function(e) {_private.onBackButtonClicked(e);});
			this.SELECTOR.find(".win-promo a").on("click", function(e) {_private.onWinPromoClicked(e);});
		},

		//------------------------------------------------
		// Hide other looks
		//------------------------------------------------
		prepareLook: function(lookID) {
			this.currentLookID = lookID;
			this.cinemagraphID = this.SELECTOR.find(".all-looks .look").eq(lookID).data("cinemagraph-id");
			// Only show the win promo if there is a matching cinemagraph to link to
			if (this.cinemagraphID > 0) {
				this.SELECTOR.find(".win-promo a").show();
			} else {
				this.SELECTOR.find(".win-promo a").hide();
			}
			this.SELECTOR.find(".all-looks>li").not(":eq(" + lookID + ")").hide();
			this.SELECTOR.find(".all-looks>li").eq(lookID).show();
			if (this.cinemagraphID > 0) {
				this.SELECTOR.find(".win-promo a").attr("href", "#cinemagraph-" + this.cinemagraphID);
			}
		},

		//------------------------------------------------
		// Remove panel from display (to hide back button)
		//------------------------------------------------
		onPanelHidden: function() {
			this.SELECTOR.hide();
			this.slideshows[this.currentLookID].reset();
		},

		//------------------------------------------------
		// Signal that panel is hiding
		//------------------------------------------------
		onBackButtonClicked: function(e) {
			_public.hide();
			_public.trigger(BARBOUR.christmas.Events.CLOSE_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Signal that the promo has been clicked
		//------------------------------------------------
		onWinPromoClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.PROMO_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};