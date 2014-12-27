////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Label overlays for main film app
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.home.film");

BARBOUR.christmas.views.home.film.Labels = function(selector, lookData) {

	var _public = NATION.EventDispatcher();

	//------------------------------------------------
	// Update UL contents then show
	//------------------------------------------------
	_public.show = function(currentTime) {
		_private.updateLabels(currentTime);
		_private.SELECTOR.css({opacity: 1});
		this.resize();
	};

	//------------------------------------------------
	// Hide container
	//------------------------------------------------
	_public.hide = function() {
		_private.SELECTOR.css({opacity: 0});
	};

	//------------------------------------------------
	// Resize container
	//------------------------------------------------
	_public.resize = function() {
		_private.resizeContainer();
	};

	//------------------------------------------------
	// Return clicked ID
	//------------------------------------------------
	_public.getClickedLabelID = function() {
		return _private.clickedLabelID;
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		lookData: [],
		clickedLabelID: 0,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.lookData = lookData;
			this.createListeners();
			this.resizeContainer();
			_public.hide();
		},

		//------------------------------------------------
		// Listen for label clicks
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.on("click", "a", function(e) {_private.onLabelClicked(e);});
		},

		//------------------------------------------------
		// Clear labels and recreate those for current time period
		//------------------------------------------------
		updateLabels: function(currentTime) {
			var i = 0, length = this.lookData.length;
			this.SELECTOR.html("");
			var html = "";
			for (; i < length; i++) {
				if (currentTime > this.lookData[i].startTime && currentTime < this.lookData[i].endTime) {
					html += this.createLabel(this.lookData[i], currentTime, i);
				}
			}
			this.SELECTOR.html(html);
		},

		//------------------------------------------------
		// Draw a single label
		//------------------------------------------------
		createLabel: function(labelData, currentTime, id) {
			var progress = (currentTime - labelData.startTime) / (labelData.endTime - labelData.startTime);
			var posX = labelData.startPosX + ((labelData.endPosX - labelData.startPosX) * progress);
			var posY = labelData.startPosY + ((labelData.endPosY - labelData.startPosY) * progress);
			var html = "<li style='left: " + posX + "%; top: " + posY + "%'>";
			html += "<a href='#' data-id='" + id + "'>" + labelData.copy + "</a><span class='background'></span></li>";
			return html;
		},

		//------------------------------------------------
		// Ensures container is same size/position as video
		//------------------------------------------------
		resizeContainer: function() {
			this.SELECTOR.removeAttr("style");
			var fullWidth = this.SELECTOR.width();
			var fullHeight = this.SELECTOR.height() - 148;
			var newWidth = 0, newHeight = 0, newTop = 0, newLeft = 0, newBottom = 0;
			if ((fullWidth / 640) > (fullHeight/360)) {
				newWidth = ((fullHeight / 360) * 640);
				newLeft = ((fullWidth - newWidth) / 2);
				newRight = newLeft;
			} else {
				newHeight = ((fullWidth / 640) * 360);
				newLeft = 0;
				newTop = ((fullHeight - newHeight) / 2);
				newBottom = newTop;
			}
			this.SELECTOR.css({bottom: newBottom, top: newTop, left: newLeft, right: newLeft});
		},

		//------------------------------------------------
		// Signal the label click 640/360
		//------------------------------------------------
		onLabelClicked: function(e) {
			this.clickedLabelID = $(e.currentTarget).data("id");
			var label = $(e.currentTarget).html();
			_gaq.push(['_trackEvent', 'Video', 'click', label]);
			_public.trigger(BARBOUR.christmas.Events.LABEL_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};