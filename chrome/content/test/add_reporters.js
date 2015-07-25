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
    // Comment out the setTimeout if you don't want the browser 
    // to close upon test completion.
    setTimeout(function() {
      var windows = g.windows.browserWindows;
      for (var i=0; i<windows.length; i++) {
        windows[i].close();
      }
    }, 1000);
  };
  jasmineEnv.addReporter(terminalReporter);
})();
