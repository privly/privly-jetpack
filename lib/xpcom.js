/**
 * @fileOverview This file provides the XPCOM service used to 
 * gain access to Jetpack APIs in 'chrome' code.
 */

/* globals exports */

const { Class } = require("sdk/core/heritage");
const { Unknown, Service } = require("sdk/platform/xpcom");

/**
 * @namespace registers the XPCOM services required for     
 * testing.
 */ 
var registerTest = function() {

  const contractID = "@privly.test/jetpack;1";

  // Service
  var PrivlyTestXPCOMService = Class({
    extends: Unknown,
    get wrappedJSObject() this,
    getPrivlyUI: function() {
      return require("./privly_ui.in.js");
    },
    getPostingProcess: function() {
      return require("./posting_process.in.js");
    },
    getPrivlyNamespace: function() {
      return require("./privly_ns.js");
    },
    getFirstRun: function() {
      return require("./first_run.in.js");
    },
    getSelfObject: function() {
      return require("sdk/self");
    },
    getTabs: function() {
      return require("sdk/tabs");
    },
    getWindows: function() {
      return require("sdk/windows");
    },
  });

  // Register the service using the contract ID
  var service = Service({
    contract: contractID,
    Component: PrivlyTestXPCOMService
  });
}
exports.registerTest = registerTest;
