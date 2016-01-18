/**
 * @fileOverview Test suite for lib/privly_ui.js
 *
 **/
/* global describe, it, expect, spyOn, g */
describe("Privly UI Suite", function() {

  var pb = g.popupButton,
      Privly = g.Privly,
      sendResponse;

  beforeEach(function() {
    sendResponse = jasmine.createSpy("sendResponse");
  });

  it("Popup button and panel are setup", function() {
    spyOn(Privly.message.currentAdapter, "addWorker").
      and.callFake(function(worker) { return; });
    spyOn(Privly.message, "addListener").
      and.callFake(function(listener) { return; });
    expect(pb.button).not.toBeDefined();
    g.uiButton = pb.setup(Privly);
    expect(Privly.message.currentAdapter.addWorker).toHaveBeenCalled();
    expect(Privly.message.addListener).toHaveBeenCalled();
    expect(pb.button).toBeDefined();
    expect(pb.panel).toBeDefined();
  });

  describe("Mock Popup button", function() {

    beforeEach(function() {
      // Fake the Jetpack button and panel objects created during setup.
      // pb.button fakes require("sdk/ui/button/toggle").ToggleButton()
      pb.button = {
        label: pb.ACTIVE.label,
        state: function(obj, states) { return; }
      };
      // pb.panel fakes require("sdk/panel").Panel()
      pb.panel = {
        show: function(params) { return; }
      };
      spyOn(pb.panel, "show");
      spyOn(pb.button, "state");
    });

    it("Gets the popup button state", function() {
      // default state - active
      expect(pb.getButtonState()).toBe("active");
      // switch state
      pb.button.label = pb.INACTIVE.label;
      expect(pb.getButtonState()).toBe("inactive");
    });

    it("Responds to popup menu item clicked", function() {
      spyOn(Privly.options, "getWhitelistRegExp").and.callFake(function() {
        return "whitelist";
      });
      spyOn(pb, "getButtonState").and.callFake(function() { return "inactive"; });
      spyOn(pb, "toggleButtonState").and.callFake(function() { return; });
      pb.openPages({name: "hyperlink", content: "toggleMode"}, sendResponse);
      expect(pb.getButtonState).toHaveBeenCalled();
      expect(pb.toggleButtonState).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith({name: "extensionMode", content: "inactive"});
    });

    describe("Toggles the Injection", function() {

      it("Deactivates Injection", function() {
        // "Active" button
        pb.button.label = pb.ACTIVE.label;
        pb.toggleButtonState();
        expect(Privly.options.isInjectionEnabled()).toBe(false);
        expect(pb.button.state).toHaveBeenCalledWith(pb.button, pb.INACTIVE);
      });

      it("Activates Injection", function() {
        // "Inactive" button
        pb.button.label = pb.INACTIVE.label;
        pb.toggleButtonState();
        expect(Privly.options.isInjectionEnabled()).toBe(true);
        expect(pb.button.state).toHaveBeenCalledWith(pb.button, pb.ACTIVE);
      });

    });

    describe("Responds to clicks on Popup button", function() {

      beforeEach(function() {
        spyOn(pb, "getButtonState").and.callFake(function() { return "active"; });
        spyOn(Privly.message, "messageContentScripts").and.callFake(function() {
          // Fake promise
          return { then: function() {} };
        });
      });

      it("Displays popup when button is checked", function() {
        // Set functions to be spied on
        pb.handleChange({checked: true});
        expect(pb.panel.show).toHaveBeenCalled();
        expect(pb.getButtonState).toHaveBeenCalled();
        expect(Privly.message.messageContentScripts).toHaveBeenCalledWith({
          name: "extensionMode",
          content: "active"
        });
      });

      it("Does not respond when button is unchecked", function() {
        pb.handleChange({checked: false});
        expect(pb.panel.show).not.toHaveBeenCalled();
        expect(Privly.message.messageContentScripts).not.toHaveBeenCalled();
      });
    });

  });

});
