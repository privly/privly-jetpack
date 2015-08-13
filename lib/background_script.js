/**
 * @fileOverview This file is the add-on's entry point that's executed 
 *               when the add-on needs to initialize itself: 
 *               for example, when Firefox starts, or when the add-on's 
 *               installed, enabled, or upgraded. 
 *               
 *               The add-on entry point can be set to a different file 
 *               using the main field in package.json.
 *
 **/
var { testRunner } = require("./test_runner.js");

if (testRunner.isTesting()) {
  // Run the tests
  testRunner.run();
} else {
  // Run/Setup the extension.
  require("./extension.js").run();
}
