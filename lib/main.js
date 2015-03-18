var buttons = require("sdk/ui/button/action");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var pref = require("sdk/preferences/service");
pref.set("extensions.privly.posting_content_server_url", "https://privlyalpha.org");

var enabled = "Privly Injection On";
var disabled = "Privly Injection Off";

var ACTIVE = {"label": enabled,
              "badge": "on",
              "badgeColor": "#009933",
              "icon": {"16": "./skin/logo_16.png",
                       "32": "./skin/logo_32.png",
                       "64": "./skin/logo_64.png"}
              };

var INACTIVE = {"label": disabled,
                "badge": "off",
                "badgeColor": "#993333",
                "icon": {"16": "./skin/disabled_logo_16.png",
                         "32": "./skin/disabled_logo_32.png",
                         "64": "./skin/disabled_logo_64.png"}
                };

var button = buttons.ActionButton({
  id: "Privly",
  label: enabled,
  icon: {
    "16": "./skin/logo_16.png",
    "32": "./skin/logo_32.png",
    "64": "./skin/logo_64.png"
  },
  onClick: handleClick
});

button.state(button, ACTIVE);

function toggleButtonState() {  
  if(button.label == disabled) {
    button.state(button, ACTIVE);
  } else {
    button.state(button, INACTIVE);
  }
  return;
};

function getButtonState() {
  if(button.label == enabled) {
    return 1;
  } else {
    return 0;
  }
};

/*
 * Injects content-scripts on page loads
 */
pageMod.PageMod({
  include: "*",
  contentScriptFile: [data.url("./content_scripts/resize.js"),
                      data.url("./content_scripts/privly.js")],
  onAttach: function(worker) {
    worker.port.on("startPrivly?", function(message) {
      var start = "no";
      if(getButtonState() === 1) {
        start = "yes";
      }
      worker.port.emit("confirmStart", JSON.stringify({"start": start}));
    });
  }
});

/*
 * Function called when toolbar button is clicked
 */
function handleClick(state) {
  // Toggle Button States
  toggleButtonState();  
};
