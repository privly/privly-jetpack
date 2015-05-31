/**
 * @fileOverview This file defines the privly button displayed on the 
 * browser toolbar. It also defines the popup(Jetpack panel) and event handlers.
 **/

const { data } = require("sdk/self");

/**
 * @namespace extension button
 */ 
var privlyButton = {

  /**
   * Toggle button object created during privlyButton.setup
   */
  button: undefined,

  /**
   * Panel object created during privlyButton.setup
   */
  panel: undefined,

  /**
   * "active" button parameters.
   */
  ACTIVE: {"label": "Privly injection enabled.",
           "badge": "on",
           "badgeColor": "#5CB85C",
           },

  /**
   * "inactive" button parameters.
   */
  INACTIVE: {"label": "Privly injection disabled.",
             "badge": "off",
             "badgeColor": "#D9534F",
             },

  /**
   * Defines the privly button and panel.
   */
  setup: function() {

    var button = require("sdk/ui/button/toggle").ToggleButton({
                   id: "Privly",
                   label: "Privly injection enabled",
                   icon: {
                     "16": "./skin/logo_16.png",
                     "32": "./skin/logo_32.png",
                     "64": "./skin/logo_64.png"
                   },
                   onChange: privlyButton.handleChange,
                 });

    // Default state: ACTIVE
    button.state(button, privlyButton.ACTIVE);

    var panel = require("sdk/panel").Panel({
                  contentURL: data.url("./pages/popup.html"),
                  contentScriptFile: data.url("./content_scripts/popup.js"),
                  height: 307,
                  onHide: function() {
                    button.state("window", {checked: false}); 
                  }
                });

    privlyButton.panel = panel;
    // Event handler called when links in popup are clicked.
    // event is triggered in content_scripts/popup.js
    panel.port.on("hyperlink", privlyButton.openPages);
    privlyButton.button = button;

  },

  /**
   * Returns the button state, i.e, whether Injection is active or not.
   */
  getButtonState: function() {
    if (privlyButton.button.badge === "off") {
      return "inactive";
    } else {
      return "active";
    }
  },

  /**
   * EventHandler for clicked links in panel/popup.
   * Popup displays several links :- 
   * 1) Toggle Injection (doesn't open a page, only changes extension mode).
   * 2) View History
   * 3) New Message
   * 4) Options
   * 5) Help
   *
   */
  openPages: function(message) {

    var pb = privlyButton;
    var tabs = require("sdk/tabs");
    // Set of pages that can be opened from popup links.
    var pages = {
      "history": "chrome://privly/content/privly-applications/History/new.html",
      "message": "chrome://privly/content/privly-applications/Message/new.html",
      "options": "chrome://privly/content/privly-applications/Pages/ChromeOptions.html",
      "help": "chrome://privly/content/privly-applications/Help/new.html",
    }
    if (message === "toggleMode") {
      // Toggle extension mode - Injection active or inactive.
      pb.toggleButtonState();
      for (let tab of tabs) {
        let worker = tab.attach({
          contentScriptFile: [data.url("./content_scripts/privly.js"),
                              data.url("./content_scripts/toggle.js")],
          contentScriptOptions: {
            "extensionMode": privlyButton.getButtonState()
          },
        });
      }
      pb.panel.port.emit("extensionMode", pb.getButtonState());

    } else {
      // Open the necessary page.
      if (typeof pages[message] !== "undefined") {
        tabs.open(pages[message]);
      }
    }
  },

  /**
   * EventHandler for privly button 'click'.
   */
  handleChange: function(state) {
    var pb = privlyButton;
    var panel = pb.panel;
    if (state.checked) {
      panel.port.emit("extensionMode", pb.getButtonState());
      panel.show({
        position: pb.button,
      });
    }
  },

  /**
   * Toggle the button state.
   */
  toggleButtonState: function() {
    var button = privlyButton.button;
    if (button.badge === "off") {
      button.state(button, privlyButton.ACTIVE);
    } else {
      button.state(button, privlyButton.INACTIVE);
    }
  }
};
exports.privlyButton = privlyButton;
