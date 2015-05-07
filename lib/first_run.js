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
   * Get version stored in the manifest
   */
  getPrivlyVersion: function() {
    return require("sdk/self").version;
  },

  /**
   * Get version stored in localStorage
   */
  getStoredVersion: function() {
    var stored_version = ls.getItem("version");
    return stored_version;
  },

  /**
   * Update localStorage version
   */
  updateVersion: function(version) {
    ls.setItem("version", version);
  },

  /**
   * Check whether the first run html page should be opened.
   */
  runFirstRun: function() {

    // Initialize the spoofing glyph
    // The generated string is not cryptographically secure and should not be used
    // for anything other than the glyph.
    if (ls.getItem("glyph_cells") === void(0)) {

      // Dissable the posting button by default if the user already has
      // the extension installed.
      if ( ls.getItem("posting_content_server_url") !== void(0) ) {
        ls.setItem("Options:DissableButton", "true");
      }

      ls.setItem("glyph_color", Math.floor(Math.random()*16777215).toString(16));
      var glyph_cells = ((Math.random() < 0.5) ? "false" : "true");
      for(var i = 0; i < 14; i++) {
        glyph_cells += "," + ((Math.random() < 0.5) ? "false" : "true");
      }
      ls.setItem("glyph_cells", glyph_cells);
    }

    var runningVersion = firstRun.getPrivlyVersion();
    var lastRunVersion = firstRun.getStoredVersion();

    if (lastRunVersion === null || runningVersion !== lastRunVersion ) {
      firstRun.firstRun();
      firstRun.updateVersion(runningVersion);
    }
  },

  /**
   * Open a window with the local first_run.html and ensures the localStorage
   * variables are assigned.
   */
  firstRun: function() {

    var postingDomain = ls.getItem("posting_content_server_url");
    if (postingDomain === void(0) || postingDomain === null) {
      ls.setItem("posting_content_server_url", "https://privlyalpha.org");
    }

    // Open the first run page only on new installations.
    if ( firstRun.getStoredVersion() === void(0) ) {
      require("sdk/tabs").open(
        "chrome://privly/content/privly-applications/Pages/ChromeFirstRun.html");
    }
  }
};

exports.firstRun = firstRun.runFirstRun;