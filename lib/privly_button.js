/**
 * @fileOverview
 *
 **/

const { data } = require("sdk/self");
var privlyButton = {
  button: undefined,
  panel: undefined,
  ACTIVE: {"label": "Privly injection enabled.",
           "badge": "on",
           "badgeColor": "#5CB85C",
           },
  INACTIVE: {"label": "Privly injection disabled.",
             "badge": "off",
             "badgeColor": "#D9534F",
             },
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
                  //contentScriptWhen: "start",
                  height: 307,
                });
    privlyButton.panel = panel;
    privlyButton.registerPanelEventHandlers();
    privlyButton.button = button;
  },
  getButtonStatus: function() {
    if (privlyButton.button.badge === "off") {
      return "inactive";
    } else {
      return "active";
    }
  },
  registerPanelEventHandlers: function() {
    var pb = privlyButton;
    var panel = privlyButton.panel;
    panel.on("hide", function() {
      pb.button.state('window', {checked: false});
    });
    panel.port.on("hyperlink", pb.openPages);
  },
  openPages: function(message) {
    var pb = privlyButton;
    var tabs = require("sdk/tabs");
    var pages = {
      "history": "chrome://privly/content/privly-applications/History/new.html",
      "message": "chrome://privly/content/privly-applications/Message/new.html",
      "options": "chrome://privly/content/privly-applications/Pages/ChromeOptions.html",
      "help": "chrome://privly/content/privly-applications/Help/new.html",
    }
    if (message === "toggleMode") {
      pb.toggleButtonState();
      pb.panel.port.emit("extensionMode", pb.getButtonStatus());  
    } else {
      if (typeof pages[message] !== "undefined") {
        tabs.open(pages[message]);
      }
    }
  },
  handleChange: function(state) {
    var pb = privlyButton;
    var panel = pb.panel;
    if (state.checked) {
      panel.port.emit("extensionMode", pb.getButtonStatus());
      panel.show({
        position: pb.button,
      });
    }
  },
  toggleButtonState: function() {
    var button = privlyButton.button;
    if (button.badge === "off") {
      button.state(button, privlyButton.ACTIVE);
    } else {
      button.state(button, privlyButton.INACTIVE);
    }
  }
};
exports.setupButton = privlyButton.setup;
