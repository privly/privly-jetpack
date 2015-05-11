/**
 * @fileOverview This file provides the XPCOM service used to 
 * gain access to the 'simple-storage' jetpack module in 'chrome'
 * code. 'simple-storage' is used by the Local storage shim.
 */

/**
 * @namespace registers the XPCOM service
 */
var register = function() {

  const { Class } = require("sdk/core/heritage");
  const { Unknown, Service } = require("sdk/platform/xpcom");
  const contractID = "@privly/storage;1";

  // Service
  var PrivlyStorage = Class({
    extends: Unknown,
    get wrappedJSObject() this,
    getSimpleStorage: function() {
      return require("sdk/simple-storage");
    }
  });

  // Register the service using the contract ID
  var service = Service({
    contract: contractID,
    Component: PrivlyStorage
  });
}

exports.register = register;
