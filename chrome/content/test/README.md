# Privly Jetpack Unit Tests

### Dependencies ###
---

In order to run the tests, you should have the following dependencies/packages installed on your system --

* [nodejs](https://nodejs.org/)
  * Useful links -
    * [Install nodejs](http://askubuntu.com/questions/49390/how-do-i-install-the-latest-version-of-node-js)
    * [Difference between node and nodejs](http://stackoverflow.com/questions/20057790/what-are-the-differences-between-node-js-and-node)
* Node.js Package Manager(npm) - `sudo apt-get install npm`

To install both `istanbul` and `coveralls`, run `npm install` in the `node/` directory.
* [istanbul](https://github.com/gotwarlost/istanbul).
* [coveralls](https://github.com/nickmerwin/node-coveralls).

### How to run the unit tests ###
---

Run the following command from the root of this repository --

> bash run_test.sh

### How to write tests for a module ###
---

(For a better understanding of what's really going on here, read the [Architecture](https://github.com/privly/privly-jetpack/tree/master/chrome/content/test#architecture) section first).

Let's say you want to test an extension module, `lib/example.js` that exports an `Example` object -

* Define a function as a part of the [XPCOM](https://github.com/privly/privly-jetpack/blob/master/lib/xpcom.js) service -

```
  ...
  // part of PrivlyTestXPCOMService
  getExampleObject: function() {
    // .in.js is the instrumented version of example.js
    // the instrumented version is generated using "istanbul instrument" by run_test.sh
    return ("./example.in.js");
  },
  ...
```

Why `example.in.js` instead of `example.js` ? Read more about [Code Coverage](https://github.com/privly/privly-jetpack/tree/master/chrome/content/test#code-coverage).

* Load the module into an object in `global.js` -
```
  ...
  // property of global namespace 'g'
  Example: PrivlyXPCOM.getExampleObject().Example,
  ...
```

* Include the test script in `test_loader.html` -
```
   ...
   <script type="text/javascript" src="./example_tests.js"></script>
   ...
```

* Write the tests  -
```
// example_tests.js
describe("Test Suite for Example.js", function() {
  
  var Example = g.Example;

  it("Does something cool", function() {
    Example.doSomethingCool();
    expect(Example.cool).toBe("done");
  });

});
```

That's it! This should get you started with writing tests for your module.

### How to get a module covered ###
---

(For a better understanding of what's really going on here, read the [Architecture](https://github.com/privly/privly-jetpack/tree/master/chrome/content/test#architecture)/[Code Coverage](https://github.com/privly/privly-jetpack/tree/master/chrome/content/test#code-coverage) section first).

If you want a module(say `lib/example.js`) to be covered for code coverage, you would have to do the following --

* Define a `GLOBALS` variable in the module that stores the `this` object.
```
...
var GLOBALS = this;
...
```

* Add a `coverage` function in the module -
```
  ...
  /**
   * Returns the coverage data for this file/module when tested.
   */
  coverage: function() {
    var cv = require("./coverage_var.js").coverageVar;
    // You just need to pass the filename.
    return GLOBALS[cv.generate("example.js")];
  },
  ...
```

* Make sure that the XPCOM service function returns a `.in.js` version of the file.
```
  ...
  // part of PrivlyTestXPCOMService
  getExampleObject: function() {
    // .in.js is the instrumented version of example.js
    // the instrumented version is generated using "istanbul instrument" by run_test.sh
    return ("./example.in.js");
  },
  ...
```

### Architecture ###
---

`jpm run` launches an instance of Firefox with the extension installed. In order to open the `test_loader.html` page, we pass a `--prefs test.json` argument to the `jpm run` command. `test.json` contains key-value pairs that signals the extension to open up the test loader page. These key-value pairs in `test.json` are stored in the preferences service of the launched Firefox browser.

The test loader page is an HTML page that loads the jasmine library scripts and test scripts. The page is loaded in a `chrome://privly/` URL and the scripts are run in a privileged environment. 

In a Firefox privileged JS environment, we have access to an object called [Components](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Language_Bindings/Components_object). This object allows us to use our XPCOM object/service defined in [lib/xpcom.js](https://github.com/privly/privly-jetpack/blob/master/lib/xpcom.js). The defined XPCOM object/service provides our extension modules to the test scripts.

`globals.js` loads the extension CommonJS modules into objects under the global `g` namespace. The test scripts can then access the extension module objects via `g`.

### Code Coverage ###
---

Code coverage is a measure used to describe the degree to which the source code of a program is tested by a particular test suite. We've used [Istanbul](https://github.com/gotwarlost/istanbul) to generate coverage reports. Since the tests are run in browser, the following steps are followed to get the code coverage -

* Use the instrumented js files/modules while running the tests. (Hence the usage of `.in.js` instead of `.js` in `lib/xpcom.js`)
* Send the `window.__coverage__` info to a server that accepts the coverage json.
* Generate a report from the coverage json at the server-side.
* Send the coverage reports to Coveralls.io if necessary.

These steps are a summary of istanbul's [in browser](https://github.com/gotwarlost/istanbul/issues/16#issuecomment-9879731) usage.

#### Extracting the coverage info from an Instrumented CommonJS module ####

A `coverage` function is defined for every module(for which unit tests exist). This `coverage` function returns the coverage info for the corresponding module. 

The coverage info exists in a variable in the generated instrumented module.The variable name is generated by following the same [steps](https://github.com/gotwarlost/istanbul/blob/master/lib/instrumenter.js#L43) as done by `istanbul`.

To generate the coverage variabe name, we need the full file path and a hashing function. The hashing fuction is built using [nsICryptoHash](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsICryptoHash#Computing_the_Hash_of_a_String) and the [base64](https://github.com/Gozala/crypto/blob/master/md5.js#L90) implementation extracted from the node [Crypto](https://github.com/Gozala/crypto) module(since `istanbul` [uses](https://github.com/gotwarlost/istanbul/blob/master/lib/instrumenter.js#L13) it).

The coverage variable name is a md5 sum + base64 encryption of the full file path. The `pwd` directory path is passed in `test.json` by the `run_test.sh` bash script. This is an automated process and developers should not edit `test.json` manually. The full file path is put together here.

#### Collecting the coverage info from every module ####

Once all the tests have run, we loop over all the modules used in the tests and call the `coverage` function. Once we have the coverage info from all the files, we send it to a nodejs server running locally that accepts this coverage info and generates a report. This report can be seen on the terminal when the tests are run on a local machine. If these tests are run on Travis-CI, then the generated report is sent to Coveralls.io as well.

#### Running a NodeJS Server that accepts the coverage info and sends it to Coveralls.io ####

The server is run using Node.js. We've used Node.JS because this makes it easier to generate the reports from the coverage json and send those reports to Coverall.io. `istanbul` node [API](https://github.com/gotwarlost/istanbul#generate-reports-given-a-bunch-of-coverage-json-objects) generates the reports from the coverage json and [node-coveralls](https://github.com/nickmerwin/node-coveralls) sends those reports to Coveralls.io. The server code can be found in `node/server.js`. The server only collects the coverage json and generates the report. `run_test.sh` uses `coveralls` to send those reports to Coveralls.io.
