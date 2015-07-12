/**
 * @fileOverview Test suite for 
 * chrome/content/privly-applications/shared/javascripts/local_storage.js
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

  it("tests preferences presence", function() {
    expect(g.ls.localStorageDefined).toBe(false);
  });

  it("tests ls.setItem, ls.removeItem", function() {
    g.ls.setItem("test", "foobar");
    expect(prefs.get("test", undefined)).toBe("foobar");
    // cleanup
    g.ls.removeItem("test");
    expect(prefs.get("test", undefined)).toBeUndefined();
  });

  it("tests ls.getItem, ls.removeItem", function() {
    prefs.set("test", "foobar");
    expect(g.ls.getItem("test")).toBe("foobar");
    // cleanup
    g.ls.removeItem("test");
    expect(prefs.get("test", undefined)).toBeUndefined();
  });

});
