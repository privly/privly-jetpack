/**
 * @fileOverview Test suite for lib/first_run.js
 *
 **/
/* global describe, it, expect, g */
describe("First Run Suite", function() {

  var Privly = g.Privly;
  
  it("Stores initial config settings/preferences", function() {
    g.firstRun.run(Privly);
    expect(g.loadReason).toBe("install");
    expect(Privly.storage.get("Options:DissableButton")).toBe(null);
    expect(Privly.storage.get("user_whitelist_csv")).toBe(null);
    expect(Privly.storage.get("user_whitelist_json")).toBe(null);
    expect(Privly.storage.get("posting_content_server_url")).toBe(null);
    expect(Privly.storage.get("glyph_cells")).toBe(null);
    expect(Privly.storage.get("glyph_color")).toBe(null);
    expect(Privly.options.isPrivlyButtonEnabled()).toBe(true);
    expect(Privly.options.isInjectionEnabled()).toBe(true);
    expect(Privly.options.getServerUrl()).toBe("https://privlyalpha.org");
    expect(Privly.options.getGlyph()).not.toBe(null);
  });

});
