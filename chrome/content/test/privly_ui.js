/**
 * @fileOverview Test suite for lib/privly_ui.js
 *
 **/
/* global describe, it, expect, spyOn, g */
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

  it("tests openPages", function() {
    spyOn(pb, "toggleButtonState").and.callFake(function() { return; });
    spyOn(pb.panel.port, "emit").and.callFake(function(message_id, message) { return; });
    spyOn(pb, "getButtonState").and.callFake(function() { return "active"; });
    pb.openPages("toggleMode");
    expect(pb.toggleButtonState).toHaveBeenCalled();
    expect(pb.panel.port.emit).toHaveBeenCalled();
    expect(pb.panel.port.emit.calls.argsFor(0)).toEqual(["extensionMode", "active"]);
  });
 
  it("tests toggleButtonState", function() {
    spyOn(pb.button, "state");
    // "Active" button
    pb.button.label = pb.ACTIVE.label;
    pb.toggleButtonState();  
    expect(pb.button.state).toHaveBeenCalled();
    // "Inactive" button
    pb.button.label = pb.INACTIVE.label;
    pb.toggleButtonState();
    expect(pb.button.state).toHaveBeenCalled();
    expect(pb.button.state.calls.argsFor(0)).toEqual([pb.button, pb.INACTIVE]);
    expect(pb.button.state.calls.argsFor(1)).toEqual([pb.button, pb.ACTIVE]);
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
