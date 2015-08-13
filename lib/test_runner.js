/**
 * @fileOverview This file determines if extension tests are to be run,
 * and if so, loads the necessary tests and xpcom services required by 
 * the tests.
 *
 * Tests are run by the following command --
 * bash run_test.sh 
 * Or ./run_test.sh
 **/

/**
 * @namespace for the running/loading the tests.
 */
var testRunner = {

  /*
   * Checks whether extension unit tests need to be run.
   */ 
  isTesting: function() {
    var privlyTest = require("sdk/preferences/service").get("extensions.privly.test");
    if (privlyTest === "true") {
      return true;
    } 
    return false;
  },

  /*
   * Runs the extension unit tests.
   */  
  run: function() {
    // register xpcom services required for testing
    require("./xpcom.js").registerTest();
    // the page that loads the js test files.
    const TESTPAGE = "chrome://privly/content/test/test_loader.html";
    // open test loader
    require("sdk/tabs").open(TESTPAGE);
  }

};
exports.testRunner = testRunner;
