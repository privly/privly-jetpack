/**
 * @fileOverview Provides global object (g) accessible in the unit tests.
 **/
// XPCOM object defined in lib/xpcom.js
const PrivlyXPCOM = Components.classes["@privly.test/jetpack;1"].
                      getService(Components.interfaces.nsISupports).
                      wrappedJSObject;
// Global object
// Provides access to Jetpack API's and Add-on code CommonJS modules for unit testing.
this.g = {

  // Local Storage Shim
  ls: PrivlyXPCOM.getLocalStorageShim().ls,

  // Jetpack Preferences service object
  preferences: PrivlyXPCOM.getPreferences(),
  
  // Extension version
  version: PrivlyXPCOM.getSelfObject().version,
 
  // Extension load reason - install, upgrade, downgrade, update.
  loadReason: PrivlyXPCOM.getSelfObject().loadReason,

  // Jetpack tabs object
  tabs: PrivlyXPCOM.getTabs(),

  // Jetpack windows object
  windows: PrivlyXPCOM.getWindows(),

  // Privly Toolbar button object
  popupButton: PrivlyXPCOM.getPrivlyUI().popupButton,
};

// Console access to Terminal Reporter.
this.console = Components.utils.
                 import("resource://gre/modules/devtools/Console.jsm", {}).
                 console;
