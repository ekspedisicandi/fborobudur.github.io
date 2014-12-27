////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Homepage View
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views");

BARBOUR.christmas.views.HomeView = function(selector) {

	var _public = {

	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		film: null,
		cinemagraphs: [],
		cinemagraphNav: null,
		activeCinemagraph: 0,
		animatingScroll: false,
		currentCompID: 0,
		parallaxPanels: [],
		deepLinkedID: -1,
		tabletVersion: false,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = selector;
			this.checkForTablets();
			this.createFilm();
			this.createCinemagraphs();
			this.createCinemagraphNav();
			this.createParallaxPanels();
			if (!this.tabletVersion) {
				this.prepareLayoutForParallax();
			} else {
				this.preparePageForTablet();
			}
			this.createListeners();
			this.onWindowScrolled();
			// Trigger a state check
			this.onURLStateChange();
			if (this.deepLinkedID > -1) {
				this.scrollToCinemagraph(this.deepLinkedID, false);
			}
		},

		//------------------------------------------------
		// Don't use parallax or video app on tablets
		//------------------------------------------------
		checkForTablets: function() {
			this.tabletVersion = (/Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent));
		},

		//------------------------------------------------
		// 
		//------------------------------------------------
		preparePageForTablet: function() {
			this.SELECTOR.find(".title-screen .bg-image").children().eq(0).remove();
		},

		//------------------------------------------------
		// Handle moving between cinemagraphs
		//------------------------------------------------
		createListeners: function() {
			this.cinemagraphNav.addListener(BARBOUR.christmas.Events.OPTION_CLICKED, function(e) {_private.onCinemagraphNavClicked(e);});
			$("html, body").on("mousewheel", function(e) {_private.onMouseWheelScrolled(e);});
			$(window).on("scroll", function(e) {_private.onWindowScrolled(e);});
			$(window).on("resize", function(e) {_private.onWindowResized(e);});
			this.SELECTOR.find(".enter-button a").on("click", function(e) {_private.onEnterButtonClicked(e);});
			this.film.addListener(BARBOUR.christmas.Events.TAB_CLICKED, function(e) {_private.onSharePromoClicked(e);});
			this.film.addListener(BARBOUR.christmas.Events.PROMO_CLICKED, function(e) {_private.onFilmPromoTabClicked(e);});
			this.film.addListener(BARBOUR.christmas.Events.VIDEO_SHOWN, function(e) {_private.onVideoShown(e);});
			this.film.addListener(BARBOUR.christmas.Events.VIDEO_HIDDEN, function(e) {_private.onVideoHidden(e);});
			History.Adapter.bind(window, "statechange", function() {_private.onURLStateChange();});
			this.SELECTOR.find(".back-to-top").on("click", function(e) {_private.onBackToTopClicked(e);});
			this.SELECTOR.find(".terms a").on("click", function(e) {_private.onTermsLinkClicked(e);});
		},

		//------------------------------------------------
		// Make everythign fixed and add a dummy element
		//------------------------------------------------
		prepareLayoutForParallax: function() {
			$('body').append("<div class='dummy-site'></div>");
			$('body').find(".dummy-site").height(this.SELECTOR.height());
			this.SELECTOR.css("position", "fixed");
		},

		//------------------------------------------------
		// Animate to relevant section
		//------------------------------------------------
		onURLStateChange: function() {
			var url = History.getState().url;
			var sectionID = url.substr(url.lastIndexOf("/") + 1);
			if (sectionID && this.SELECTOR.find("")) {
				//this.deepLinkedID = this.SELECTOR.find(".cinemagraph").index(this.SELECTOR.find("#" + sectionID));
				// TEMP
				//this.scrollToCinemagraph(this.deepLinkedID, false);
			}
		},

		//------------------------------------------------
		// Animates the scroll position to a section
		//------------------------------------------------
		scrollToCinemagraph: function(id, immediate) {
			var targetY = this.SELECTOR.find(".cinemagraph").eq(id).offset().top;
			if (immediate) {
				$("html, body").stop().scrollTop(targetY);
			} else {
				this.animatingScroll = true;
				$("html, body").stop().animate({scrollTop: targetY}, 500, "easeInOutQuad", function() {_private.onAutoScrollComplete();});
			}
		},

		//------------------------------------------------
		// Main video app at top of page
		//------------------------------------------------
		createFilm: function() {
			this.film = new BARBOUR.christmas.views.home.Film(this.SELECTOR.find(".film"), this.tabletVersion);
		},

		//------------------------------------------------
		// Create all cinemagraph panels
		//------------------------------------------------
		createCinemagraphs: function() {
			var cinemagraphs = this.SELECTOR.find(".cinemagraph");
			var i = 0, length = cinemagraphs.length, cinemagraph = null;
			for (; i < length; i++) {
				this.cinemagraphs.push(new BARBOUR.christmas.views.global.Cinemagraph(cinemagraphs[i], this.tabletVersion));
			}
		},

		//------------------------------------------------
		// Panels that scroll separately from browser
		//------------------------------------------------
		createParallaxPanels: function() {
			this.parallaxPanels = [];
			var panels = this.SELECTOR.find(".parallax");
			var i = 0, length = panels.length;
			for (; i < length; i++) {
				this.parallaxPanels.push(new BARBOUR.christmas.views.home.ParallaxPanel($(panels[i]), this.tabletVersion));
			}
		},

		//------------------------------------------------
		// Create right hand nav
		//------------------------------------------------
		createCinemagraphNav: function() {
			this.cinemagraphNav = new BARBOUR.christmas.views.home.CinemagraphNavigation(this.SELECTOR.find(".cinemagraphs nav"));
			var activeCompetition = this.SELECTOR.find(".enter-button a").attr("href");
			this.currentCompID = this.SELECTOR.find(".cinemagraphs article").index(this.SELECTOR.find(activeCompetition));
			this.cinemagraphNav.setCurrentCompetition(this.currentCompID);
		},

		//------------------------------------------------
		// Get name of section by ID
		//------------------------------------------------
		getSectionName: function(id) {
			var sectionName = this.SELECTOR.find(".cinemagraph").eq(id).attr("id");
			sectionName = "/cinemagraph/" + sectionName.replace(/ &amp; /, "-");
			return sectionName;
		},

		//------------------------------------------------
		// Scroll to relevant section of the page
		//------------------------------------------------
		jumpToCinemagraph: function(id) {
			var sectionName = this.getSectionName(id);
			// TEMP
			//History.pushState({state: id}, "Barbour", sectionName);
			this.scrollToCinemagraph(id, false);
		},

		//------------------------------------------------
		// Scroll to where the intro panel is at the bottom
		// of the browser window
		//------------------------------------------------
		scrollToIntro: function() {
			this.animatingScroll = true;
			var targetY = this.SELECTOR.find(".center-panel").offset().top + this.SELECTOR.find(".center-panel").outerHeight();
			targetY = targetY - $(window).height();
			$("html, body").stop().animate({scrollTop: targetY}, 500, "easeInOutQuad", function() {_private.onAutoScrollComplete();});;
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
		// Get clicked option
		//------------------------------------------------
		onCinemagraphNavClicked: function(e) {
			this.activeCinemagraph = this.cinemagraphNav.getClickedOption();
			this.jumpToCinemagraph(this.activeCinemagraph);
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
		// Update side nav when needed
		//------------------------------------------------
		onWindowScrolled: function(e) {
			var cinemagraphs = this.SELECTOR.find(".cinemagraph");
			var i = 0, length = cinemagraphs.length, cinemagraph = null;
			var windowTop = $(window).scrollTop();
			var windowHeight = $(window).height();
			var windowBottom = windowTop + (windowHeight - $(cinemagraphs[0]).outerHeight()), lastCinemagraph = 0;

			for (; i < length; i++) {
				cinemagraph = $(cinemagraphs[i]);
				if (cinemagraph.offset().top < windowBottom) {
					lastCinemagraph = i;
				}
			}

			// Adjust scroll position of stuff
			if (!this.tabletVersion) {
				$('body').find(".dummy-site").height(this.SELECTOR.height()).width(this.SELECTOR.width());
				var scrollPos = $(window).scrollTop();
				var scrollPosLeft = $(window).scrollLeft();
				this.SELECTOR.css({top: -scrollPos, left: -scrollPosLeft});

				var k = 0;
				length = this.parallaxPanels.length;
				for (; k < length; k++) {
					this.parallaxPanels[k].update(windowTop, windowHeight);
				}
			}

			
			
			this.activeCinemagraph = lastCinemagraph;
			this.cinemagraphNav.setActiveOption(lastCinemagraph);
		},

		//------------------------------------------------
		// Scroll to target instead of jumping there
		//------------------------------------------------
		onEnterButtonClicked: function(e) {
			this.jumpToCinemagraph(this.currentCompID);
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Scroll to intro
		//------------------------------------------------
		onSharePromoClicked: function(e) {
			this.scrollToIntro();
		},

		//------------------------------------------------
		// Close film and scroll to relevant cinemagraph
		//------------------------------------------------
		onFilmPromoTabClicked: function(e) {
			this.film.hide();
			this.jumpToCinemagraph(this.film.getClickedPromoID());
		},

		//------------------------------------------------
		// Resize parallax backgrounds
		//------------------------------------------------
		onWindowResized: function(e) {
			var i = 0, length = this.parallaxPanels.length;
			for (; i < length; i++) {
				this.parallaxPanels[i].resize();
			}
		},

		//------------------------------------------------
		// Restart parallax stuff
		//------------------------------------------------
		onVideoHidden: function() {
			this.SELECTOR.css("position", "fixed");
			$('.dummy-site').show();
			this.onWindowScrolled();
		},

		//------------------------------------------------
		// Pause parallax stuff
		//------------------------------------------------
		onVideoShown: function() {
			$('.dummy-site').hide();
			this.SELECTOR.removeAttr("style");
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
		}
	};

	_private.init();
	return _public;
};