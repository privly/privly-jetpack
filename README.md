## About ##

Privly is a developing set of browser extensions for protecting content wherever it is posted on the internet. This extension allows users to view content on any website, without the host site being able to read the content. For more information on what Privly is, [read about us](https://priv.ly/pages/about).

## Development Status ##

**Deprecated Version**

This version will be maintained until Mozilla releases its new extension framework, [WebExtenstions](https://blog.mozilla.org/addons/2015/08/21/the-future-of-developing-firefox-add-ons/).

[![Build Status](https://travis-ci.org/privly/privly-jetpack.svg)](https://travis-ci.org/privly/privly-jetpack)

## About this Extension ##

This extension currently supports:

* **Contextual Posting:** Posting to any website by right-clicking a form element.
* **Locally stored applications:** The Firefox extension runs no remote-code.
  * **PlainPost Application:** The [PlainPost][PlainPost] application supports content injection of web pages from **any** source domain. Note: the injected web pages do not include external media and code.
  * **Message Application:** The [Message][Message] application encrypts content with a key unique to the URL. Anyone with access to both the host page and the content server will be able to decrypt the content. Anyone without access to the server will be unable to decrypt the content.
* **Security glyph:** Every Firefox extension places a unique security glyph above Privly content when you hover over it.
* **Options Page:** The extension has an options page that allows you to select content servers, add to a domain whitelist, and enable/disable the Privly posting button.
* **User-defined Whitelists:** Users can add domains to their "whitelist." This means any domain you trust to deliver content will be able to add a layer of privacy on top of your browsing experience.
* **Augmented Browsing Toggle:** When you turn off Privly injection, the web page you are viewing will be restored to the un-augmented view.
* **Testing Library:** The Jasmine testing library is integrated with the extension.

*This extension is yet to be packaged.*

## Testing/Submitting Bugs ##

Extension integration test cases are found at [test.privly.org](http://test.privly.org). If you have discovered a bug, only [open a public issue](https://github.com/privly/privly-jetpack/issues/new) on GitHub if it could not possibly be a security related bug. If the bug affects the security of the system, please send an email to privly@privly.org reporting the bug. We will then fix the bug and follow a process of responsible disclosure.

There are also unit and Selenium tests, which are found in the privly-application git submodule.

## Developer Documentation ##

Visit the [developer guide](https://priv.ly/pages/develop) for in depth development information. You should also read [development.md](https://github.com/privly/privly-jetpack/blob/master/development.md) in this directory.

## Resources ##

* [Foundation Home](http://www.privly.org)
* [Privly Project Repository List](https://github.com/privly)
* [Development Mailing List](http://groups.google.com/group/privly)
* [Testing Mailing List](http://groups.google.com/group/privly-test)
* [Announcement Mailing List](http://groups.google.com/group/privly-announce)
* [Central Wiki](https://github.com/privly/privly-organization/wiki)
* [Submit a Bug](http://www.privly.org/content/bug-report)
* [IRC](http://www.privly.org/content/irc)
* [Production Content Server](https://privlyalpha.org)
* [Development Content Server](https://dev.privly.org)

## Contributors ##

* [smcgregor](https://github.com/smcgregor)
* [irdan](https://github.com/irdan)
* [hitesh96db](https://github.com/hitesh96db)

## Contacts ##

**Email**:
Community [the 'at' sign] privly.org

**Mail**:
Privly
PO Box 79
Corvallis, OR 97339

**IRC**:
Nicks on irc.freenode.net #privly --
* "[smcgregor](https://github.com/smcgregor)"
* "[hitesh96db](https://github.com/hitesh96db)"
* "[irdan](https://github.com/irdan)"

**Bug**:  
If you open a bug on this repository, you'll get someone's attention.

[Message]: https://github.com/privly/privly-applications/blob/master/Message/docs/ZeroBin.md "ZeroBins"
[PlainPost]: https://github.com/privly/privly-applications/blob/master/PlainPost/docs/Posts.md "Plain Posts"
