/**
 * @fileOverview Provides global object (g) accessible in the unit tests.
 *
 **/
// XPCOM object defined in lib/xpcom.js
const PrivlyXPCOM = Components.classes["@privly.test/jetpack;1"].
                      getService(Components.interfaces.nsISupports).
                      wrappedJSObject;

// Global object
// Provides access to Jetpack API's and Add-on code CommonJS modules for unit testing.
this.g = {

  /**
   * First run
   */
  firstRun: PrivlyXPCOM.getFirstRun().firstRun,

  /**
   * Extension load reason - install, upgrade, downgrade, update.
   */
  loadReason: PrivlyXPCOM.getSelfObject().loadReason,

  /**
   * Jetpack tabs object
   */
  tabs: PrivlyXPCOM.getTabs(),

  /**
   * Jetpack windows object
   */
  windows: PrivlyXPCOM.getWindows(),

  /**
   * Privly UI Popup Button
   */
  popupButton: PrivlyXPCOM.getPrivlyUI().popupButton,

  /**
   * Privly Posting Process
   */
  postingProcess: PrivlyXPCOM.getPostingProcess().postingProcess,

  /**
   * Privly Namespace - provides options interface and context messenger
   */
  Privly: PrivlyXPCOM.getPrivlyNamespace().Privly,

  /**
   * Closes the browser.
   */
  closeBrowser: function() {
    // Comment the setTimeout if you don't want to close
    // the browser on tests completion.
    setTimeout(function() {
      var windows = g.windows.browserWindows;
      for (var i=0; i<windows.length; i++) {
        windows[i].close();
      }
    }, 2000);
  },

  /**
   * Collects the coverage info from every tested module and sends it to
   * a nodejs server. The server then uses the coverage info to generate the
   * reports, which is then sent to Coveralls.io.
   */
  reportCoverage: function() {
    // Coverage container
    window.__coverage__ = {};
    // Collect coverage info from every file
    for (var property in g) {
      if (g.hasOwnProperty(property)) {
        var info;
        try {
          info = g[property].coverage();
        } catch (ignore) {}
          if (typeof info !== "undefined") {
            window.__coverage__[info.path] = info;
        }
      }
    }
    // Send coverage info to NodeJS server
    $.ajax({
      url: "http://127.0.0.1:1337/",
      type: 'POST',
      crossOrigin: true,
      data: JSON.stringify(window.__coverage__),
      success: function (data, textStatus, jqXHR) {
        g.closeBrowser();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        g.closeBrowser();
      }
    });
  }
};

// Console access to Terminal Reporter.
this.console = Components.utils.
                 import("resource://gre/modules/devtools/Console.jsm", {}).
                 console;
