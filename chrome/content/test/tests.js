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
    for (i = 0; i < len; i++) {
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

  it("tests ls.setItem", function() {
    ls.setItem("test", "foobar");
    expect(storage.test).toBe("foobar");
  });

  it("tests ls.getItem", function() {
    storage["test2"] = "foobar2";
    expect(ls.getItem("test2")).toBe("foobar2");
  });

  it("tests ls.removeItem", function() {
    storage["test3"] = "foobar3";
    expect(ls.getItem("test3")).toBe("foobar3");
    ls.removeItem("test3");
    expect(storage["test3"]).toBeUndefined();
    expect(ls.getItem("test3")).toBeUndefined();
  });

});

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 2500;
  var consoleReporter = new jasmine.ConsoleReporter();
  jasmineEnv.addReporter(consoleReporter);
  jasmineEnv.execute();
})();
