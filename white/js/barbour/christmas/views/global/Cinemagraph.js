////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Cinemagraph
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.global");

BARBOUR.christmas.views.global.Cinemagraph = function(selector, tabletVersion) {

	var _public = {

	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		hotspots: null,
		shareOptions: null,
		slideshow: null,
		title: "",
		tabletVersion: false,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.title = this.SELECTOR.find("h1").html();
			this.tabletVersion = tabletVersion;
			this.createHotspots();
			this.createSlideshow();
			this.createShareOptions();
			this.createListeners();
		},

		//------------------------------------------------
		// Places hotspots for this cinemagraph
		//------------------------------------------------
		createHotspots: function() {
			this.hotspots = new BARBOUR.christmas.views.global.cinemagraph.Hotspots(this.SELECTOR.find(".hotspots"));
		},

		//------------------------------------------------
		// Slideshow that shows each product
		//------------------------------------------------
		createSlideshow: function() {
			this.slideshow = new BARBOUR.christmas.views.global.cinemagraph.Slideshow(this.SELECTOR.find(".product-slideshow"));
		},

		//------------------------------------------------
		// Handle share button functionality
		//------------------------------------------------
		createShareOptions: function() {
			this.shareOptions = new BARBOUR.christmas.views.global.cinemagraph.ShareOptions(this.SELECTOR, this.tabletVersion);
		},

		//------------------------------------------------
		// Listen for hotspot clicks
		//------------------------------------------------
		createListeners: function() {
			this.hotspots.addListener(BARBOUR.christmas.Events.HOTSPOT_CLICKED, function(e) {_private.onHotspotClicked(e);});
			this.slideshow.addListener(BARBOUR.christmas.Events.PRODUCT_CLICKED, function(e) {_private.onProductLinkClicked(e);});
		},

		//------------------------------------------------
		// Show slideshow defaulting to relevant slide
		//------------------------------------------------
		onHotspotClicked: function(e) {
			var clickedHotspotID = this.hotspots.getClickedHotspotID();
			var productName = this.slideshow.getProductName(clickedHotspotID);
			this.slideshow.show(clickedHotspotID);
			_gaq.push(['_trackEvent', 'Hotspots', 'click', this.title + ", " + productName + ": Hotspot clicked"]);
		},

		//------------------------------------------------
		// Handle tracking
		//------------------------------------------------
		onProductLinkClicked: function(e) {
			var clickedHotspotID = this.hotspots.getClickedHotspotID();
			var productName = this.slideshow.getProductName(clickedHotspotID);
			_gaq.push(['_trackEvent', 'Hotspots', 'click', this.title + ", " + productName + ": Product link clicked"]);
		}
	};

	_private.init();
	return _public;
};