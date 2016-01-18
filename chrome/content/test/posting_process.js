/**
 * @fileOverview Test suite for lib/posting_process.js
 *
 **/
/* global describe, it, expect, spyOn, g */
describe("Posting Process Suite", function() {

  var pp = g.postingProcess,
      Privly = g.Privly,
      sendResponse;

  beforeEach(function() {
    pp.postingApplicationTab = {
      close: function() { return; }
    };
    pp.postingResultTab = {
      close: function() { return; },
      activate: function() { return; },
      attach: function() { return worker; }
    };
    sendResponse = jasmine.createSpy("sendResponse");
  });

  it("Context Menu and Notification panels are setup", function() {

    spyOn(Privly.message, "addListener").and.callFake(function() { return; });
    spyOn(Privly.message.currentAdapter, "addWorker").
      and.callFake(function() { return; });
    spyOn(pp, "notificationScript");

    pp.menuSetup(g.uiButton, Privly);

    expect(pp.notificationScript.calls.count()).toBe(2);
    expect(Privly.message.addListener).toHaveBeenCalled();
    expect(Privly.message.currentAdapter.addWorker).toHaveBeenCalled();
    expect(pp.pendingNotification).toBeDefined();
    expect(pp.errorNotification).toBeDefined();

  });

  it("Notification script should include type", function() {

    expect(pp.notificationScript("foobar")).toMatch(/foobar/);
    expect(pp.notificationScript("error")).toMatch(/error/);

  });

  it("Hides the Notification panel", function() {

    spyOn(pp.errorNotification, "hide").and.callFake(function() { return; });
    pp.hideNotification({name: "notificationClick", content: "error"});
    expect(pp.errorNotification.hide).toHaveBeenCalled();

    spyOn(pp.pendingNotification, "hide").and.callFake(function() { return; });
    pp.hideNotification({name: "notificationClick", content: "pendingPost"});
    expect(pp.pendingNotification.hide).toHaveBeenCalled();

  });

  describe("Sends privly button status to content script -", function() {

    it("Privly button is enabled", function() {
      // Privly button should be enabled by default
      expect(Privly.options.isPrivlyButtonEnabled()).toBe(true);
      pp.sendBtnStatus({name: "requestBtnStatus", content: "foobar"}, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith({name: "privlyBtnStatus", content: "unchecked"});
    });

    it("Privly button is disabled", function() {
      // Disable privly button
      Privly.options.setPrivlyButtonEnabled(false);
      pp.sendBtnStatus({name: "requestBtnStatus", content: "foobar"}, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith({name: "privlyBtnStatus", content: "checked"});
    });

  });

  it("Sends initial content to content script", function() {
    pp.postingApplicationStartingValue = "bar";
    pp.sendInitialContent({name: "requestInitialContent", content: "foobar"}, sendResponse);
    expect(sendResponse).toHaveBeenCalledWith({name: "initialContent", content: {initialContent: "bar"}});
  });

  describe("Responds to post status -", function() {

    it("Closes privly app window on successful post", function() {
      spyOn(pp, "endPostingProcess");
      spyOn(pp.postingApplicationTab, "close");
      expect(pp.postingApplicationTab).toBeDefined();
      pp.postStatusHandler({name: "postStatus", content: "success"}, sendResponse);
      expect(pp.postingApplicationTab.close).toHaveBeenCalled();
      expect(pp.endPostingProcess).toHaveBeenCalled();
    });

    it("Displays error on failed post", function() {
      spyOn(pp.errorNotification, "show").and.callFake(function() { return; });
      spyOn(pp, "endPostingProcess");
      spyOn(pp.postingApplicationTab, "close");
      pp.postStatusHandler({name: "postStatus", content: "failure"}, sendResponse);
      expect(pp.errorNotification.show).toHaveBeenCalled();
      expect(pp.endPostingProcess).toHaveBeenCalled();
      expect(pp.postingApplicationTab.close).not.toHaveBeenCalled();
    });

  });

  it("Sends privly URL to the host page", function() {
    spyOn(pp.postingResultTab, "activate");
    spyOn(Privly.message, "messageContentScripts").and.callFake(function() {
      // Fake Promise
      return { then: function() {} };
    });
    var privlyURL = "https://privly.url";
    pp.pageURL = "https://page.url";
    pp.targetNodeId = "fakenode";
    pp.pendingPost = true;
    pp.receivePrivlyURL({name: "setPrivlyURL", content: privlyURL}, sendResponse);
    expect(pp.postingResultTab.activate).toHaveBeenCalled();
    expect(Privly.message.messageContentScripts).toHaveBeenCalledWith({
      name: "postURL",
      content: {privlyURL: privlyURL, nodeId: "fakenode", pageURL: "https://page.url"}
    }, true);
  });

  describe("Starts the posting process on request -", function() {

    var info;

    beforeEach(function() {
      info =  {
        nodeId: "fakenode",
        pageURL: "chrome://privly/content/test/test_loader.html",
        text: "Hello"
      };
    });

    it("Sets the posting variables", function() {
      pp.pendingPost = false;
      pp.postingHandler({name: "startPostingProcess", content: info}, sendResponse);
      expect(pp.pendingPost).toBe(true);
      expect(pp.pageURL).toBe(info.pageURL);
      expect(pp.postingApplicationStartingValue).toBe("Hello");
      expect(pp.targetNodeId).toBe("fakenode");
    });

    it("Displays a Notification if there's an already pending post", function() {
      spyOn(pp.pendingNotification, "show").and.callFake(function() { return; });
      pp.pendingPost = true;
      pp.postingHandler({name: "startPostingProcess", content: info}, sendResponse);
      expect(pp.pendingNotification.show).toHaveBeenCalled();
    });

  });

  describe("Cancels the posting process on tab closure -", function() {

    beforeEach(function() {
      spyOn(pp.postingApplicationTab, "close");
      spyOn(pp, "endPostingProcess");
    });

    it("Posting Result tab is closed", function() {
      pp.tabClosed({}, "resultTab");
      expect(pp.postingApplicationTab.close).toHaveBeenCalled();
      expect(pp.endPostingProcess).toHaveBeenCalled();
    });

    it("Posting Application tab is closed", function() {
      pp.tabClosed({}, "postingApplication");
      expect(pp.postingApplicationTab.close).not.toHaveBeenCalled();
      expect(pp.endPostingProcess).toHaveBeenCalled();
    });

    it("One of the tabs is already closed", function() {
      pp.postingResultTab = null;
      pp.tabClosed({}, "resultTab");
      expect(pp.postingApplicationTab.close).not.toHaveBeenCalled();
      expect(pp.endPostingProcess).not.toHaveBeenCalled();
    });

  });

  it("Clears posting process states/variables", function() {
    pp.pendingPost = true;
    pp.endPostingProcess();
    expect(pp.pendingPost).toBe(false);
    expect(pp.postingResultTab).toBe(null);
    expect(pp.postingApplicationTab).toBe(null);
    expect(pp.postingApplicationStartingValue).toBe("");
  });

});
