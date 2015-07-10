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
    getPreferences: function() {
      return require("sdk/preferences/service");
    },
    getPrivlyUI: function() {
      return require("./privly_ui.js");
    },
    getPostingProcess: function() {
      return require("./posting_process.js");
    },
    getFirstRun: function() {
      return require("./first_run.js");
    },
    getLocalStorageShim: function() {
      return require("./local_storage.js");
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
