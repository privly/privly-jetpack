/**
 * @fileOverview tests.js Gives testing code for the Firefox Extension.
 * It uses the Jasmine JS testing library.
 **/

/* global describe, it, expect, jasmine, Components */

// Access to Jetpack API's and Add-on code CommonJS modules.
const PrivlyXPCOM = Components.classes["@privly.test/jetpack;1"].
                      getService(Components.interfaces.nsISupports).
                      wrappedJSObject;
const { ls } = PrivlyXPCOM.getLocalStorageShim();
const { storage } = PrivlyXPCOM.getSimpleStorage();
const { version, loadReason } = PrivlyXPCOM.getSelfObject();
const tabs = PrivlyXPCOM.getTabs();
const windows = PrivlyXPCOM.getWindows();
// Console access to Terminal Reporter
this.console = Components.utils.
                 import("resource://gre/modules/devtools/Console.jsm", {}).
                 console;

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 2500;
  var terminalReporter = new jasmineReporters.TerminalReporter({
                               verbosity: 3,
                               color: "green",
                             });
  var old_callback = terminalReporter.jasmineDone;
  terminalReporter.jasmineDone = function() {
    old_callback();
    // Close the browser on completing tests.
    windows.browserWindows.activeWindow.close();
  };
  jasmineEnv.addReporter(terminalReporter);
})();

/**
 * Extension Tests
 */
describe("First Run Suite", function() {
  
  it("tests privly version", function() {
    // tests the stored version against the running version
    expect(ls.getItem("version")).toBe(version);
    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });
  
  it("tests opening first run tab", function() {
    expect(loadReason).toBe("install");
    var flag = false;
    var len = tabs.length;
    for (var i = 0; i < len; i++) {
      if (tabs[i].url === "chrome://privly/content/privly-applications/Pages/ChromeFirstRun.html") {
        flag = true;
      }
    }
    expect(flag).toBe(true);
  });
    
});

describe("Local Storage Shim Suite", function() {

  it("tests simple-storage presence", function() {
    expect(ls.localStorageDefined).toBe(false);
  });

  it("tests ls.setItem, ls.removeItem", function() {
    ls.setItem("test", "foobar");
    expect(storage.test).toBe("foobar");
    // cleanup
    ls.removeItem("test");
    expect(storage.test).toBeUndefined();
  });

  it("tests ls.getItem, ls.removeItem", function() {
    storage["test"] = "foobar";
    expect(ls.getItem("test")).toBe("foobar");
    // cleanup
    ls.removeItem("test");
    expect(storage.test).toBeUndefined();
  });

});
