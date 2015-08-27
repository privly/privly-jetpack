/**
 * @fileOverview This file defines the basic UI elements for this extension, i.e,
 * the button displayed on the browser toolbar, and the popup(Jetpack panel) 
 * triggered by the button.
 **/

const { data } = require("sdk/self");
// Privly Namespace
var Privly;
var GLOBALS = this;

/**
 * @namespace extension popup button
 */ 
var popupButton = {

  /**
   * ToggleButton object created during popupButton.setup
   */
  button: undefined,

  /**
   * Panel object created during popupButton.setup
   */
  panel: undefined,

  /**
   * "active" popup button parameters.
   */
  ACTIVE: {"label": "Privly | Injection enabled.",
           "icon": {
                    "16": "./skin/logo_16.png",
                    "32": "./skin/logo_32.png",
                    "64": "./skin/logo_64.png"
                    },
           },

  /**
   * "inactive" popup button parameters.
   */
  INACTIVE: {"label": "Privly | Injection disabled.",
             "icon": {
                      "16": "./skin/disabled_logo_16.png",
                      "32": "./skin/disabled_logo_32.png",
                      "64": "./skin/disabled_logo_64.png"
                      },
             },

  /**
   * Defines the basic UI elements for this extension,i.e, the button and the 
   * popup(Jetpack panel). This function is called from the central file "extension.js".
   *
   * @param {Object} PrivlyNS Privly Namespace loaded in lib/extension.js
   */
  setup: function(PrivlyNS) {

    Privly = PrivlyNS;

    var button = require("sdk/ui/button/toggle").ToggleButton({
                   id: "Privly",
                   label: popupButton.ACTIVE.label,
                   icon: {
                     "16": "./skin/logo_16.png",
                     "32": "./skin/logo_32.png",
                     "64": "./skin/logo_64.png"
                   },
                   onChange: popupButton.handleChange,
                 });

    if (Privly.options.isInjectionEnabled() === true) {
      button.state(button, popupButton.ACTIVE);
    } else {
      button.state(button, popupButton.INACTIVE);
    }

    var panel = require("sdk/panel").Panel({
                  contentURL: data.url("./pages/popup.html"),
                  contentScriptFile: [data.url(Privly.CONTEXT_MESSENGER),
                                      data.url("./content_scripts/popup.js")],
                  height: 307,
                  onHide: function() {
                    button.state("window", {checked: false}); 
                  }
                });

    popupButton.panel = panel;
    Privly.message.currentAdapter.addWorker(panel);
    // Receive messages from popup.js. 
    // Messages indicate the action to be taken.
    Privly.message.addListener(popupButton.openPages);
    popupButton.button = button;

  },

  /**
   * Helper function that returns the current popup button state, 
   * i.e, whether Injection is active or not.
   *
   * @returns {string} "active/inactive" - indicating the button state.
   */
  getButtonState: function() {
    if (popupButton.button.label === popupButton.INACTIVE.label) {
      return "inactive";
    } else {
      return "active";
    }
  },

  /**
   * Callback on receiving a message from "content_scripts/popup.js".
   * Popup displays the following links :-
   * 1) Toggle Injection (doesn't open a page, only changes extension mode).
   * 2) View History
   * 3) New Message
   * 4) Options
   * 5) Help
   *
   * @param {string} message Message passed from popup.js content script.
   *                         The message indicates the action to be taken,
   *                         which could be either toggling the extension mode 
   *                         or opening a requested page.
   * @param {Function} sendResponse Function used to send a response back.
   */
  openPages: function(message, sendResponse) {

    if (message.name === "hyperlink") {
      var pb = popupButton;
      var tabs = require("sdk/tabs");
      // Set of pages that can be opened from popup links.
      var pages = {
        "history": "chrome://privly/content/privly-applications/History/new.html",
        "message": "chrome://privly/content/privly-applications/Message/new.html",
        "options": "chrome://privly/content/privly-applications/Pages/ChromeOptions.html",
        "help": "chrome://privly/content/privly-applications/Help/new.html",
      }
      if (message.content === "toggleMode") {
        // Don't open a page, instead toggle extension mode.
        // Extension modes - Injection enabled or disabled.
        pb.toggleButtonState();
        for (let tab of tabs) {
          let worker = tab.attach({
            contentScriptFile: [data.url(Privly.CONTEXT_MESSENGER),
                                data.url("./content_scripts/privly.js"),
                                data.url("./content_scripts/toggle.js")],
            // Pass extensionMode option to content script.
            // extensionMode determines whether privly content script needs to be run.
            contentScriptOptions: {
              "extensionMode": pb.getButtonState(),
              "whitelist": Privly.options.getWhitelistRegExp(),
            },
          });
        }
        sendResponse({name: "extensionMode", content: pb.getButtonState()});
      } else {
        // Open the necessary page.
        if (typeof pages[message.content] !== "undefined") {
          tabs.open(pages[message.content]);
        }
      }
    }
  },

  /**
   * Event handler callback on popup button "click", configured during
   * the button setup.
   *
   * @param {object} state ToggleButton "state" object.
   */
  handleChange: function(state) {
    var pb = popupButton;
    if (state.checked) {
      Privly.message.messageContentScripts({
        name: "extensionMode",
        content: pb.getButtonState(),
      });
      pb.panel.show({
        position: pb.button,
      });
    }
  },

  /**
   * Helper function to toggle the button state(Injection enabled or
   * disabled). Called from openPages() when "Toggle Injection" is 
   * clicked in the popup.
   */
  toggleButtonState: function() {
    var pb = popupButton;
    var button = pb.button;
    if (button.label === pb.INACTIVE.label) {
      Privly.options.setInjectionEnabled(true);
      button.state(button, pb.ACTIVE);
    } else {
      Privly.options.setInjectionEnabled(false);
      button.state(button, pb.INACTIVE);
    }
  },

  /**
   * Returns the coverage data for this file/module when tested.
   */
  coverage: function() {
    var cv = require("./coverage_var.js").coverageVar;
    return GLOBALS[cv.generate("privly_ui.js")];
  }

};
exports.popupButton = popupButton;
