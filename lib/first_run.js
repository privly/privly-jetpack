/**
 * @fileOverview This file opens a tab with the first run html doc under
 * appropriate conditions when the extension is loaded on browser launch or
 * on extension install.
 *
 * Appropriate conditions fall under two circumstances:
 * 1. LocalStorage does not have a stored value for the version of privly
 *    installed. (Privly was just installed or localStorage was cleared)
 * 2. The version stored in the manifest differs from the version stored in
 *    localStorage. (Privly was updated)
 *
 **/

// Privly Namespace
var { Privly } = require("./privly_ns.js");

/**
 * @namespace for the firstRun functionality.
 */
var firstRun = {
  /**
   * Check whether the first run html page should be opened.
   */
  runFirstRun: function() {

    const loadReason = require("sdk/self").loadReason;

    if (loadReason === "upgrade") {
      Privly.options.upgrade();
    }

    // Initialize the options on install
    if (loadReason === "install") {
      Privly.options.upgrade();
      Privly.options.setPrivlyButtonEnabled(true);
      Privly.options.setInjectionEnabled(true);
      Privly.glyph.initGlyph();
      Privly.options.setServerUrl("https://privlyalpha.org");
      require("sdk/tabs").open(
        "chrome://privly/content/privly-applications/Pages/ChromeFirstRun.html");
    }
  }
};
exports.firstRun = firstRun.runFirstRun;
