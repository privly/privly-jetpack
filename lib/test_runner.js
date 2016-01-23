'use strict';

/**
 * @fileOverview This file determines if extension unit tests are to be run,
 * and if so, loads the necessary tests and xpcom services required by
 * the tests.
 * If the extension is being tested using Selenium, i.e, integration testing,
 * then the page-mod/content script injection is setup.
 *
 * Unit tests are run by the following command --
 * bash run_test.sh
 * Or ./run_test.sh
 *
 * Read https://github.com/privly/privly-applications/blob/master/test/selenium/README.md
 * to know more about testing this extension using Selenium.
 **/

// Privly Namespace
var { Privly } = require('./privly_ns.js');
var data = require('sdk/self').data;

/**
 * @namespace for the running/loading the tests.
 */
var testRunner = {

  /**
   * Checks whether extension unit tests need to be run.
   */
  isUnitTesting: function() {
    // this preference is set by passing '--prefs test.json' as an argument to 'jpm run'.
    var unitTest = require('sdk/preferences/service').get('extensions.privly.unit_test');
    if (unitTest === 'true') {
      return true;
    }
    return false;
  },

  /**
   * Checks whether the extension is being tested using Selenium, i.e, integration testing.
   */
  isIntegrationTesting: function() {
    // this preference is set using Selenium before running the integration tests.
    var test = require('sdk/preferences/service').get('extensions.privly.integration_test');
    if (test === 'true') {
      return true;
    }
    return false;
  },

  /**
   * Injects content scripts in the MessageTest page. This page is opened up while
   * running the integration tests.
   *
   */
  setup: function() {
    // Inject content script in the MessageTest page.
    require('sdk/page-mod').PageMod({
      // MessageTest page.
      include: 'chrome://privly/content/privly-applications/Pages/MessageTest.html',
      contentScriptFile: [data.url(Privly.CONTEXT_MESSENGER),
                          data.url('./content_scripts/test/context_messenger.js')],
      onAttach: function(worker) {
        Privly.message.currentAdapter.addWorker(worker);
        Privly.message.addListener(testRunner.messageHandler);
      },
    });
  },

  /**
   * Runs the extension unit tests.
   */
  runUnitTests: function() {
    // register xpcom services required for testing
    require('./xpcom.js').registerTest();
    // the page that loads the js test files.
    const TESTPAGE = 'chrome://privly/content/test/test_loader.html';
    // open test loader
    require('sdk/tabs').open(TESTPAGE);
  },

  /**
   * Called on receiving messages from the content scripts injected in the MessageTest page.
   *
   * @param {Object} message Message
   * @param {Function} sendResponse Function used to send a response back.
   */
  messageHandler: function(message, sendResponse) {
    if (message.name === 'messageExtension') {
      var responseBody = {
        action: message.action === 'ping' ? 'pong' : 'pongAsync',
        timestamp: Date.now(),
        platform: Privly.message.currentAdapter.getPlatformName(),
        context: Privly.message.currentAdapter.getContextName(),
        data: message.data
      };
      sendResponse(responseBody);
    }
  }

};
exports.testRunner = testRunner;
