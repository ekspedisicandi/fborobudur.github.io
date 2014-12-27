////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Look browser for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.flim");

BARBOUR.christmas.views.home.film.LookSlideshow = function(selector) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Go back to first slide
	//------------------------------------------------
	_public.reset = function() {
		_private.SELECTOR.find(".slide").eq(_private.currentSlideID).stop().css({left: "100%", opacity: 0});
		_private.setCurrentSlide(0);
		_private.SELECTOR.find(".slide").eq(0).stop().css({left: 0, opacity: 1});
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		currentSlideID: 0,
		totalSlides: 0,
		animating: false,
		slideTitle: "",
		productLink: "",

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.setInitialValues();
			this.setPagination();
			if (this.totalSlides > 1) {
				this.createListeners();
			} else {
				this.SELECTOR.find(".previous, .next").hide();
			}
		},

		//------------------------------------------------
		// Store first slide's title and URL
		//------------------------------------------------
		setInitialValues: function() {
			this.slideTitle = this.SELECTOR.find(".slide").eq(0).find("h3").html();
			this.productURL = this.SELECTOR.find(".slide").eq(0).find(".product-link").attr("href");
		},

		//------------------------------------------------
		// Calculate number of slides, and display
		//------------------------------------------------
		setPagination: function() {
			this.totalSlides = this.SELECTOR.find(".slide").length;
			this.SELECTOR.find(".total").html(this.totalSlides);
			this.SELECTOR.find(".current").html(1);
		},

		//------------------------------------------------
		// Listen for interaction
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".previous").on("click", function(e) {_private.onPreviousButtonClicked(e);});
			this.SELECTOR.find(".next").on("click", function(e) {_private.onNextButtonClicked(e);});
			this.SELECTOR.find(".product-link").on("click", function(e) {_private.onProductLinkClicked(e);});
		},

		//------------------------------------------------
		// Animate to requested slide
		//------------------------------------------------
		showSlide: function(slideID, reverse) {
			this.animating = true;
			var nextStartX = 0, prevEndX = 0;
			if (reverse) {
				nextStartX = "-100%";
				prevEndX = "100%";
			} else {
				nextStartX = "100%";
				prevEndX = "-100%";
			}
			this.SELECTOR.find(".slide").eq(this.currentSlideID).stop().animate({left: prevEndX, opacity: 0}, 600, "easeInOutQuad");
			this.SELECTOR.find(".slide").eq(slideID).stop().css({left: nextStartX, opacity: 0}).animate({left: 0, opacity: 1}, 600, "easeInOutQuad", function() {_private.onAnimationComplete();});
			this.setCurrentSlide(slideID);
			this.slideTitle = this.SELECTOR.find(".slide").eq(slideID).find("h3").html();
			this.productURL = this.SELECTOR.find(".slide").eq(slideID).find(".product-link").attr("href");
		},

		//------------------------------------------------
		// Update internal and displayed number
		//------------------------------------------------
		setCurrentSlide: function(slideID) {
			this.SELECTOR.find(".current").html(slideID + 1);
			this.currentSlideID = slideID;
		},

		//------------------------------------------------
		// Show previous slide
		//------------------------------------------------
		onPreviousButtonClicked: function(e) {
			if (!this.animating) {
				var nextSlideID = this.currentSlideID - 1;
				if (nextSlideID < 0) {
					nextSlideID = this.totalSlides-1;
				}
				this.showSlide(nextSlideID, true);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Show next slide
		//------------------------------------------------
		onNextButtonClicked: function(e) {
			if (!this.animating) {
				var nextSlideID = this.currentSlideID + 1;
				if (nextSlideID > this.totalSlides-1) {
					nextSlideID = 0;
				}
				this.showSlide(nextSlideID);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Register complete animation
		//------------------------------------------------
		onAnimationComplete: function() {
			this.animating = false;
		},

		//------------------------------------------------
		// Track product click
		//------------------------------------------------
		onProductLinkClicked: function(e) {
			_gaq.push(['_trackEvent', 'Video', 'click', "Product link, " + this.slideTitle + ": " + this.productURL]);
		}
	};

	_private.init();
	return _public;
};