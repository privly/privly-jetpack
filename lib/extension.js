/**
 * @fileOverview This file runs the code that builds or sets up the 
 * extension in the browser.
 */

var run = function() {

  // Privly Namespace
  var { Privly } = require("./privly_ns.js");

  // First run.
  require("./first_run.js").firstRun.run(Privly);

  // Display popup button in browser toolbar.
  var { popupButton } = require("./privly_ui.js");
  popupButton.setup(Privly);

  // Context Menus
  var { postingProcess } = require("./posting_process.js");
  postingProcess.menuSetup(popupButton.button, Privly);

  /**
   * Sends the start message to privly.js. 
   * Called on receipt of "requestPrivlyStart".
   *
   * @param {String} message Message
   * @param {Function} sendResponse Function used to send a response back.
   */
  function sendStartMessage(message, sendResponse) {
    if (message.name === "requestPrivlyStart") {
      var start = "no";
      if(popupButton.getButtonState() === "active") {
        start = "yes";
      }
      sendResponse({
        name: "privlyStart", 
        content: {
          "start": start,
          "whitelist": Privly.options.getWhitelistRegExp(),
        },
      });
    }
  }

  var data = require("sdk/self").data;
  // Inject content script.
  // Define PageMod.
  require("sdk/page-mod").PageMod({
    include: "*",
    contentScriptFile: [data.url(Privly.CONTEXT_MESSENGER),
                        data.url("./content_scripts/privly.js")],
    onAttach: function(worker) {
      Privly.message.currentAdapter.addWorker(worker);
      Privly.message.addListener(sendStartMessage);
    },
  });

}
exports.run = run;
