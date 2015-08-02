/**
 * @fileOverview This script is injected when the privly extension mode is
 * toggled via the popup button. It inserts/uses a DOM element to specify the mode.
 * This mode is read by privly.js to decide whether injection is to be carried out or not.
 */

var elements = document.getElementsByTagName("privModeElement");
if (elements !== undefined && elements !== null && elements.length !== 0) {
  // Change the extension mode.
  elements[0].setAttribute("data-mode", self.options.extensionMode);
}
else {
  // Create DOM element and store the extension mode.
  var element = document.createElement("privModeElement");
  element.setAttribute("data-mode", self.options.extensionMode);
  document.documentElement.appendChild(element);
}

if (typeof privly !== "undefined") {
  privly.updateWhitelist(self.options.whitelist);
  privly.start();
}
