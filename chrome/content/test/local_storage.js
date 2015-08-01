/**
 * @fileOverview Test suite for 
 * chrome/content/privly-applications/shared/javascripts/local_storage.js.
 * This tests the Firefox preferences service to store settings. The more general test cases can be found @
 * chrome/content/privly-applications/shared/test/local_storage.js
 *
 **/
/* global describe, it, expect, g */
describe("Local Storage Shim Suite", function() {

  // Makes it easier to set, and get preferences.
  // Adds the branch to the preference key.
  const prefs = {
    branch: "extensions.privly.",
    get: function(key, defaultValue) {
           return g.preferences.get(prefs.branch + key, defaultValue);
         },
    set: function(key, value) {
           return g.preferences.set(prefs.branch + key, value);
         },
  };

  it("checks localStorage presence", function() {
    expect(g.ls.localStorageDefined).toBe(false);
  });

  it("Sets a preference", function() {
    g.ls.setItem("test", "foobar");
    expect(prefs.get("test", undefined)).toBe("foobar");
    // cleanup
    g.ls.removeItem("test");
    expect(prefs.get("test", undefined)).toBeUndefined();
  });

  it("Gets stored preference", function() {
    prefs.set("test", "foobar");
    expect(g.ls.getItem("test")).toBe("foobar");
    // cleanup
    g.ls.removeItem("test");
    expect(prefs.get("test", undefined)).toBeUndefined();
  });

});
