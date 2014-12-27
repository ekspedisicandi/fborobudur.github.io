////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Navigation between Cinemagraphs
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home");

BARBOUR.christmas.views.home.CinemagraphNavigation = function(selector) {

	var _public = NATION.EventDispatcher();

	//------------------------------------------------
	// Return last clicked option
	//------------------------------------------------
	_public.getClickedOption = function() {
		return _private.clickedOption;
	};

	//------------------------------------------------
	// Sets currently visible option
	//------------------------------------------------
	_public.setActiveOption = function(id) {
		_private.SELECTOR.find("a").removeClass("active");
		_private.SELECTOR.find("a").eq(id).addClass("active");
	};

	//------------------------------------------------
	// Sets current active competition
	//------------------------------------------------
	_public.setCurrentCompetition = function(id) {
		_private.SELECTOR.find("a").removeClass("current");
		_private.SELECTOR.find("a").eq(id).addClass("current");
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		navHeight: 0,
		height: 0,
		clickedOption: -1,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.height = this.SELECTOR.outerHeight();
			this.createListeners();
			this.setCurrentOption(0);
			this.clickedOption = -1;
		},

		//------------------------------------------------
		// Adjust nav position on scroll, and listen for clicks
		//------------------------------------------------
		createListeners: function() {
			$(window).on("scroll", function(e) {_private.onPageScrolled(e);});
			this.SELECTOR.find("a").on("click", function(e) {_private.onOptionClicked(e);})
			$(window).on("resize", function(e) {_private.onWindowResized(e);});
		},

		//------------------------------------------------
		// Sets currently visible option
		//------------------------------------------------
		setCurrentOption: function(id) {
			this.clickedOption = id;
			this.SELECTOR.find("a").removeClass("active");
			this.SELECTOR.find("a").eq(id).addClass("active");
		},

		//------------------------------------------------
		// Change position of nav, within bounds
		//------------------------------------------------
		onPageScrolled: function(e) {
			var scrollPos = $(window).scrollTop();
			var topLimit = this.SELECTOR.parent().parent().offset().top;
			var bottomLimit = (topLimit + this.SELECTOR.parent().parent().outerHeight()) - this.height;
			if (scrollPos > topLimit && scrollPos < bottomLimit) {
				this.SELECTOR.addClass("fixed");
			} else {
				this.SELECTOR.removeClass("fixed");
			}
		},

		//------------------------------------------------
		// Signal an option has been selected
		//------------------------------------------------
		onOptionClicked: function(e) {
			var clickedOption = this.SELECTOR.find("a").index(e.currentTarget);
			if (clickedOption !== this.clickedOption) {
				this.clickedOption = clickedOption;
				_public.trigger(BARBOUR.christmas.Events.OPTION_CLICKED);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Force nav to adjust
		//------------------------------------------------
		onWindowResized: function(e) {
			this.onPageScrolled();
		}
	};

	_private.init();
	return _public;
};