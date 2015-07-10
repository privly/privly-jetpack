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
      var windows = g.windows.browserWindows;
      for (var i=0; i<windows.length; i++) {
        windows[i].close();
      }
    }, 1000);
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

describe("Posting Process Suite", function() {

  var pp = g.postingProcess;

  pp.errorNotification = {
    show: function() { return; },
    hide: function() { return; },
  };

  pp.pendingNotification = {
    show: function() { return; },
    hide: function() { return; },
  };
  
  var worker =  {
    port: {
      emit: function(message_id, message) { return; },
      on: function(message_id, callback) { return; },
    },
    destroy: function() { return; },
  };

  beforeEach(function() {
    pp.postingApplicationTab = {
      close: function() { return; },
    };
    pp.postingResultTab = {
      close: function() { return; },
      activate: function() { return; },
      attach: function() { return worker; },
    };
  });

  it("tests menuSetup", function() {
    expect(pp.pendingNotification).toBeDefined();
    expect(pp.errorNotification).toBeDefined();
  });
    
  it("tests notificationScript", function() {
    expect(pp.notificationScript("foobar")).toMatch(/foobar/);
    expect(pp.notificationScript("error")).toMatch(/error/);
  });

  it("tests hideNotification", function() {
    spyOn(pp.errorNotification, "hide");
    pp.hideNotification("error");
    expect(pp.errorNotification.hide).toHaveBeenCalled();
    spyOn(pp.pendingNotification, "hide");
    pp.hideNotification("pendingPost");
    expect(pp.pendingNotification.hide).toHaveBeenCalled();
  });

  it("tests sendBtnStatus", function() {
    spyOn(worker.port, "emit");
    // Default option is false
    expect(g.ls.getItem("Options:DissableButton")).toBe(false);
    pp.sendBtnStatus("foobar", worker);
    expect(worker.port.emit).toHaveBeenCalled();
    // Switch to another option
    g.ls.setItem("Options:DissableButton", true);
    pp.sendBtnStatus("foobar", worker);
    expect(worker.port.emit).toHaveBeenCalled();
    expect(worker.port.emit.calls.argsFor(0)).toEqual(["privlyBtnStatus", "unchecked"]);
    expect(worker.port.emit.calls.argsFor(1)).toEqual(["privlyBtnStatus", "checked"]);
  });

  it("tests saveSecret", function() {
    pp.saveSecret("foobar");
    expect(pp.messageSecret).toBe("foobar");
  });
 
  it("tests sendInitialContent", function() {
    spyOn(worker.port, "emit");
    pp.messageSecret = "foo";
    pp.postingApplicationStartingValue = "bar";
    pp.sendInitialContent("foobar", worker);
    expect(worker.port.emit).toHaveBeenCalled();
    expect(worker.port.emit.calls.argsFor(0)).
      toEqual(["initialContent", {secret: "foo", initialContent: "bar"}]);
    pp.messageSecret = "bar";
    pp.sendInitialContent("foobar", worker);
    expect(worker.port.emit).toHaveBeenCalled();
    expect(worker.port.emit.calls.argsFor(1)).not.
      toEqual(["initialContent", {secret: "foo", initialContent: "bar"}]);
    expect(worker.port.emit.calls.argsFor(1)).
      toEqual(["initialContent", {secret: "bar", initialContent: "bar"}]);
  });

  it("tests destroyWorker", function() {
    spyOn(worker, "destroy");
    pp.destroyWorker("foobar", worker);
    expect(worker.destroy).toHaveBeenCalled();
  });

  it("tests postStatusHandler", function() {
    spyOn(pp.errorNotification, "show");
    flag = 0;
    spyOn(pp.postingApplicationTab, "close").and.callFake(function() {
      flag = 1;
      return;
    });
    expect(pp.postingApplicationTab).toBeDefined();
    expect(flag).toBe(0);
    pp.postStatusHandler("success");
    expect(flag).toBe(1);
    expect(pp.postingApplicationTab).toBe(null);
    pp.postStatusHandler("failure");
    expect(pp.errorNotification.show).toHaveBeenCalled();
  });

  it("tests receivePrivlyURL(1)", function() {
    var privlyURL = "https://privly.url";
    spyOn(worker.port, "emit");
    pp.iframe = true;
    pp.pageURL = "https://page.url";
    pp.targetNodeId = "fakenode";
    pp.workers = [worker];
    pp.pendingPost = true;
    pp.receivePrivlyURL(privlyURL);
    expect(worker.port.emit).toHaveBeenCalled();
    expect(worker.port.emit.calls.argsFor(0)).
      toEqual(["postURL", {privlyURL: privlyURL, nodeId: "fakenode", pageURL: "https://page.url"}]);
    expect(pp.pendingPost).toBe(false);
  });

  it("tests receivePrivlyURL(2)", function() {
    var flag1 = 0;
    var flag2 = 0;
    spyOn(pp.postingResultTab, "activate").and.callFake(function() {
      flag1 = 1;
      return;
    });
    spyOn(pp.postingResultTab, "attach").and.callFake(function() {
      flag2 = 1;
      return worker;
    });
    pp.iframe = false;
    pp.pendingPost = true;
    expect(flag1).toBe(0);
    expect(flag2).toBe(0);
    pp.receivePrivlyURL("https://privly.url");
    expect(flag1).toBe(1);
    expect(flag2).toBe(1);
    expect(pp.pendingPost).toBe(false);
  });

  it("tests postingHandler", function() {
    spyOn(pp.pendingNotification, "show");
    var info =  {
      pageURL: "chrome://privly/content/test/test_loader.html",
      text: "Hello",
      nodeId: "fakenode",
    };
    pp.pendingPost = true;
    pp.postingHandler(info);
    expect(pp.pendingNotification.show).toHaveBeenCalled();
    pp.pendingPost = false;
    pp.postingHandler(info);
    expect(pp.iframe).toBe(false);
    expect(pp.pendingPost).toBe(true);
    expect(pp.targetNodeId).toBe("fakenode");
  });

  it("tests tabClosed", function() {
    spyOn(pp.postingApplicationTab, "close");
    pp.pendingPost = true;
    pp.tabClosed({}, "resultTab");
    expect(pp.postingApplicationTab).toBe(null);
    expect(pp.postingResultTab).toBe(null);
    expect(pp.pendingPost).toBe(false);
    pp.pendingPost = true;
    pp.tabClosed({}, "postingApplication");
    expect(pp.pendingPost).toBe(true);
  });
});
