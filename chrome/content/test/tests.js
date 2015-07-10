/**
 * @fileOverview tests.js Gives testing code for the Firefox Extension.
 * It uses the Jasmine JS testing library.
 **/

/* global describe, it, expect, jasmine, Components, g */

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
      g.windows.browserWindows.activeWindow.close();
    }, 500);
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

describe("Privly UI Suite", function() {

  var pb = g.popupButton;

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
      emit: function(message_id, message) { return; },
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

});
