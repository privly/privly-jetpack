/**
 * @fileOverview This file provides the XPCOM service used to 
 * gain access to Jetpack APIs in 'chrome' code. For eg:-
 * simple-storage is needed for the Local Storage Shim.
 */

/* globals exports */

const { Class } = require("sdk/core/heritage");
const { Unknown, Service } = require("sdk/platform/xpcom");

/**
 * @namespace registers the XPCOM service
 */
var register = function() {

  const contractID = "@privly/jetpack;1";

  // Service
  var PrivlyXPCOMService = Class({
    extends: Unknown,
    get wrappedJSObject() this,
    getSimpleStorage: function() {
      return require("sdk/simple-storage");
    },
  });

  // Register the service using the contract ID
  var service = Service({
    contract: contractID,
    Component: PrivlyXPCOMService,
  });
}
exports.register = register;

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
    getSimpleStorage: function() {
      return require("sdk/simple-storage");
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
