////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Cinemagraph Product Slideshow
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.global.cinemagraph");

BARBOUR.christmas.views.global.cinemagraph.Slideshow = function(selector) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Fade in panel
	//------------------------------------------------
	_public.show = function(slideID) {
		if (!slideID) slideID = 0;
		_private.SELECTOR.find(".slides li").stop().css({left: "100%", opacity: 0});
		_private.SELECTOR.find(".slides li").eq(slideID).stop().css({left: 0, opacity: 1});
		_private.currentSlideID = slideID;
		_private.SELECTOR.fadeIn(300);
	};

	//------------------------------------------------
	// Fade out panel
	//------------------------------------------------
	_public.hide = function() {
		_private.SELECTOR.fadeOut(300);
	};

	//------------------------------------------------
	// Returns name of relevant product
	//------------------------------------------------
	_public.getProductName = function(slideID) {
		return _private.SELECTOR.find(".slides li").eq(slideID).find("h3").html();
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		currentSlideID: 0,
		totalSlides: 0,
		animating: false,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.totalSlides = this.SELECTOR.find(".slides li").length;
			this.createListeners();
			if (this.totalSlides <= 1) {
				this.SELECTOR.find(".previous, .next").hide();
			}
		},

		//------------------------------------------------
		// Listen for next/previous clicks
		//------------------------------------------------
		createListeners: function() {
			if (this.totalSlides > 1) {
				this.SELECTOR.find(".previous").on("click", function(e) {_private.onPreviousClicked(e);});
				this.SELECTOR.find(".next").on("click", function(e) {_private.onNextClicked(e);});
			}
			this.SELECTOR.find(".close-button").on("click", function(e) {_private.onCloseButtonClicked(e);});
			this.SELECTOR.find(".description a").on("click", function(e) {_private.onProductLinkClicked(e);});
		},

		//------------------------------------------------
		// Animate to target slide
		//------------------------------------------------
		showSlide: function(slideID, reverse) {
			this.animating = true;
			var prevEndPos = "", nextStartPos = "";
			if (reverse) {
				prevEndPos = "100%";
				nextStartPos = "-100%";
			} else {
				prevEndPos = "-100%";
				nextStartPos = "100%";
			}
			this.SELECTOR.find(".slides li").eq(this.currentSlideID).stop().animate({left: prevEndPos, opacity: 0}, 600, "easeInOutQuad");
			this.SELECTOR.find(".slides li").eq(slideID).stop().css({left: nextStartPos}).animate({left: 0, opacity: 1}, 600, "easeInOutQuad", function() {_private.onAnimationComplete();});
			this.currentSlideID = slideID;
		},

		//------------------------------------------------
		// Register complete animation
		//------------------------------------------------
		onAnimationComplete: function() {
			this.animating = false;
		},

		//------------------------------------------------
		// Show previous slide
		//------------------------------------------------
		onPreviousClicked: function(e) {
			if (!this.animating) {
				var previousSlide = this.currentSlideID - 1;
				if (previousSlide < 0) {
					previousSlide = this.totalSlides - 1;
				}
				this.showSlide(previousSlide, true);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Show next slide
		//------------------------------------------------
		onNextClicked: function(e) {
			if (!this.animating) {
				var nextSlide = this.currentSlideID + 1;
				if (nextSlide > this.totalSlides-1) {
					nextSlide = 0;
				}
				this.showSlide(nextSlide);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Show next slide
		//------------------------------------------------
		onCloseButtonClicked: function(e) {
			_public.hide();
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Signal product link has been clicked
		//------------------------------------------------
		onProductLinkClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.PRODUCT_CLICKED);
		}
	};

	_private.init();
	return _public;
};