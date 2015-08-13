/**
 * @fileOverview Defines the Jasmine Terminal Reporter. This allows logging of test
 * results in the terminal, useful for CI/Travis-CI.
 **/
/* global jasmine, g */
(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 2500;
  var terminalReporter = new jasmineReporters.TerminalReporter({
                               verbosity: 3,
                               color: "green",
                             });
  var old_callback = terminalReporter.jasmineDone;
  terminalReporter.jasmineDone = function() {
    old_callback();
    // Collects all the coverage info and sends it to a nodejs server.
    // the server generates a coverage report.
    g.reportCoverage();
  };
  jasmineEnv.addReporter(terminalReporter);
})();
