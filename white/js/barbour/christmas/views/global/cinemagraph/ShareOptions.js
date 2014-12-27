////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Cinemagraph Share Functionality
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.global.cinemagraph");

BARBOUR.christmas.views.global.cinemagraph.ShareOptions = function(selector, tabletVersion) {

	var _public = NATION.EventDispatcher();

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		RESUME_WAIT_TIME: 3000,
		SELECTOR: null,
		emailForm: null,
		facebookSendInProgress: false,
		tabletVersion: false,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.tabletVersion = tabletVersion;
			if (this.SELECTOR.find(".email").length) {
				this.createEmailForm();
			}
			this.createListeners();
		},

		//------------------------------------------------
		// Handle user interaction
		//------------------------------------------------
		createListeners: function() {
			if (this.tabletVersion) {
				this.SELECTOR.find(".share, .share-inactive").on("click", function(e) {_private.onShareButtonClicked(e);});
			} else {
				this.SELECTOR.find(".share, .share-inactive").on("mouseenter", function(e) {_private.onShareButtonClicked(e);});
			}
			this.SELECTOR.find(".share, .share-inactive").on("mouseleave", function(e) {_private.onShareButtonMouseLeave(e);});
			this.SELECTOR.find(".email").on("click", function(e) {_private.onEmailClicked(e);});
			this.SELECTOR.find(".facebook").on("click", function(e) {_private.onFacebookClicked(e);});
			if (this.emailForm) this.emailForm.addListener(BARBOUR.christmas.Events.CLOSE_CLICKED, function(e) {_private.onCloseButtonClicked(e);});
		},

		//------------------------------------------------
		// Handles all form behaviour
		//------------------------------------------------
		createEmailForm: function() {
			this.emailForm = new BARBOUR.christmas.views.global.cinemagraph.EmailForm(this.SELECTOR.find(".email-panel"));
		},

		//------------------------------------------------
		// Log user into Facebook
		//------------------------------------------------
		facebookLogin: function(addEmail) {
			var scope = "email";
			FB.login(function(response) {
				if (response.authResponse) {
					if (addEmail) {
						FB.api("/me?scope=email", function(apiResponse) {
							_private.onFBLoggedIn(apiResponse.email);	
						});
					} else {
						_private.onFBLoggedIn();		
					}
				} else {
					_private.onFacebookLoginFail();
				}
			}, {scope: scope});
		},

		//------------------------------------------------
		// Revert to default state
		//------------------------------------------------
		onFacebookLoginFail: function() {
			this.SELECTOR.find(".share, .share-inactive").stop().removeAttr("style");
			this.facebookSendInProgress = false;
			this.onShareButtonMouseLeave();
		},

		//------------------------------------------------
		// Log in complete, do stuff
		//------------------------------------------------
		onFBLoggedIn: function(email) {
			if (email) this.storeEmail(email);
			this.postToFacebook();
		},

		//------------------------------------------------
		// Store email address in the database
		//------------------------------------------------
		storeEmail: function(email) {
			var url = "/sites/all/themes/barbour_christmas/php/store-address.php";
			//console.log("Comp = " + this.SELECTOR.parent().attr("id").replace("cinemagraph-", ""));
			$.ajax({
				url: url,
				data: "email=" + email + "&competition=" + this.SELECTOR.parent().attr("id").replace("cinemagraph-", ""),
				method: "get",
				success: function(result) {
					//console.log("Done!");
				},
				error: function(error) {
					//console.log(error);
				}
			});
		},

		//------------------------------------------------
		// Makes a post on the user's wall
		//------------------------------------------------
		postToFacebook: function() {
			// Request write permission separately
			FB.login(function(response) {
				if (response.authResponse) {
					_private.writeToFBWall();
				} else {
					_private.onFacebookLoginFail();
				}
			}, {scope: "publish_actions"});
		},

		//------------------------------------------------
		// Post to wall
		//------------------------------------------------
		writeToFBWall: function() {
			var params = {};
			params['link'] = this.SELECTOR.data("fb-permalink");

			FB.api("/me/feed", "post", params, function(response) {
				_private.onFacebookPostComplete();
			});
		},

		//------------------------------------------------
		// Show success message
		//------------------------------------------------
		onFacebookPostComplete: function() {
			this.SELECTOR.find(".share, .share-inactive").hide();
			this.SELECTOR.find(".share-success").show();
			this.resumeTimer = setTimeout(function() {_private.onResumeTimerTicked();}, this.RESUME_WAIT_TIME);
		},

		//------------------------------------------------
		// 
		//------------------------------------------------
		onResumeTimerTicked: function() {
			if (this.resumeTimer) clearTimeout(this.resumeTier);
			this.SELECTOR.find(".share-success").hide();
			this.SELECTOR.find(".share, .share-inactive").show();
			this.facebookSendInProgress = false;
			this.SELECTOR.find(".share, .share-inactive").stop().removeAttr("style");
		},

		//------------------------------------------------
		// Show options for sharing
		//------------------------------------------------
		onShareButtonClicked: function(e) {
			if (this.SELECTOR.find(".share-button").is(":visible")) {
				this.SELECTOR.find(".share-button").hide();
				e.stopPropagation();
				e.preventDefault();
			}
		},

		//------------------------------------------------
		// Revert back to button state
		//------------------------------------------------
		onShareButtonMouseLeave: function(e) {
			if (!this.facebookSendInProgress) {
				this.SELECTOR.find(".share-button").show();
			}
		},

		//------------------------------------------------
		// Show email panel
		//------------------------------------------------
		onEmailClicked: function(e) {
			this.SELECTOR.find(".about-panel").hide();
			this.emailForm.show();
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Show normal about panel
		//------------------------------------------------
		onCloseButtonClicked: function(e) {
			this.SELECTOR.find(".about-panel").show();
		},

		//------------------------------------------------
		// Check if user is logged in or not
		//------------------------------------------------
		onFacebookClicked: function(e) {
			this.facebookSendInProgress = true;
			this.SELECTOR.find(".share, .share-inactive").stop().fadeTo(300, 0.5);
			var addEmail = (this.SELECTOR.find(".about-panel.active").length > 0);
			FB.getLoginStatus(function(response) {
				if (response.status === "connected") {
					if (addEmail) {
						FB.api("/me?scope=email", function(apiResponse) {
							_private.onFBLoggedIn(apiResponse.email);
						});
					} else {
						_private.onFBLoggedIn();
					}
				} else {
					_private.facebookLogin(addEmail);
				}
			});
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};