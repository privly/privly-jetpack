/**
 * @fileOverview This file determines if extension tests are to be run,
 * and if so, loads the necessary tests and xpcom services required by 
 * the tests.
 *
 * Tests are run by the following command --
 * jpm -b /path/to/firefox/binary/ --prefs test.json run
 **/

/**
 * @namespace for the running/loading the tests.
 */
var runTest = {
  /*
   * Checks whether extension tests need to be run.
   */  
  run: function() {

    var isTesting = require("sdk/preferences/service").get("extensions.privly.test");
    
    if (isTesting === "true") {

      // register xpcom services required for testing
      require("./xpcom.js").registerTest();

      // the page that loads the js test files.
      const TESTPAGE = "chrome://privly/content/test/test_loader.html";
      // open test loader
      require("sdk/tabs").open(TESTPAGE);
    }
  },
};
exports.runTest = runTest.run
