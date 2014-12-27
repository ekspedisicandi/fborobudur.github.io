////////////////////////////////////////////////////////////////////////////////
// Nation Library
// Basic YouTube Video Player using the iFrame API
// - If full screen functionality is required, the browser must support
// the fullscreen API.
// - Selector should contain '.player' for the video
// - CustomControls, if true, will remove the stock YouTube controls
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("NATION.video");

NATION.video.BasicYouTubePlayer = function(selector, customControls, autoPlay) {
	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Public variables
	//------------------------------------------------
	_public.PLAYER_READY = "PlayerReady";
	_public.VIDEO_COMPLETE = "VideoComplete";
	_public.VIDEO_PLAYING = "VideoPlaying";
	_public.VIDEO_PAUSED = "VideoPaused";
	_public.PLAY_PROGRESS = "PlayProgress";
	_public.LOAD_PROGRESS = "LoadProgress";

	//------------------------------------------------
	// Returns if this play has started playing yet
	//------------------------------------------------
	_public.getHasPlayTriggered = function() {
		return _private.firstPlayHasHappened;
	};

	//------------------------------------------------
	// Play a new video (stop any currently playing)
	//------------------------------------------------
	_public.playNewVideo = function(autoPlay, videoURL) {
		_private.videoID = _private.getVideoID(videoURL);
		if (!_private.player || !_private.player.playVideo) {
			_private.autoPlay = autoPlay;
			if (!_private.apiLoading) {
				_private.apiLoading = true;
				_private.loadYouTubeAPI();
			} else {
				_private.autoPlayTimer = setTimeout(function() {_private.onAutoPlayTimerTicked();}, 20);
			}
		} else {
			if (_private.touchDevice && !_private.firstPlayHasHappened) {
				_private.player.cueVideoById(_private.videoID);
			} else if (!_private.touchDevice || (_private.touchDevice && _private.firstPlayHasHappened)) {
				_private.player.loadVideoById(_private.videoID);
			}
		}
	};

	//------------------------------------------------
	// Rebuild the YouTube player
	//------------------------------------------------
	_public.rebuild = function(autoPlay, videoURL) {
		_private.videoURL = videoURL;
		_private.videoID = _private.getVideoID();
		_private.autoPlay = autoPlay;
		_private.player = null;
		_private.apiLoading = true;
		_private.firstPlayHasHappened = false;
		if (_private.touchDevice) {
			_private.SELECTOR.find(".large-play-button").hide();
		}
		if (typeof YT === "undefined") {
			_private.loadYouTubeAPI();
		} else {
			_private.onYouTubeAPILoaded();
		}
	};

	//------------------------------------------------
	// Kill this player
	//------------------------------------------------
	_public.remove = function() {
		swfobject.removeSWF("youtube-video");
		window.onPlayerStateChange = function() {};
		_private.player.stopVideo();
		_private.SELECTOR.find(".player-container").html("");
	};

	//------------------------------------------------
	// Play
	//------------------------------------------------
	_public.playVideo = function() {
		if (_private.touchDevice) {
			if (_private.firstPlayHasHappened) {
				_private.player.playVideo();
			}
		} else {
			if (_private.player.playVideo) {
				_private.player.playVideo();
			} else {
				_private.autoPlay = true;
			}
		}
	};

	//------------------------------------------------
	// Pause
	//------------------------------------------------
	_public.pauseVideo = function() {
		if (_private.player.pauseVideo) {
			_private.player.pauseVideo();
		} else {
			_private.autoPlay = false;
		}
	};

	//------------------------------------------------
	// Mute
	//------------------------------------------------
	_public.mute = function() {
		if (!_private.muted) {
			_private.muted = true;
			_private.player.mute();
		}
	};

	//------------------------------------------------
	// Unmute
	//------------------------------------------------
	_public.unMute = function() {
		if (_private.muted) {
			_private.muted = false;
			_private.player.unMute();
		}
	};

	//------------------------------------------------
	// Seek video to position
	//------------------------------------------------
	_public.seekTo = function(time) {
		_private.seekingToTime = Math.floor(time);
		_private.player.seekTo(time);
	};

	//------------------------------------------------
	// Returns current play position
	//------------------------------------------------
	_public.getCurrentTime = function() {
		return _private.player.getCurrentTime();
	};

	//------------------------------------------------
	// Returns current progress percentage
	//------------------------------------------------
	_public.getPlayProgress = function() {
		return _private.playProgress;
	};

	//------------------------------------------------
	// Returns percentage of current video loaded
	//------------------------------------------------
	_public.getVideoLoadedFraction = function() {
		return _private.player.getVideoLoadedFraction();
	};

	//------------------------------------------------
	// Returns duration of current video
	//------------------------------------------------
	_public.getDuration = function() {
		return _private.player.getDuration();
	};

	//------------------------------------------------
	// Returns string with duration in 0:00:00 format
	//------------------------------------------------
	_public.getDurationText = function() {
		return _private.durationText;
	};

	//------------------------------------------------
	// Returns string with current time in 0:00:00 format
	//------------------------------------------------
	_public.getCurrentTimeText = function() {
		return _private.currentTimeText;
	};

	//------------------------------------------------
	// Returns whether player can be used yet
	//------------------------------------------------
	_public.isReady = function() {
		return _private.playerReady;
	};

	//------------------------------------------------
	// Enters full screen mode
	//------------------------------------------------
	_public.enterFullScreen = function() {
		_private.fullScreen = true;
		var container = _private.SELECTOR[0];
		if (container.requestFullScreen) {
			container.requestFullscreen();
		} else if (container.webkitRequestFullScreen) {
			container.webkitRequestFullScreen();
		} else if (container.mozRequestFullScreen) {
			container.mozRequestFullScreen();
		} else if (container.msRequestFullScreen) {
			container.msRequestFullScreen();
		}
	};

	//------------------------------------------------
	// Exits full screen mode
	//------------------------------------------------
	_public.exitFullScreen = function() {
		_private.fullScreen = false;
		if (document.exitFullscreen) {
			document.exitFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msCancelFullScreen) {
			document.msCancelFullScreen();
		}
	};

	var _private = {

		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		API_URL: "http://www.youtube.com/iframe_api",
		apiLoading: false,
		customControls: false,
		videoID: "",
		player: null,
		playProgress: 0,
		videoPlaying: false,
		muted: false,
		currentTime: 0,
		currentMinutes: 0,
		currentSeconds: 0,
		currentTimeText: "00.00",
		duration: 0,
		durationMinutes: 0,
		durationSeconds: 0,
		durationText: "00.00",
		playTimer: null,
		loadProgress: 0,
		splashOverride: false,
		seekingToTime: 0,
		fullScreen: false,
		playerReady: false,

		//------------------------------------------------
		// Init player
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.customControls = customControls;
			this.autoPlay = autoPlay;
			var videoURL = this.SELECTOR.attr("data-video");
			if (videoURL) {
				this.getVideoID(videoURL);
			}
			this.loadAPI();
			this.createListeners();
		},

		//------------------------------------------------
		// Get ID from video URL
		//------------------------------------------------
		getVideoID: function(url) {
			var startIndex = 0, endIndex = 0;
			if (url.search("youtube.com") > -1) {
				startIndex = parseInt(url.search("v=")) + 2;
			} else {
				startIndex = parseInt(url.search("youtu.be/")) + 9;
			}
			if (url.search("&") > -1) {
				endIndex = url.search("&");
			} else if (url.search("#") > -1) {
				endIndex = url.search("#");
			} else {
				endIndex = url.length;
			}
			this.videoID = url.substr(startIndex, (endIndex - startIndex));
		},

		//------------------------------------------------
		// Load YouTube API
		//------------------------------------------------
		loadAPI: function() {
			if (!$(document).find("#youtube-api").length) {
				$.ajax({
					url: this.API_URL,
					dataType: "script",
					success: function(data, textStatus) {
						_private.apiLoading = true;
						if (_private.videoID) _private.createPlayer();
					},
					error: function(request, status, error) {
						if (window.console) console.log("YouTube API Load Error: Status = " + status + ", error = " + error);
					}
				});
			}
		},

		//------------------------------------------------
		// Listen for full screen exit
		//------------------------------------------------
		createListeners: function() {
			$(document).on("fullscreenchange msfullscreenchange webkitfullscreenchange mozfullscreenchange", function(e) {_private.onFullScreenChange(e);});
		},

		//------------------------------------------------
		// Wait for player object to exist before creation
		//------------------------------------------------
		createPlayer: function() {
			if (YT.Player) {
				this.player = new YT.Player(this.SELECTOR.find(".player")[0], {
					width: "100%",
					height: "100%",
					videoId: this.videoID,
					playerVars: {
						controls: (this.customControls) ? 0 : 1,
						modestBranding: 1,
						showinfo: 0,
						rel: 0,
						disablekb: 0,
						enablejsapi: 1,
						wmode: "opaque",
						iv_load_policy: 3,
						autoplay: (this.autoPlay) ? 1 : 0
					},
					events: {
						"onReady": function() {_private.onPlayerReady();},
						"onStateChange": function(e) {_private.onPlayerStateChange(e);},
						"onError": function(e) {_private.onVideoError(e);}
					}
				});
				this.checkPlayerIsReady();
			} else {
				// Wait for player to exist
				setTimeout(function() {_private.createPlayer();}, 300);
			}
		},

		//------------------------------------------------
		// Ensure player is fully loaded
		//------------------------------------------------
		checkPlayerIsReady: function() {
			if (this.player.playVideo) {
				this.playerReady = true;
				if (this.touchDevice) {
					//this.SELECTOR.find(".large-play-button").hide();
				}
				if (this.autoPlay) _public.playVideo();
				_public.trigger(_public.PLAYER_READY);
			} else {
				setTimeout(function() {_private.checkPlayerIsReady();}, 300);
			}
		},

		//------------------------------------------------
		// Loop that runs during playback
		//------------------------------------------------
		startPlayTimer: function() {
			clearInterval(this.playTimer);
			this.playTimer = setInterval(function(e) {_private.onPlayProgress();}, 20);
		},

		//------------------------------------------------
		// Stop look that runs during playback
		//------------------------------------------------
		stopPlayTimer: function() {
			clearInterval(this.playTimer);
		},

		//------------------------------------------------
		// Loop that runs during load
		//------------------------------------------------
		startLoadTimer: function() {
			if (this.loadTimer) clearInterval(this.loadTimer);
			this.loadTimer = setInterval(function() {_private.onLoadProgress();}, 20);
		},

		//------------------------------------------------
		// Stop updating load progress
		//------------------------------------------------
		stopLoadTimer: function() {
			if (this.loadTimer) clearInterval(this.loadTimer);
		},

		//------------------------------------------------
		// Put together current time string
		//------------------------------------------------
		getCurrentTime: function() {
			this.currentTime = Math.floor(this.player.getCurrentTime());
			// Keep display up to date when seek in progress
			if ((this.seekingToTime > 0) && (this.currentTime !== this.seekingToTime)) {
				this.currentTime = this.seekingToTime;
			} else {
				this.seekingToTime = 0;
			}
			this.currentMinutes = Math.floor(this.currentTime/60);
			this.currentSeconds = (this.currentTime%60);
			if (this.currentMinutes > 0) {
				this.currentTimeText = this.currentMinutes + ".";
			} else {
				this.currentTimeText = "0.";
			}
			if (this.currentSeconds > 0) {
				if (this.currentSeconds < 10) {
					this.currentTimeText += "0" + this.currentSeconds;
				} else {
					this.currentTimeText += this.currentSeconds;
				}
			} else {
				this.currentTimeText += "00";
			}
		},

		//------------------------------------------------
		// Put together duration string
		//------------------------------------------------
		getVideoDuration: function() {
			this.duration = Math.floor(this.player.getDuration());
			this.durationMinutes = Math.floor(this.duration/60);
			this.durationSeconds = Math.floor(this.duration%60);
			if (this.durationMinutes > 0) {
				this.durationText = this.durationMinutes + ".";
			} else {
				this.durationText = "0.";
			}
			if (this.durationSeconds > 0) {
				if (this.durationSeconds < 10) {
					this.durationText += "0" + this.durationSeconds; 
				} else {
					this.durationText += this.durationSeconds;
				}
			} else {
				this.durationText += "00";
			}
		},

		//------------------------------------------------
		// Update time and progress displayed
		//------------------------------------------------
		onPlayProgress: function() {
			// Work out current time as a string
			this.getCurrentTime();
			// Work out duration as a string
			this.getVideoDuration();
			var newProgress = 0;
			// Keep display up to date when seek in progress
			if (this.seekingToTime > 0) {
				newProgress = this.seekingToTime / this.player.getDuration();
			} else {
				newProgress = this.currentTime / this.player.getDuration();
			}
			if (newProgress !== this.playProgress) {
				this.playProgress = newProgress;
				_public.trigger(_public.PLAY_PROGRESS);
			}
		},

		//------------------------------------------------
		// Update current load percentage
		//------------------------------------------------
		onLoadProgress: function() {
			var newProgress = this.player.getVideoLoadedFraction();
			if (newProgress !== this.loadProgress) {
				_public.trigger(_public.LOAD_PROGRESS);
				this.loadProgress = newProgress;
			}
		},

		//------------------------------------------------
		// Player is ready for user to use
		//------------------------------------------------
		onPlayerReady: function(e) {
			this.playerReady = true;
			this.startLoadTimer();
			_public.trigger(_public.PLAYER_READY);
		},

		//------------------------------------------------
		// Handle state changes
		//------------------------------------------------
		onPlayerStateChange: function(e) {
			if (e.data === YT.PlayerState.ENDED) {
				this.playProgress = 1;
				this.videoPlaying = false;
				this.stopPlayTimer();
				_public.trigger(_public.VIDEO_COMPLETE);
			} else if (e.data === YT.PlayerState.PLAYING) {
				this.videoPlaying = true;
				if (this.customControls) this.startPlayTimer();
				_public.trigger(_public.VIDEO_PLAYING);
			} else if (e.data === YT.PlayerState.PAUSED) {
				this.stopPlayTimer();
				_public.trigger(_public.VIDEO_PAUSED);
			} else if (e.data === YT.PlayerState.BUFFERING) {

			}
		},

		//------------------------------------------------
		// Error with video playback
		//------------------------------------------------
		onVideoError: function(e) {
			if (window.console) console.dir(e);
		},

		//------------------------------------------------
		// Reset state if full screen exited
		//------------------------------------------------
		onFullScreenChange: function(e) {
			var fullScreenElement  = document.fullscreenElement  || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement || document.mozFullscreenElement;
			if (!fullScreenElement) {
				_private.fullScreen = false;
				_private.SELECTOR.removeAttr("style");
			} else {
				_private.fullScreen = true;
				_private.SELECTOR.css({width: "100%", height: "100%"});
			}
		}
	};

	_private.init();
	return _public;
};