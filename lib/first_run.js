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

// Local storage shim
var { ls } = require("./local_storage.js");

/**
 * @namespace for the firstRun functionality.
 */
var firstRun = {
  /**
   * Check whether the first run html page should be opened.
   */
  runFirstRun: function() {

    // Update storage on a fresh install/upgrade
    var updateStorage = false;
    const loadReason = require("sdk/self").loadReason;
    if ( loadReason === "install" || loadReason === "upgrade" ) {
      updateStorage = true;
    }

    // Initialize the spoofing glyph
    // The generated string is not cryptographically secure and should not be used
    // for anything other than the glyph.
    if (ls.getItem("glyph_cells") === void(0) || updateStorage) {

      ls.setItem("glyph_color", Math.floor(Math.random()*16777215).toString(16));
      var glyph_cells = ((Math.random() < 0.5) ? "false" : "true");
      for(var i = 0; i < 14; i++) {
        glyph_cells += "," + ((Math.random() < 0.5) ? "false" : "true");
      }
      ls.setItem("glyph_cells", glyph_cells);
    }

    // Set the content domain
    var postingDomain = ls.getItem("posting_content_server_url");
    if (postingDomain === void(0) || postingDomain === null || updateStorage) {
      ls.setItem("posting_content_server_url", "https://privlyalpha.org");
    }

    // Set the extension version
    ls.setItem("version", require("sdk/self").version);

    // Open the first run page only on new installations.
    if ( loadReason === "install" ) {
      require("sdk/tabs").open(
        "chrome://privly/content/privly-applications/Pages/ChromeFirstRun.html");
    }
  }
};

exports.firstRun = firstRun.runFirstRun;
