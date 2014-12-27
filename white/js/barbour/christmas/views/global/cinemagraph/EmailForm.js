////////////////////////////////////////////////////////////////////////////////
// Barbour Christmas 2013 Website
// Cinemagraph Hotspots
////////////////////////////////////////////////////////////////////////////////
NATION.Utils.createNamespace("BARBOUR.christmas.views.global.cinemagraph");

BARBOUR.christmas.views.global.cinemagraph.EmailForm = function(selector) {

	var _public = NATION.EventDispatcher();

	//------------------------------------------------
	// Show email panel
	//------------------------------------------------
	_public.show = function() {
		_private.clearForm();
		_private.SELECTOR.find("form").stop().show();
		_private.SELECTOR.find(".result-screen").stop().hide();
		_private.SELECTOR.show();
	};

	//------------------------------------------------
	// Hide and reset email panel
	//------------------------------------------------
	_public.hide = function() {
		_private.SELECTOR.hide();
		this.reset();
	};

	//------------------------------------------------
	// Reset email panel
	//------------------------------------------------
	_public.reset = function() {
		_private.SELECTOR.find(".result-screen").hide();
	};

	var _private = {
		//------------------------------------------------
		// Variables
		//------------------------------------------------
		SELECTOR: null,
		requiredFields: [],
		totalFields: 0,
		fields: [],
		totalRequiredFields: 0,

		//------------------------------------------------
		// Init
		//------------------------------------------------
		init: function() {
			this.SELECTOR = $(selector);
			this.getFormDefaults();
			this.prepareCheckboxes();
			this.createListeners();
		},

		//------------------------------------------------
		// Clear fields that need it
		//------------------------------------------------
		clearForm: function() {
			var i = 0, field = null;
			for (; i < this.totalFields; i++) {
				field = $(this.fields[i]);
				if (field.prop("type") !== "submit") {
					if (!field.data("persistant")) {
						field.val("");
						if (field.prop("type") === "checkbox") {
							field.prop("checked", false);
							field.parent().find("a").removeClass("active");
						}
					}
				}
			}
		},

		//------------------------------------------------
		// Get default values
		//------------------------------------------------
		getFormDefaults: function() {
			this.fields = this.SELECTOR.find("input");
			this.totalFields = this.fields.length;
			this.requiredFields = [];
			var i = 0;
			for (; i < this.totalFields; i++) {
				if ($(this.fields[i]).data("required")) {
					this.requiredFields.push(this.fields[i]);
				}
			}
			this.totalRequiredFields = this.requiredFields.length;
		},

		//------------------------------------------------
		// Ensre fake checkboxes match state of real ones
		//------------------------------------------------
		prepareCheckboxes: function() {
			var checkboxes = this.SELECTOR.find(".checkbox-field");
			var totalCheckBoxes = checkboxes.length;
			var j = 0;
			for (; j < totalCheckBoxes; j++) {
				if ($(checkboxes[j]).find("input").attr("checked") === "checked") {
					$(checkboxes[j]).find("a").addClass("active");
				}
			}
		},

		//------------------------------------------------
		// Handle user clicks
		//------------------------------------------------
		createListeners: function() {
			this.SELECTOR.find(".close-button").on("click", function(e) {_private.onCloseButtonClicked(e);});
			this.SELECTOR.find("form").on("submit", function(e) {_private.onFormSubmitted(e);});
			this.SELECTOR.find("input").on("focusin", function(e) {_private.onInputFocusIn(e);});
			this.SELECTOR.find("input").on("focusout", function(e) {_private.onInputFocusOut(e);});
			this.SELECTOR.find(".checkbox-field .dummy-checkbox").on("click", function(e) {_private.onCheckboxChecked(e);});
			this.SELECTOR.find(".checkbox-field label").not(':contains("a")').on("click", function(e) {_private.onCheckboxChecked(e);});
		},

		//------------------------------------------------
		// Check all fields have been entered correctly
		//------------------------------------------------
		validateForm: function() {
			var i = 0, field = null, invalid = false;
			for (; i < this.totalRequiredFields; i++) {
				field = $(this.requiredFields[i]);
				if (field.prop("type") !== "checkbox") {
					var fieldValue = field.val();
					var fieldError = field.data("error");
					if (fieldValue === "" || fieldValue === fieldError) {
						field.data("current-value", "");
						field.val(fieldError).addClass("error");
						invalid = true;
					} else if (field.data("email") === true) {
						// Check for valid email address
						if (fieldValue.indexOf("@") === -1 || fieldValue.indexOf(".") === -1) {
							if (fieldValue !== fieldError) {
								field.data("current-value", fieldValue);
							}
							field.val(fieldError).addClass("error");
							invalid = true;
						}
					}
				} else {
					if (!field.prop("checked")) {
						field.parent().addClass("error");
						invalid = true;
					}
				}
			}
			return !invalid;
		},

		//------------------------------------------------
		// On error input focus
		//------------------------------------------------
		submitForm: function () {
			var url = this.SELECTOR.find("form").attr("action");
			var data = this.SELECTOR.find("form").serialize();
			$.ajax({
				url: url,
				data: data,
				scriptCharset: "utf-8",
				type: "POST",
				success: function(data) {
					_private.onFormSubmitSuccess(data);
				},
				error: function(request, status, error) {
					//console.log("Data Load Error - Status: " + status + ", Error: " + error);
				}
			});
		},

		//------------------------------------------------
		// Show thank you message
		//------------------------------------------------
		onFormSubmitSuccess: function(data) {
			this.SELECTOR.find("form").fadeOut(300, function() {
				_private.SELECTOR.find(".result-screen").fadeIn(300);
			});
		},

		//------------------------------------------------
		// On error input focus
		//------------------------------------------------
		onInputFocusIn: function(e) {
			var input = $(e.currentTarget);
			if (input.prop("type") !== "submit") {
				input.val("").removeClass("error");
				var currentValue = input.data("current-value");
				input.addClass("filled-in");
				if (currentValue !== "") {
					input.val(currentValue);
				}
			}
		},

		//------------------------------------------------
		// Remove filled in class if nothing was entered
		//------------------------------------------------
		onInputFocusOut: function(e) {
			if ($(e.currentTarget).prop("type") !== "submit" && $(e.currentTarget).val() === "") {
				$(e.currentTarget).removeClass("filled-in");
			} else if ($(e.currentTarget).val() !== "") {
				$(e.currentTarget).data("current-value", $(e.currentTarget).val());
			}
		},

		//------------------------------------------------
		// On checkbox checked
		//------------------------------------------------
		onCheckboxChecked: function(e) {
			var checkbox = $(e.currentTarget).parent().find("a");
			checkbox.parent().removeClass("error");
			if (checkbox.hasClass("active")) {
				checkbox.removeClass("active");
				checkbox.parent().find("input").prop("checked", false)
			} else {
				checkbox.addClass("active");
				checkbox.parent().find("input").prop("checked", true);
			}
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Close panel
		//------------------------------------------------
		onCloseButtonClicked: function(e) {
			_public.hide();
			_public.trigger(BARBOUR.christmas.Events.CLOSE_CLICKED);
			e.stopPropagation();
			e.preventDefault();
		},

		//------------------------------------------------
		// Check form before submission
		//------------------------------------------------
		onFormSubmitted: function(e) {
			if (this.validateForm()) {
				this.submitForm();
			}
			e.stopPropagation();
			e.preventDefault();
		}
	};

	_private.init();
	return _public;
};