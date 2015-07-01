## Setup ##

**Prerequisites**

To develop/test this add-on, you'll need:

* Firefox version 38 or later
* command-line jpm tool

Firefox version 38 or later can be found [here](https://nightly.mozilla.org/).

For jpm installation, follow the instructions as mentioned [here](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation).

**Running**

Once you have Firefox version 38 or later and jpm installed, run this command in the privly-jetpack directory -

> jpm run -b /path/to/firefox/executable

Linux:

> jpm run -b `which firefox`

OSX:

> jpm run -b /Applications/Firefox.app/Contents/MacOS/firefox-bin

**Testing**

To run the tests for your platform, add `--prefs test.json` to the jpm run command.

**More Information**

To know more about jpm commands, visit the Mozilla [jpm](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Command_reference) guide.
