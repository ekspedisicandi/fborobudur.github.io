////////////////////////////////////////////////////////////////////////////////
// Nation Lbrary
// Sprite
// selector: the target image
// frameWidth: width in pixels of a single frame
////////////////////////////////////////////////////////////////////////////////
NATION.Sprite = function(selector, frameWidth, useImage, framerate) {
	var _public = new NATION.EventDispatcher();

	//------------------------------------------------
	// Events
	//------------------------------------------------
	_public.COMPLETE = "AnimationComplete";

	//------------------------------------------------
	// Returns the current frame displayed
	//------------------------------------------------
	_public.getCurrentFrame = function() {
		return _private.currentFrame;
	};

	//------------------------------------------------
	// Returns total frames in current image
	//------------------------------------------------
	_public.getTotalFrames = function() {
		return _private.totalFrames;
	};

	//------------------------------------------------
	// Go to a specified frame and stop
	//------------------------------------------------
	_public.gotoAndStop = function(frameID) {
		if (_private.animating) this.stop();
		_private.moveToFrame(frameID);
	};

	//------------------------------------------------
	// Animate to target frame
	//------------------------------------------------
	_public.animateTo = function(frameID) {
		if (_private.currentFrame !== frameID && _private.loadComplete) {
			if (_private.animating) this.stop();
			_private.targetFrame = frameID;
			_private.animate();
		}
	};

	//------------------------------------------------
	// Animates to a frame and back again
	// endFrameID is optional, otherwise it defaults
	// to currentFrame
	//------------------------------------------------
	_public.animateToAndBack = function(targetFrameID, endFrameID) {
		if (_private.currentFrame !== targetFrameID) {
			if (_private.animating) this.stop();
			_private.targetFrame = targetFrameID;
			_private.returnFrame = endFrameID || _private.currentFrame;
			_private.returnRequired = true;
			_private.animate();
		}
	};

	//------------------------------------------------
	// Stop animating
	//------------------------------------------------
	_public.stop = function() {
		_private.animating = false;
		_private.returnRequired = false;
		if (_private.animTimer) clearTimeout(_private.animTimer);
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		frameWidth: 0,
		totalFrames: 0,
		loadCheckTimer: null,
		targetFrame: 0,
		currentFrame: 0,
		framerate: 24,
		animating: false,
		returnFrame: 0,
		returnRequired: false,
		imageURL: "",
		loadComplete: false,
		spriteImage: null,

		//------------------------------------------------
		// Init sprite
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.frameWidth = frameWidth;
			if (framerate) this.framerate = framerate;
			if (useImage) {
				this.imageURL = this.SELECTOR.attr("src");
			} else {
				this.imageURL = this.SELECTOR.css("background-image").replace("url(", "").replace(")", "").replace(/'/g, "").replace(/"/g, "");
			}
			this.preloadImage();
		},

		//------------------------------------------------
		// Ensure sprite has loaded
		//------------------------------------------------
		preloadImage: function() {
			this.spriteImage = document.createElement("img");
			this.spriteImage.onload = function() {_private.onImageLoadComplete();};
			this.spriteImage.src = this.imageURL;
		},

		//------------------------------------------------
		// Image now has dimensions, so calc total frames
		//------------------------------------------------
		onImageLoadComplete: function() {
			this.loadComplete = true;
			this.calculateTotalFrames();
		},

		//------------------------------------------------
		// Wait for image to have a width
		//------------------------------------------------
		calculateTotalFrames: function() {
			if (this.spriteImage.width > 0) {
				this.totalFrames = Math.floor(this.spriteImage.width / this.frameWidth);
			} else {
				clearTimeout(this.loadCheckTimer);
				this.loadCheckTimer = setTimeout(function() {_private.calculateTotalFrames();}, 200);
			}
		},

		//------------------------------------------------
		// Move sprite to correct x pos
		//------------------------------------------------
		moveToFrame: function(frameID) {
			this.currentFrame = frameID;
			var newPos = -(this.frameWidth * frameID);
			if (this.useImage) {
				this.SELECTOR.css({left: newPos + "px"});
			} else {
				this.SELECTOR.css({backgroundPosition: newPos + "px 0"});
			}
		},

		//------------------------------------------------
		// Progress one frame at target framerate
		//------------------------------------------------
		animate: function() {
			var newFrame = 0;
			if (this.targetFrame > this.currentFrame) {
				newFrame = this.currentFrame + 1;
			} else {
				newFrame = this.currentFrame - 1;
			}
			this.moveToFrame(newFrame);
			if (this.animTimer) clearTimeout(this.animTimer);
			if (this.currentFrame !== this.targetFrame) {
				this.animating = true;
				this.animTimer = setTimeout(function() {_private.animate();}, Math.floor((1000 / this.framerate)));
			} else {
				// Return to a starting frame if required
				if (this.returnRequired) {
					this.returnRequired = false;
					this.targetFrame = this.returnFrame;
					this.animTimer = setTimeout(function() {_private.animate();}, Math.floor((1000 / this.framerate)));
				} else {
					this.animating = false;
					_public.trigger(_public.COMPLETE);
				}
			}
		}
	};

	_private.init();
	return _public;
};