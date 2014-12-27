////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Main film application with clickable labels and look browser
// - Title screen
// - Resize to fit window
// - Top & bottom bars
// - Buffering
// - Video playing
// - Labels on hover
// - Look browser panel
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home");

BARBOUR.christmas.views.home.Film = function(selector, tabletVersion) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Hide (and reset) player
	//------------------------------------------------
	_public.hide = function() {
		_private.showTitleScreen();
	};

	//------------------------------------------------
	// Returns ID of clicked promo tab
	//------------------------------------------------
	_public.getClickedPromoID = function() {
		return _private.clickedPromoID;
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		tabletVersion: false,
		topNav: null,
		bottomNav: null,
		player: null,
		lookBrowser: null,
		zoomed: false,
		lookData: [],
		clickedPromoID: 0,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.tabletVersion = tabletVersion;
			if (!this.tabletVersion) {
				this.createTopNav();
				this.createBottomNav();
				this.getLookData();
				this.createLookBrowser();
			}
			this.createPlayer();
			this.createListeners();

		},

		//------------------------------------------------
		// Top bar with close button
		//------------------------------------------------
		createTopNav: function() {
			this.topNav = new BARBOUR.christmas.views.home.film.TopNav(this.SELECTOR.find(".top-nav"));
		},

		//------------------------------------------------
		// Bottom bar with share buttons
		//------------------------------------------------
		createBottomNav: function() {
			this.bottomNav = new BARBOUR.christmas.views.home.film.BottomNav(this.SELECTOR.find(".bottom-nav"));
		},

		//------------------------------------------------
		// Compiles array of look data from HTML
		//------------------------------------------------
		getLookData: function() {
			var look = null, startTime = 0, endTime = 0, xPos = 0, yPos = 0, i = 0, length = this.SELECTOR.find(".look").length;
			this.lookData = [];
			for (; i < length; i++) {
				look = this.SELECTOR.find(".look").eq(i)
				startPosX = look.data("startposx");
				startPosY = look.data("startposy");
				endPosX = look.data("endposx");
				endPosY = look.data("endposy");
				copy = look.data("copy");
				startTime = look.data("starttime");
				endTime = look.data("endtime");
				this.lookData.push({
					startPosX: startPosX,
					startPosY: startPosY,
					endPosX: endPosX,
					endPosY: endPosY,
					copy: copy,
					startTime: startTime,
					endTime: endTime
				});
			}
		},

		//------------------------------------------------
		// Contains labels on hover stuff
		//------------------------------------------------
		createPlayer: function() {
			var videoURL = this.SELECTOR.data("video");
			if (this.tabletVersion) {
				this.player = new NATION.video.BasicYouTubePlayer(this.SELECTOR.find(".videoplayer"), false, false);
				this.SELECTOR.find(".labels, .video-overlay, .dimmer, .player-controls").remove();
			} else {
				this.player = new BARBOUR.christmas.views.home.film.VideoPlayer(this.SELECTOR.find(".video"), videoURL, this.lookData);
			}
		},

		//------------------------------------------------
		// Contains slideshow app
		//------------------------------------------------
		createLookBrowser: function() {
			this.lookBrowser = new BARBOUR.christmas.views.home.film.LookBrowser(this.SELECTOR.find(".looks"));
		},

		//------------------------------------------------
		// Listen for interaction
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".title-screen a").on("click", function(e) {_private.onTitleScreenClicked(e);});
			if (!this.tabletVersion) {
				this.topNav.addListener(BARBOUR.christmas.Events.CLOSE_CLICKED, function(e) {_private.onCloseButtonClicked(e);});
				this.player.addListener(BARBOUR.christmas.Events.LABEL_CLICKED, function(e) {_private.onLabelClicked(e);});
				this.lookBrowser.addListener(BARBOUR.christmas.Events.CLOSE_CLICKED, function(e) {_private.onLookBrowserCloseClicked(e);});
				this.lookBrowser.addListener(BARBOUR.christmas.Events.PROMO_CLICKED, function(e) {_private.onLookBrowserPromoClicked(e);});
				this.SELECTOR.find(".share-promo a").on("click", function(e) {_private.onSharePromoClicked(e);});
			}
			this.player.addListener(BARBOUR.christmas.Events.VIDEO_COMPLETE, function(e) {_private.onVideoComplete(e);});
		},

		//------------------------------------------------
		// Hide title screen and show player
		//------------------------------------------------
		showVideoPlayer: function() {
			if (!this.tabletVersion) {
				this.zoomed = true;
				this.SELECTOR.find(".watch-video").css({left: 0});
				this.SELECTOR.addClass("fixed");
				$('.intro').hide();
				$('.cinemagraphs').hide();
				this.SELECTOR.find(".share-promo").hide();
				this.player.show();
				this.topNav.show();
				this.bottomNav.show();
				this.SELECTOR.find("#header-video").hide();
				_public.trigger(BARBOUR.christmas.Events.VIDEO_SHOWN);
			} else {
				this.SELECTOR.find(".watch-video").css({left: 0});
				this.SELECTOR.find(".share-promo").hide();
			}
		},

		//------------------------------------------------
		// Return to starting state
		//------------------------------------------------
		showTitleScreen: function() {
			if (!this.tabletVersion) {
				this.zoomed = false;
				this.SELECTOR.find(".watch-video").css({left: "100%"});
				this.player.seekToPercent(0);
				this.player.pauseVideo();
				this.player.slideRight(true);
				this.SELECTOR.removeClass("fixed");
				$('.intro').show();
				$('.cinemagraphs').show();
				this.SELECTOR.find(".share-promo").show();
				this.player.hide();
				this.topNav.hide();
				this.bottomNav.hide();
				this.lookBrowser.reset();
				this.lookBrowser.hide(true);
				this.SELECTOR.find("#header-video").show();
				_public.trigger(BARBOUR.christmas.Events.VIDEO_HIDDEN);
			} else {
				this.SELECTOR.find(".share-promo").show();
				this.SELECTOR.find(".watch-video").css({left: "100%"});
			}
		},

		//------------------------------------------------
		// Start up video player
		//------------------------------------------------
		onTitleScreenClicked: function(e) {
			this.showVideoPlayer();
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Returns to title screen
		//------------------------------------------------
		onCloseButtonClicked: function(e) {
			this.showTitleScreen();
		},

		//------------------------------------------------
		// Open up look slideshow with correct look
		//------------------------------------------------
		onLabelClicked: function(e) {
			var clickedLook = this.player.getClickedLabelID();
			this.player.pauseVideo();
			this.player.slideLeft();
			this.lookBrowser.show(clickedLook);
		},

		//------------------------------------------------
		// Slide video player back into view
		//------------------------------------------------
		onLookBrowserCloseClicked: function(e) {
			this.player.slideRight();
		},

		//------------------------------------------------
		// Signal the tab has been clicked
		//------------------------------------------------
		onSharePromoClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.TAB_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Signal the tab has been clicked
		//------------------------------------------------
		onLookBrowserPromoClicked: function(e) {
			this.clickedPromoID = this.lookBrowser.getCurrentCinemagraphID() - 1;
			_public.trigger(BARBOUR.christmas.Events.PROMO_CLICKED);
		},

		//------------------------------------------------
		// Time to close the player
		//------------------------------------------------
		onVideoComplete: function(e) {
			this.showTitleScreen();
		}
	};

	_private.init();
	return _public;
};