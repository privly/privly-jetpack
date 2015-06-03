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
const preferences = PrivlyXPCOM.getPreferences();
const { version, loadReason } = PrivlyXPCOM.getSelfObject();
const tabs = PrivlyXPCOM.getTabs();
const windows = PrivlyXPCOM.getWindows();
var { popupButton } = PrivlyXPCOM.getPrivlyUI();

// Console access to Terminal Reporter.
this.console = Components.utils.
                 import("resource://gre/modules/devtools/Console.jsm", {}).
                 console;
/**
 * Helper function to check for a given page among the open browser tabs.
 *
 * @param {string} pageUrl Page URL to look for.
 * @param {boolean} closePage Close the page/tab if found.
 *
 * @returns {boolean} Boolean value indicating if the page was found or not.
 */
function isPageOpen(pageUrl, closePage) {
  var len = tabs.length;
  for (var i = 0; i < len; i++) {
    if (tabs[i].url === pageUrl) {
      if (closePage) {
        tabs[i].close();
      }
      return true;
    }
  }
  return false;
}

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
    setTimeout(function() {
      windows.browserWindows.activeWindow.close();
    }, 2000);
  };
  jasmineEnv.addReporter(terminalReporter);
})();

/**
 *
 * Extension Tests
 *
 **/

describe("First Run Suite", function() {
  
  it("tests privly version", function() {
    // tests the stored version against the running version
    expect(ls.getItem("version")).toBe(version);
    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });
  
  it("tests opening first run tab", function() {
    expect(loadReason).toBe("install");
    expect(isPageOpen("chrome://privly/content/privly-applications/Pages/ChromeFirstRun.html", true)).toBe(true);  
  });
    
});

describe("Local Storage Shim Suite", function() {

  // Makes it easier to set, and get preferences.
  // Adds the branch to the preference key.
  const prefs = {
    branch: "extensions.privly.",
    get: function(key, defaultValue) {
           return preferences.get(prefs.branch + key, defaultValue);
         },
    set: function(key, value) {
           return preferences.set(prefs.branch + key, value);
         },
  };

  it("tests preferences presence", function() {
    expect(ls.localStorageDefined).toBe(false);
  });

  it("tests ls.setItem, ls.removeItem", function() {
    ls.setItem("test", "foobar");
    expect(prefs.get("test", undefined)).toBe("foobar");
    // cleanup
    ls.removeItem("test");
    expect(prefs.get("test", undefined)).toBeUndefined();
  });

  it("tests ls.getItem, ls.removeItem", function() {
    prefs.set("test", "foobar");
    expect(ls.getItem("test")).toBe("foobar");
    // cleanup
    ls.removeItem("test");
    expect(prefs.get("test", undefined)).toBeUndefined();
  });

});

describe("Privly UI Suite", function() {

  var pb = popupButton;

  it("tests setup", function() {
    expect(pb.button).toBeDefined();
    expect(pb.panel).toBeDefined();
  });

  // Fake the Jetpack button and panel objects created during setup.
  // pb.button fakes require("sdk/ui/button/toggle").ToggleButton()
  pb.button = {
    label: pb.ACTIVE.label,
    state: function(obj, states) { return; },
  };
  // pb.panel fakes require("sdk/panel").Panel()
  pb.panel = {
    port: {
      emit: function(message_id, messsage) { return; },
      on: function(message, callback) { return; },
    },
    show: function(params) { return; },
  };

  it("tests getButtonState", function() {
    // default state - active
    expect(pb.getButtonState()).toBe("active");
    // switch state
    pb.button.label = pb.INACTIVE.label;
    expect(pb.getButtonState()).toBe("inactive");
  });
 
  it("tests toggleButtonState", function() {
    spyOn(pb.button, "state");
    // "Active" button
    pb.button.label = pb.ACTIVE.label;
    pb.toggleButtonState();  
    expect(pb.button.state).toHaveBeenCalled();
    expect(pb.button.state).toHaveBeenCalledWith(pb.button, pb.INACTIVE);
    // "Inactive" button
    pb.button.label = pb.INACTIVE.label;
    pb.toggleButtonState();
    expect(pb.button.state).toHaveBeenCalledWith(pb.button, pb.ACTIVE);
  });
  
  it("tests handleChange", function() {
    // Set functions to be spied on
    spyOn(pb.panel, "show");
    spyOn(pb.panel.port, "emit");
    
    pb.handleChange({checked: false});
    expect(pb.panel.show).not.toHaveBeenCalled();
    expect(pb.panel.port.emit).not.toHaveBeenCalled();
    // Call handleChange with different button state
    pb.handleChange({checked: true});
    expect(pb.panel.show).toHaveBeenCalled();
    expect(pb.panel.port.emit).toHaveBeenCalled(); 
  }); 

  describe("Tests opening of pages", function() {
    // Async tests
    beforeEach(function(done) {
      pb.openPages("history");
      pb.openPages("options");  
      pb.openPages("message");
      pb.openPages("help");
      // Wait for pages to load
      setTimeout(function() {
        done();
      }, 3000);
    });
    
    it("checks for loaded pages", function(done) {
      expect(isPageOpen("chrome://privly/content/privly-applications/History/new.html", true)).toBe(true);
      expect(isPageOpen("chrome://privly/content/privly-applications/Pages/ChromeOptions.html", true)).toBe(true);
      expect(isPageOpen("chrome://privly/content/privly-applications/Message/new.html", true)).toBe(true);
      expect(isPageOpen("chrome://privly/content/privly-applications/Help/new.html", true)).toBe(true);
      done();
    });
  });
});
