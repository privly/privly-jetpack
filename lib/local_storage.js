/**
 * @fileOverview This file provides a shim to support cross browser Local Storage.
 * This shim mimics the localStorage API, but it will use alternate
 * storage mechanisms if localStorage is not available.
 * In Firefox extensions, this shim provides access to the 'simple-storage' module.
 */

var { ls } = require("../chrome/content/privly-applications/shared/javascripts/local_storage.js");

ls.localStorageDefined = false;
ls.simpleStorage = require("sdk/simple-storage").storage;

exports.ls = ls;
