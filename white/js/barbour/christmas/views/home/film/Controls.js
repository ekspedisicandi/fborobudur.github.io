////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Video player controls for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.Controls = function(selector) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Slide controls from bottom inwards
	//------------------------------------------------
	_public.show = function(immediate) {
		this.enlarge(true);
		if (immediate) {
			_private.SELECTOR.find(".moving-content").stop().css({top: 0});
		} else {
			_private.SELECTOR.find(".moving-content").stop().animate({top: 0}, 400, "easeInOutQuad");
		}
	};

	//------------------------------------------------
	// Slide controls off bottom of video
	//------------------------------------------------
	_public.hide = function(immediate) {
		if (immediate) {
			_private.SELECTOR.find(".moving-content").stop().css({top: _private.controlsHeight});
		} else {
			_private.SELECTOR.find(".moving-content").stop().animate({top: _private.controlsHeight}, 400, "easeInOutQuad");
		}
	};

	//------------------------------------------------
	// Reduce padding and make background less opaque
	//------------------------------------------------
	_public.shrink = function(immediate) {
		var properties = {
			paddingTop: _private.SHRUNK_PADDING,
			paddingBottom: _private.SHRUNK_PADDING
		};
		if (immediate) {
			_private.buttons.stop().css(properties);
			_private.background.stop().css({opacity: 0.7});
		} else {
			_private.buttons.stop().animate(properties, 300, "easeInOutQuad");
			_private.background.stop().animate({opacity: 0.7}, 300, "easeInOutQuad");
		}
	};

	//------------------------------------------------
	// Increase padding and make background more opaque
	//------------------------------------------------
	_public.enlarge = function(immediate) {
		var properties = {
			paddingTop: _private.ENLARGED_PADDING,
			paddingBottom: _private.ENLARGED_PADDING
		};
		if (immediate) {
			_private.buttons.stop().css(properties);
			_private.background.stop().css({opacity: 0.9});
		} else {
			_private.buttons.stop().animate(properties, 300, "easeInOutQuad");
			_private.background.stop().animate({opacity: 0.9}, 300, "easeInOutQuad");
		}
	};

	//------------------------------------------------
	// Used for positioning progress bar cuepoints
	//------------------------------------------------
	_public.setVideoLength = function(duration) {
		_private.progressBar.setVideoLength(duration);
		_private.showVideoDuration(duration);
	};

	//------------------------------------------------
	// Changes play button to pause
	//------------------------------------------------
	_public.showPauseButton = function() {
		_private.playButton.addClass("active");
	};

	//------------------------------------------------
	// Changes pause button to play
	//------------------------------------------------
	_public.showPlayButton = function() {
		_private.playButton.removeClass("active");
	};

	//------------------------------------------------
	// Updates current time in display
	//------------------------------------------------
	_public.setCurrentTime = function(time) {
		_private.showCurrentTime(time);
	};

	//------------------------------------------------
	// Adjusts width of progress bar
	//------------------------------------------------
	_public.setPlayProgress = function(percentage) {
		_private.progressBar.setProgress(percentage);
	};

	//------------------------------------------------
	// Adjusts width of loaded bar
	//------------------------------------------------
	_public.setLoadProgress = function(percentage) {
		_private.progressBar.setLoaded(percentage);
	};

	//------------------------------------------------
	// Gets position from progress bar class
	//------------------------------------------------
	_public.getRequestedPosition = function() {
		return _private.progressBar.getRequestedPosition();
	};

	//------------------------------------------------
	// Show message telling user to mouse out
	//------------------------------------------------
	_public.showMessage = function(immediate) {
		if (immediate) {
			_private.SELECTOR.find(".controls").stop().css({opacity: 0});
			_private.SELECTOR.find(".message").stop().show();
		} else {
			_private.SELECTOR.find(".controls").stop().animate({opacity: 0}, 200, function() {_private.onControlsHiddenShowMessage();});
		}
	};

	//------------------------------------------------
	// Hide message telling user to mouse out
	//------------------------------------------------
	_public.hideMessage = function(immediate) {
		if (immediate) {
			_private.SELECTOR.find(".message").stop().hide();
			_private.SELECTOR.find(".controls").stop().css({opacity: 1});
		} else {
			_private.SELECTOR.find(".message").stop().fadeOut(200, function() {_private.onMessageHiddenShowControls();});
		}
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		SHRUNK_PADDING: 20,
		ENLARGED_PADDING: 45,
		controlsHeight: 0,
		playButton: null,
		muteButton: null,
		buttons: null,
		progressBar: null,
		background: null,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.controlsHeight = this.SELECTOR.find(".moving-content").outerHeight();
			this.playButton = this.SELECTOR.find(".play-button");
			this.muteButton = this.SELECTOR.find(".mute-button");
			this.buttons = this.SELECTOR.find(".content");
			this.helpButton = this.SELECTOR.find(".help-button");
			this.background = this.SELECTOR.find(".background");
			this.createProgressBar();
			this.createListeners();
		},

		//------------------------------------------------
		// Progress bar split off due to complexity
		//------------------------------------------------
		createProgressBar: function() {
			this.progressBar = new BARBOUR.christmas.views.home.film.ProgressBar(this.SELECTOR.find(".progress-bar"));
		},

		//------------------------------------------------
		// Listen for control usage
		//------------------------------------------------
		createListeners: function() {
			this.playButton.on("click", function(e) {_private.onPlayButtonClicked(e);});
			this.muteButton.on("click", function(e) {_private.onMuteButtonClicked(e);});
			this.helpButton.on("click", function(e) {_private.onHelpButtonClicked(e);});
			this.progressBar.addListener(BARBOUR.christmas.Events.PROGRESS_CLICKED, function(e) {_private.onProgressClicked(e);});
		},

		//------------------------------------------------
		// Format time as 00:00:00
		//------------------------------------------------
		formatTime: function(time) {
			time = Math.floor(time);
			var timeString = "";
			var currentHours = Math.floor(time/3600);
			if (currentHours > 0) {
				if (currentHours < 10) timeString += "0";
				timeString += currentHours + ":";
				time -= currentHours * 3600;
			}
			var currentMinutes = Math.floor(time / 60);
			if (currentMinutes > 0) {
				if (currentMinutes < 10) timeString += "0"
				timeString += currentMinutes + ":";
				time -= currentMinutes * 60;
			} else {
				timeString += "00:"
			}
			var currentSeconds = time % 60;
			if (currentSeconds > 0) {
				if (currentSeconds < 10) timeString += "0";
				timeString += currentSeconds;
			} else {
				timeString += "00"
			}
			return timeString;
		},

		//------------------------------------------------
		// Show duration display
		//------------------------------------------------
		showVideoDuration: function(duration) {
			var timeString = this.formatTime(duration);
			this.SELECTOR.find(".duration").html(timeString);
		},

		//------------------------------------------------
		// Show current time
		//------------------------------------------------
		showCurrentTime: function(time) {
			var timeString = this.formatTime(time);
			this.SELECTOR.find(".current").html(timeString);
		},

		//------------------------------------------------
		// Switch states and signal click
		//------------------------------------------------
		onPlayButtonClicked: function(e) {
			if (this.playButton.hasClass("active")) {
				this.playButton.removeClass("active");
				_public.trigger(BARBOUR.christmas.Events.PAUSE_CLICKED);
			} else {
				this.playButton.addClass("active");
				_public.trigger(BARBOUR.christmas.Events.PLAY_CLICKED);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Switch states and signal click
		//------------------------------------------------
		onMuteButtonClicked: function(e) {
			if (this.muteButton.hasClass("active")) {
				this.muteButton.removeClass("active");
				_public.trigger(BARBOUR.christmas.Events.UNMUTE_CLICKED);
			} else {
				this.muteButton.addClass("active");
				_public.trigger(BARBOUR.christmas.Events.MUTE_CLICKED);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Signal progress bar was clicked
		//------------------------------------------------
		onProgressClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.PROGRESS_CLICKED);
		},

		//------------------------------------------------
		// Fade in copy
		//------------------------------------------------
		onControlsHiddenShowMessage: function() {
			this.SELECTOR.find(".message").stop().fadeIn(200);
		},

		//------------------------------------------------
		// Fade in controls
		//------------------------------------------------
		onMessageHiddenShowControls: function() {
			this.SELECTOR.find(".controls").stop().animate({opacity: 1}, 200);
		},

		//------------------------------------------------
		// Show help panel
		//------------------------------------------------
		onHelpButtonClicked: function(e) {
			_public.trigger(BARBOUR.christmas.Events.HELP_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};