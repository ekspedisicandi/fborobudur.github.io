////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Video player for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.VideoPlayer = function(selector, videoURL, lookData) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Shows centered help panel
	//------------------------------------------------
	_public.showHelpPanel = function() {

	};

	//------------------------------------------------
	// Shows player full width/height
	//------------------------------------------------
	_public.show = function() {
		_private.SELECTOR.show();
		_private.controls.showMessage(true);
		_private.SELECTOR.find(".intro-panel").show();
		_private.autoPlayRequired = false;
		_private.playerReady = false;
		_private.introPanelShowing = true;
		_private.player.playVideo();
		_private.labels.resize();
		_private.labels.hide();
		_private.currentWaitTime = 0;
		_private.onIntroTimerTicked();
		_private.player.addListener(_private.player.VIDEO_PLAYING, function(e) {_private.onVideoPlayStart(e);});
	};

	//------------------------------------------------
	// Returns to starting state
	//------------------------------------------------
	_public.hide = function() {
		_private.SELECTOR.hide();
		_private.controls.hide(true);
	};

	//------------------------------------------------
	// Slide to make space for look browser
	//------------------------------------------------
	_public.slideLeft = function() {
		this.pauseVideo();
		this.dim();
		_private.controls.shrink();
		_private.SELECTOR.stop().animate({left: "-66.6%", right: "66.6%"}, 600, "easeInOutQuad");
	};

	//------------------------------------------------
	// Slide back to take up all space
	//------------------------------------------------
	_public.slideRight = function(immediate) {
		_private.videoPaused = false;
		this.unDim(immediate);
		if (immediate) {
			_private.SELECTOR.stop().css({left: 0, right: 0});
		} else {
			_private.SELECTOR.stop().animate({left: 0, right: 0}, 600, "easeInOutQuad");
		}
	};

	//------------------------------------------------
	// Returns to starting state
	//------------------------------------------------
	_public.dim = function() {
		_private.dimmed = true;
		_private.SELECTOR.find(".dimmer").stop().show().animate({opacity: 0.75}, 600);
	};

	//------------------------------------------------
	// Returns to starting state
	//------------------------------------------------
	_public.unDim = function(immediate) {
		_private.dimmed = false;
		if (immediate) {
			_private.SELECTOR.find(".dimmer").stop().css({opacity: 0}).hide();
		} else {
			_private.SELECTOR.find(".dimmer").stop().show().animate({opacity: 0}, 600, function() {_private.onDimmerHidden();});
		}
	};

	//------------------------------------------------
	// Start playing from current position
	//------------------------------------------------
	_public.playVideo = function() {
		if (_private.player.isReady()) {
			_private.controls.showPauseButton();
			_private.player.playVideo();
			_private.videoPaused = false;
		}
	};

	//------------------------------------------------
	// Pause
	//------------------------------------------------
	_public.pauseVideo = function() {
		if (_private.player.isReady()) {
			_private.controls.showPlayButton();
			_private.player.pauseVideo();
			_private.videoPaused = true;
		}
	};

	//------------------------------------------------
	// Seeks to a percentage through the video (0-1)
	//------------------------------------------------
	_public.seekToPercent = function(percent) {
		if (percent > 1) {
			percent = 1;
		} else if (percent < 0) {
			percent = 0;
		}
		var position = _private.player.getDuration() * percent;
		_private.player.seekTo(position);
	};

	//------------------------------------------------
	// Return clicked label ID
	//------------------------------------------------
	_public.getClickedLabelID = function() {
		return _private.labels.getClickedLabelID();
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		INTRO_WAIT_TIME: 4000,
		videoURL: "",
		controls: null,
		player: null,
		videoPaused: false,
		introPanelShowing: false,
		currentWaitTime: 0,
		introTimer: null,
		labels: null,
		lookData: [],
		resizeTimer: null,
		playerReady: false,
		dimmed: false,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.videoURL = videoURL;
			this.lookData = lookData;
			this.createLabels();
			this.createControls();
			this.createBasicYouTubePlayer();
			this.createListeners();
		},

		//------------------------------------------------
		// Listen for mouse overs
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.on("mouseleave", function(e) {_private.onMouseLeave(e);});
			this.SELECTOR.on("mouseenter", function(e) {_private.onMouseEnter(e);});
			this.SELECTOR.find(".labels").on("mouseenter", function(e) {_private.onLabelContainerMouseEnter(e);});
			this.SELECTOR.find(".labels").on("mouseleave", function(e) {_private.onLabelContainerMouseLeave(e);});
			this.controls.addListener(BARBOUR.christmas.Events.PLAY_CLICKED, function(e) {_private.onPlayClicked(e);});
			this.controls.addListener(BARBOUR.christmas.Events.PAUSE_CLICKED, function(e) {_private.onPauseClicked(e);});
			this.controls.addListener(BARBOUR.christmas.Events.MUTE_CLICKED, function(e) {_private.onMuteClicked(e);});
			this.controls.addListener(BARBOUR.christmas.Events.UNMUTE_CLICKED, function(e) {_private.onUnMuteClicked(e);});
			this.controls.addListener(BARBOUR.christmas.Events.PROGRESS_CLICKED, function(e) {_private.onProgressBarClicked(e);});
			this.controls.addListener(BARBOUR.christmas.Events.HELP_CLICKED, function(e) {_private.onHelpButtonClicked(e);});
			this.player.addListener(this.player.PLAYER_READY, function(e) {_private.onPlayerReady(e);});
			this.player.addListener(this.player.PLAY_PROGRESS, function(e) {_private.onPlayProgress(e);});
			this.player.addListener(this.player.LOAD_PROGRESS, function(e) {_private.onLoadProgress(e);});
			this.player.addListener(this.player.VIDEO_COMPLETE, function(e) {_private.onVideoComplete(e);});
			this.labels.addListener(BARBOUR.christmas.Events.LABEL_CLICKED, function(e) {_private.onLabelClicked(e);});
			$(window).on("resize", function(e) {_private.onWindowResized(e);});
		},

		//------------------------------------------------
		// Video controls
		//------------------------------------------------
		createControls: function() {
			this.controls = new BARBOUR.christmas.views.home.film.Controls(this.SELECTOR.find(".player-controls"));
		},

		//------------------------------------------------
		// Class that manages labels
		//------------------------------------------------
		createLabels: function() {
			this.labels = new BARBOUR.christmas.views.home.film.Labels(this.SELECTOR.find(".labels"), this.lookData);
		},

		//------------------------------------------------
		// From Nation lib, player without controls
		//------------------------------------------------
		createBasicYouTubePlayer: function() {
			this.player = new NATION.video.BasicYouTubePlayer(this.SELECTOR.find(".videoplayer"), true, false);
		},

		//------------------------------------------------
		// Shrink controls
		//------------------------------------------------
		onMouseLeave: function(e) {
			this.controls.shrink();
			
			if (!this.introPanelShowing) this.controls.hideMessage();
		},

		//------------------------------------------------
		// Hide intro panel container
		//------------------------------------------------
		hideIntroPanel: function() {
			this.SELECTOR.find(".intro-panel").hide();
			this.introPanelShowing = false;
		},

		//------------------------------------------------
		// Show intro panel container
		//------------------------------------------------
		showIntroPanel: function() {
			this.SELECTOR.find(".intro-panel").show();
			this.introPanelShowing = true;
		},

		//------------------------------------------------
		// Enlarge controls unless viewing a look
		//------------------------------------------------
		onMouseEnter: function(e) {
			if (!this.dimmed) {
				this.controls.enlarge();
			}
		},

		//------------------------------------------------
		// Pause video and show labels
		//------------------------------------------------
		onLabelContainerMouseEnter: function(e) {
			this.player.pauseVideo();
			//this.controls.showPlayButton();
			if (!this.introPanelShowing) {
				var currentTime = this.player.getCurrentTime();
				this.labels.show(currentTime);
			}
		},

		//------------------------------------------------
		// Hide label container
		//------------------------------------------------
		onLabelContainerMouseLeave: function(e) {
			this.labels.hide();

			if (!this.videoPaused && this.player.isReady() && !this.introPanelShowing) {
				this.player.playVideo();
				this.controls.showPauseButton();
				if (this.introPanelShowing) {
					this.hideIntroPanel();
				}
			}
		},

		//------------------------------------------------
		// labels video if paused
		//------------------------------------------------
		onPlayClicked: function(e) {
			this.videoPaused = false;
			this.player.playVideo();
			if (this.introPanelShowing) {
				this.SELECTOR.find(".intro-panel").hide();
				this.introPanelShowing = false;
			}
		},

		//------------------------------------------------
		// Pause player if playing
		//------------------------------------------------
		onPauseClicked: function(e) {
			this.videoPaused = true;
			this.player.pauseVideo();
		},

		//------------------------------------------------
		// Mute sound
		//------------------------------------------------
		onMuteClicked: function(e) {
			this.player.mute();
		},

		//------------------------------------------------
		// Un-mute sound
		//------------------------------------------------
		onUnMuteClicked: function(e) {
			this.player.unMute();
		},

		//------------------------------------------------
		// Send duration of video to controls for cuepoints
		//------------------------------------------------
		onPlayerReady: function(e) {
			this.controls.setVideoLength(this.player.getDuration());
		},

		//------------------------------------------------
		// Update visual display on progress bar
		//------------------------------------------------
		onPlayProgress: function(e) {
			var progress = this.player.getPlayProgress();
			this.controls.setPlayProgress(progress);
			var time = this.player.getCurrentTime();
			this.controls.setCurrentTime(time)
		},

		//------------------------------------------------
		// Update visual display of loaded area of video
		//------------------------------------------------
		onLoadProgress: function(e) {
			var loaded = this.player.getVideoLoadedFraction();
			this.controls.setLoadProgress(loaded);
		},

		//------------------------------------------------
		// Set video to requested position
		//------------------------------------------------
		onProgressBarClicked: function(e) {
			var percentage = this.controls.getRequestedPosition();
			var time = this.player.getDuration() * percentage;
			this.player.seekTo(time);
			var progress = this.player.getPlayProgress();
			this.controls.setPlayProgress(progress);
		},

		//------------------------------------------------
		// Hide help panel and pause video
		//------------------------------------------------
		onVideoPlayStart: function(e) {
			if (this.introPanelShowing) {
				this.player.pauseVideo();
				this.playerReady = true;
				_private.player.removeListener(_private.player.VIDEO_PLAYING, function(e) {_private.onVideoPlayStart(e);});
				if (this.autoPlayRequired) {
					this.startPlayingVideo();
				}
			}
		},

		//------------------------------------------------
		// Time to close the player
		//------------------------------------------------
		onVideoComplete: function() {
			_public.trigger(BARBOUR.christmas.Events.VIDEO_COMPLETE);
		},

		//------------------------------------------------
		// Show or close help panel
		//------------------------------------------------
		onHelpButtonClicked: function(e) {
			if (this.introPanelShowing) {
				this.hideIntroPanel();
			} else {
				this.SELECTOR.find(".intro-panel h2, .intro-panel dl, .intro-panel hr").hide();
				this.showIntroPanel();
			}
		},

		//------------------------------------------------
		// Hide intro and play video
		//------------------------------------------------
		startPlayingVideo: function() {
			if (!this.autoPlayRequired) this.onVideoPlayStart();
			this.introPanelShowing = false;
			this.SELECTOR.find(".intro-panel").hide();
			this.controls.show();
		},

		//------------------------------------------------
		// Update buffering progress
		//------------------------------------------------
		onIntroTimerTicked: function(e) {
			if (this.currentWaitTime >= this.INTRO_WAIT_TIME) {
				if (this.playerReady) {
					this.startPlayingVideo();
				} else {
					this.autoPlayRequired = true;
				}
			} else {
				this.currentWaitTime += 100;
				newProgress = Math.round((this.currentWaitTime / this.INTRO_WAIT_TIME) * 100);
				this.SELECTOR.find(".intro-panel .progress").html(newProgress + "%");
				clearTimeout(this.introTimer);
				this.introTimer = setTimeout(function() {_private.onIntroTimerTicked(e);}, 100);
			}
		},

		//------------------------------------------------
		// Signal that a label has been clicked
		//------------------------------------------------
		onLabelClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.LABEL_CLICKED);
		},

		//------------------------------------------------
		// Remove dimmer from display
		//------------------------------------------------
		onDimmerHidden: function() {
			this.SELECTOR.find(".dimmer").hide();
		},

		//------------------------------------------------
		// Resize label container to match actual video
		//------------------------------------------------
		resize: function() {
			this.labels.resize();
			this.resizeTimer = null;
		},

		//------------------------------------------------
		// Pace resizing as to not kill browsers
		//------------------------------------------------
		onWindowResized: function(e) {
			if (!this.resizeTimer) {
				clearTimeout(this.resizeTimer);
				this.resizeTimer = setTimeout(function() {_private.resize();}, 100);
			}
		}
	};

	_private.init();
	return _public;
};