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
require("./xpcom.js").register();
// First run
require("./first_run.js").firstRun();

var button = require("sdk/ui/button/action").ActionButton({
  id: "Privly",
  label: "Privly injection enabled",
  icon: {
    "16": "./skin/logo_16.png",
    "32": "./skin/logo_32.png",
    "64": "./skin/logo_64.png"
  }
});
