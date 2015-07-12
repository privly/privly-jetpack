/**
 * @fileOverview Test suite for lib/first_run.js
 *
 **/
/* global describe, it, expect, g */
describe("First Run Suite", function() {
  
  it("tests privly version", function() {
    // tests the stored version against the running version
    expect(g.ls.getItem("version")).toBe(g.version);
    expect(g.version).toMatch(/\d+\.\d+\.\d+/);
  });
  
  it("tests first run", function() {
    expect(g.loadReason).toBe("install");
    expect(g.ls.getItem("glyph_cells")).toBeDefined();
    expect(g.ls.getItem("glyph_color")).toBeDefined();
    expect(g.ls.getItem("posting_content_server_url")).toBeDefined();
  });
  
});
