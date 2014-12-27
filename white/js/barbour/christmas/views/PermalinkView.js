////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Homepage View
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views");

BARBOUR.christmas.views.PermalinkView = function(selector) {

	var _public = {

	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		cinemagraph: null,
		parallaxPanel: null,
		animatingScroll: false,
		title: "",

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.title = this.SELECTOR.find(".cinemagraph h1").html();
			this.createCinemagraph();
			this.createParallaxPanel();
			this.createListeners();
		},

		//------------------------------------------------
		// Create the cinemagraph app
		//------------------------------------------------
		createCinemagraph: function() {
			this.cinemagraph = new BARBOUR.christmas.views.global.Cinemagraph(this.SELECTOR.find(".cinemagraph"));
		},

		//------------------------------------------------
		// Panel that scrolls separately from browser
		//------------------------------------------------
		createParallaxPanel: function() {
			this.parallaxPanel = new BARBOUR.christmas.views.home.ParallaxPanel(this.SELECTOR.find(".parallax"));
		},

		//------------------------------------------------
		// Listen for scrolls to adjust parallax stuff
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".prizes .product-image a, .prizes h3 a").on("click", function(e) {_private.onProductLinkClicked(e);});
			this.SELECTOR.find(".terms a").on("click", function(e) {_private.onTermsLinkClicked(e);});
			this.SELECTOR.find(".back-to-top").on("click", function(e) {_private.onBackToTopClicked(e);});
			$(window).on("scroll", function(e) {_private.onWindowScrolled(e);});
			$(window).on("resize", function(e) {_private.onWindowResized(e);});
			$("html, body").on("mousewheel", function(e) {_private.onMouseWheelScrolled(e);});
		},

		//------------------------------------------------
		// Scroll to top of page
		//------------------------------------------------
		scrollToTop: function() {
			this.animatingScroll = true;
			var targetY = 0;
			$("html, body").stop().animate({scrollTop: targetY}, 500, "easeInOutQuad", function() {_private.onAutoScrollComplete();});;
		},

		//------------------------------------------------
		// Animation has completed
		//------------------------------------------------
		onAutoScrollComplete: function() {
			this.animatingScroll = false;
		},

		//------------------------------------------------
		// Stop any autoscroll in progress
		//------------------------------------------------
		onMouseWheelScrolled: function(e) {
			if (this.animatingScroll) {
				this.animatingScroll = false;
				$("html, body").stop();
			}
		},

		//------------------------------------------------
		// Resize parallax panel
		//------------------------------------------------
		onWindowResized: function(e) {
			this.parallaxPanel.resize();
		},

		//------------------------------------------------
		// Update position of image in parallax panel
		//------------------------------------------------
		onWindowScrolled: function(e) {
			var windowTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			this.parallaxPanel.update(windowTop, windowHeight);
		},

		//------------------------------------------------
		// Scroll to top of page
		//------------------------------------------------
		onBackToTopClicked: function(e) {
			this.scrollToTop();
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Handle tracking
		//------------------------------------------------
		onTermsLinkClicked: function(e) {
			_gaq.push(['_trackEvent', 'Terms and Conditions', 'click', "Link visited"]);
		},

		//------------------------------------------------
		// Handle tracking when prize is clicked
		//------------------------------------------------
		onProductLinkClicked: function(e) {
			var prizeText = $(e.currentTarget).closest("li").find("h2").html().replace(/(<([^>]+)>)/ig,"");
			_gaq.push(['_trackEvent', 'Permalink', 'click', this.title + ", " + prizeText + " Clicked"]);
		}
	};

	_private.init();
	return _public;
};