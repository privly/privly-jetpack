'use strict';
/**
 * @fileOverview This file is the add-on's entry point that's executed
 *               when the browser loads the add-on.
 *
 *               The add-on entry point can be set to a different file
 *               using the main field in package.json.
 *
 **/

var PACKAGED = false;
try {
  var { testRunner } = require('./test_runner.js');
} catch (ignore) {
  PACKAGED = true;
}

if (PACKAGED) {
  // Run the extension.
  require('./extension.js').run();
} else {
  // Development Env
  if (testRunner.isUnitTesting()) {
    // Run the unit tests
    testRunner.runUnitTests();
  } else {
    if (testRunner.isIntegrationTesting()) {
      // Run a setup for integration tests.
      testRunner.setup();
    }
    // Run the extension.
    require('./extension.js').run();
  }
}
