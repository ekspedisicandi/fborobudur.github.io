////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Requires: Nation Libs, jQuery, jQuery Easing Plugin 1.6
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.controllers");

BARBOUR.christmas.controllers.MainController = function() {

	var _public = {

	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		pageModel: null,
		pageView: null,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			if (History.init) History.init();
			this.createEvents();
			this.createPage();
		},

		//------------------------------------------------
		// Shortcut to vent strings used throughout the site
		//------------------------------------------------
		createEvents: function() {
			BARBOUR.christmas.Events = BARBOUR.christmas.models.global.WebsiteEvents;
		},

		//------------------------------------------------
		// Create relevant page model/view where needed
		//------------------------------------------------
		createPage: function() {
			var pageName = $('#dynamic-page').attr("class");
			if (pageName) {
				pageName = pageName.replace("page-", "");
				pageName = pageName.replace(/-/g, " ");
				pageName = NATION.Utils.camelcaseString(pageName);
				pageName = pageName.replace(/ /g, "");
				this.pageName = pageName;
				if (BARBOUR.christmas.models) {
					if (BARBOUR.christmas.models[pageName + "Model"]) {
						this.pageModel = new BARBOUR.christmas.models[pageName + "Model"]();
					}
				}
				if (BARBOUR.christmas.views[pageName + "View"]) {
					this.pageView = new BARBOUR.christmas.views[pageName + "View"]($('#dynamic-page'), this.pageModel);
				} else {
					if (window.console) if (console.log) console.log("Cannot create view for " + pageName);
				}
			}
		}
	};

	_private.init();
	return _public;
};

//------------------------------------------------
// Start controller when ready
//------------------------------------------------
if (BARBOUR.christmas.views) {
	BARBOUR.christmas.application = new BARBOUR.christmas.controllers.MainController();
} else {
	$(document).ready(function(e) {
		if (!BARBOUR.christmas.application) BARBOUR.christmas.application = new BARBOUR.christmas.controllers.MainController();
	});
}