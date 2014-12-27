////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Global Event Names
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.models.global");

BARBOUR.christmas.models.global.WebsiteEvents = (function() {

	var _public = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		CLOSE_CLICKED: "CloseClicked",
		PLAY_CLICKED: "PlayClicked",
		PAUSE_CLICKED: "PauseClicked",
		MUTE_CLICKED: "MuteClicked",
		UNMUTE_CLICKED: "UnMuteClicked",
		PROGRESS_CLICKED: "ProgressClicked",
		HELP_CLICKED: "HelpClicked",
		LABEL_CLICKED: "LabelClicked",
		HOTSPOT_CLICKED: "HotspotClicked",
		OPTION_CLICKED: "OptionClicked",
		TAB_CLICKED: "TabClicked",
		PROMO_CLICKED: "PromoClicked",
		VIDEO_COMPLETE: "VideoComplete",
		VIDEO_HIDDEN: "VideoClosed",
		VIDEO_SHOWN: "VideoShown",
		PRODUCT_CLICKED: "ProductClicked"
	};

	return _public;
}());