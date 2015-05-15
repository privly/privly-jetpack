/**
 * @fileOverview This file provides the XPCOM service used to 
 * gain access to the 'simple-storage' jetpack module in 'chrome'
 * code. 'simple-storage' is used by the Local storage shim.
 */

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
    }
  });
  // Register the service using the contract ID
  var service = Service({
    contract: contractID,
    Component: PrivlyXPCOMService
  });
}
exports.register = register;
