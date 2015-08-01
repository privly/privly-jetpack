### Conventional tests ###
---

Say we want to test a file `posting_process.js`, our `test_loader.html` would be 

```
// File to test
<script type="text/javascript" src="./posting_process.js"></script>
// Test file
<script type="text/javascript" src="./tests_for_posting_process.js"></script>
```

However unit-tests for `privly-jetpack` are run in a different manner.

### Jetpack tests ###
---

If we want to test the same `posting_process.js` file, our test_loader.html wouldn't include the posting process script as a script in test_loader.html but would rather be loaded into a object because it's a CommonJS module. Now the object would have access to all the functions in the module because the module exports it.

The CommonJS extension modules are loaded in [chrome/content/test/globals.js](https://github.com/privly/privly-jetpack/tree/master/chrome/content/test/globals.js) and are exposed to the tests via a global `g` namespace. The extension modules are loaded via a custom XPCOM object defined in [lib/xpcom.js](https://github.com/privly/privly-jetpack/blob/master/lib/xpcom.js).

To run the tests for your platform, add `--prefs test.json` to the jpm run command.

Adding the `--prefs` arg tells the extension to run the unit-tests, and opens up the `test_loader.html`. The code to do so can be found in [lib/run_test.js](https://github.com/privly/privly-jetpack/blob/master/lib/run_test.js).
