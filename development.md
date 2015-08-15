## Setup ##

**Prerequisites**

To develop/test this add-on, you'll need:

* Firefox version 38 or greater
* command-line jpm tool

Firefox version 38 or greater can be found [here](http://ftp.mozilla.org/pub/firefox/releases/). Or [Firefox Nightly](https://nightly.mozilla.org/).

For jpm installation, follow the instructions as mentioned [here](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation).

**Running**

Once you have Firefox version 38 or greater and jpm installed, run this command in the privly-jetpack directory -

> jpm run -b /path/to/firefox/executable

Linux:

> jpm run -b \`which firefox\`

OSX:

> jpm run -b /Applications/Firefox.app/Contents/MacOS/firefox-bin

You can also install the xpi file in your Firefox browser --
* Generate the xpi file by running `jpm xpi`.
* Open the Add-ons Manager(about:addons) in the browser.
* Click on the tools icon on the top right.
* Select "Install Add-on From File" and provide the link to the generated xpi file.

**Testing**

Tests Documentation can be found [here](https://github.com/privly/privly-jetpack/blob/master/chrome/content/test/README.md).

**More Information**

To know more about jpm commands, visit the Mozilla [jpm](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Command_reference) guide.
