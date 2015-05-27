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

// Register the Privly XPCOM services
const xpcom = require("./xpcom.js");
xpcom.register();
// First run
require("./first_run.js").firstRun();
// Display Privly extension button in toolbar
require("./privly_button.js").setupButton();
require("./run_test.js").runTest();
