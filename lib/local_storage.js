/**
 * @fileOverview This file provides a shim to support cross browser Local Storage. This
 *               shim mimics the localStorage API, but it will use alternate
 *               storage mechanisms if localStorage is not available.
 *               In Firefox extensions, this shim provides access to the "preferences" system. 
 *               This enables the extension to get and set system-wide settings in Firefox.
 */

var { ls } = require("../chrome/content/privly-applications/shared/javascripts/local_storage.js");
const { Cc, Ci } = require("chrome");

ls.localStorageDefined = false;
ls.preferences = Cc["@mozilla.org/preferences-service;1"].
                   getService(Ci.nsIPrefService).
                   getBranch("extensions.privly.");

exports.ls = ls;
