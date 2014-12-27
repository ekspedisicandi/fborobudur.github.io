////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Panel with a parallax image
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home");

BARBOUR.christmas.views.home.ParallaxPanel = function(selector, tabletVersion) {

	var _public = {
		//------------------------------------------------
		// Update image position if fully loaded
		//------------------------------------------------
		update: function(scrollPos, windowHeight) {
			if (_private.imageLoaded) {
				_private.scrollImage(scrollPos, windowHeight);
			}
		},

		//------------------------------------------------
		// Refetch dimensions of stuff
		//------------------------------------------------
		resize: function() {
			_private.fetchDimensions();
		}
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		imageURL: "",
		imageLoaded: false,
		imageHeight: 0,
		tabletVersion: false,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.tabletVersion = tabletVersion;
			this.imageURL = this.SELECTOR.data("image");
			this.fetchDimensions();
			this.preloadImage();
		},

		//------------------------------------------------
		// Check image has loaded
		//------------------------------------------------
		preloadImage: function() {
			var html = '<img src="' + this.imageURL + '" alt="" />';
			this.SELECTOR.find(".image").html(html);
			var image = new Image(1600, 877);
			image.onload = function() {_private.onImageLoadComplete();};
			image.src = this.imageURL;
		},

		//------------------------------------------------
		// Scrolls image if visible
		//------------------------------------------------
		scrollImage: function(scrollPos, windowHeight) {
			var offsetTop = this.SELECTOR.offset().top;
			var offsetBottom = offsetTop + this.SELECTOR.height();
			if (scrollPos == 0) scrollPos = 1;
			if (scrollPos < offsetBottom && (scrollPos + windowHeight) > offsetTop) {
				var progress = (scrollPos - (offsetTop - windowHeight)) / (this.SELECTOR.height() + windowHeight);
				var position = progress * (this.imageHeight - this.panelHeight);
				this.SELECTOR.find("img").css({bottom: -position});
			}
		},

		//------------------------------------------------
		// Get dimensions of image and panel
		//------------------------------------------------
		fetchDimensions: function() {
			this.windowHeight = $(window).height();
			this.panelHeight = this.SELECTOR.height();
			this.imageHeight = this.SELECTOR.find("img").height();
		},

		//------------------------------------------------
		// Enables scrolling to start when needed
		//------------------------------------------------
		onImageLoadComplete: function() {
			this.fetchDimensions();
			this.imageLoaded = true;
			if (!this.tabletVersion) {
				this.scrollImage($(window).scrollTop(), $(window).height());
			}
		}
	};
	_private.init();
	return _public;
};