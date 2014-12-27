////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Video player progress bar
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.ProgressBar = function(selector) {

	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Triggers a marker repositioning
	//------------------------------------------------
	_public.setVideoLength = function(duration) {
		_private.videoDuration = duration;
		_private.getMarkerData();
		_private.positionMarkers();
	};

	//------------------------------------------------
	// Adjusts progressbar width
	//------------------------------------------------
	_public.setProgress = function(percentage) {
		_private.progress = percentage;
		_private.SELECTOR.find(".progress").css({width: (percentage * 100) + "%"});
		var i = 0, length = _private.markers.length;
		for (; i < length; i++) {
			if (_private.markerTimes[i] <= percentage && !_private.activeMarkers[i]) {
				$(_private.markers[i]).addClass("active");
				_private.activeMarkers[i] = true;
			} else if (_private.markerTimes[i] > percentage && _private.activeMarkers[i]) {
				$(_private.markers[i]).removeClass("active");
				_private.activeMarkers[i] = false;
			}
		}
	};

	//------------------------------------------------
	// Adjusts loaded bar width
	//------------------------------------------------
	_public.setLoaded = function(percentage) {
		_private.loaded = percentage;
		_private.SELECTOR.find(".loaded").css({width: (percentage * 100) + "%"});
		var i = 0, length = _private.markers.length;
		for (; i < length; i++) {
			if (_private.markerTimes[i] <= percentage && !_private.loadedMarkers[i]) {
				$(_private.markers[i]).addClass("loadStatus");
				_private.loadedMarkers[i] = true;
			} else if (_private.markerTimes[i] > percentage && _private.loadedMarkers[i]) {
				$(_private.markers[i]).removeClass("loadStatus");
				_private.loadedMarkers[i] = false;
			}
		}
	};

	//------------------------------------------------
	// Percentage a user clicked at
	//------------------------------------------------
	_public.getRequestedPosition = function() {
		return _private.requestedPosition;
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		progress: 0,
		loaded: 0,
		requestedPosition: 0,
		markers: null,
		markerTimes: [],
		activeMarkers: [],
		loadedMarkers: [],
		videoDuration: 0,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.SELECTOR.find(".progress, .loaded").width(0);
			this.createListeners();
		},

		//------------------------------------------------
		// Store marker times
		//------------------------------------------------
		getMarkerData: function() {
			this.markers = this.SELECTOR.find(".cuepoints li");
			var i = 0, length = this.markers.length;
			for (; i < length; i++) {
				this.markerTimes.push($(this.markers[i]).data("seconds") / this.videoDuration);
				this.activeMarkers.push(false);
				this.loadedMarkers.push(false);
			}
		},

		//------------------------------------------------
		// Position scene change cues
		//------------------------------------------------
		positionMarkers: function() {
			var i = 0, length = this.markers.length, percentage = 0;
			for (; i < length; i++) {
				percentage = this.markerTimes[i];
				newPos = percentage * 100;
				$(this.markers[i]).css({left: newPos + "%"});
			}
		},

		//------------------------------------------------
		// Listen for user progress bar clicks
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".hitarea").on("click", function(e) {_private.onHitAreaClicked(e);});
		},

		//------------------------------------------------
		// Store requested position
		//------------------------------------------------
		onHitAreaClicked: function(e) {
			var clickedPos = e.pageX - this.SELECTOR.find(".hitarea").offset().left;
			this.requestedPosition = clickedPos / this.SELECTOR.find(".hitarea").width();
			_public.trigger(BARBOUR.christmas.Events.PROGRESS_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		}
	}

	_private.init();
	return _public;
};