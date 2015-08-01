/**
 * @fileOverview This file is the add-on's entry point that's executed 
 *               when the add-on needs to initialize itself: 
 *               for example, when Firefox starts, or when the add-on's 
 *               installed, enabled, or upgraded. 
 *               
 *               The add-on entry point can be set to a different file 
 *               using the main field in package.json.
 *
 **/

// First run.
require("./first_run.js").firstRun();

// Display popup button in browser toolbar.
var { popupButton } = require("./privly_ui.js");
popupButton.setup();

// Context Menus
var { postingProcess } = require("./posting_process.js");
postingProcess.menuSetup(popupButton.button);

/**
 * Sends the start message to privly.js. 
 * Called on receipt of "requestPrivlyStart".
 *
 * @param {String} message Message
 * @param {Object} worker Jetpack messaging API object/Content Script
 *                        instance
 */
function sendStartMessage(message, worker) {
  var start = "no";
  if(popupButton.getButtonState() === "active") {
    start = "yes";
  }
  worker.port.emit("privlyStart", JSON.stringify({"start": start}));
}

var data = require("sdk/self").data;
// Inject content script.
// Define PageMod.
require("sdk/page-mod").PageMod({
  include: "*",
  contentScriptFile: data.url("./content_scripts/privly.js"),
  onAttach: function(worker) {
    worker.port.on("requestPrivlyStart", function(message) {
      sendStartMessage(message, worker);
    });
  },
});

// Run tests if necessary.
require("./run_test.js").runTest();
