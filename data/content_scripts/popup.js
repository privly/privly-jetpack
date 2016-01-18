/**
 * @fileOverview This script is injected in popup.html and is used to
 * communicate with the add-on code.
 */

/**
 * @namespace Popup panel
 */
var popup = {};

/* Handles the receipt of "extensionMode" message from the add-on.
 * Changes the label in popup.html accordingly.
 *
 * @param {String} message Message from the add-on.
 * @param {Function} sendResponse Function used to send a response/message back.
 */
popup.toggleLabel = function(message, sendResponse) {
  if (message.name === "extensionMode") {
    var extMode = window.document.getElementById("extensionMode");
    if (message.content === "active") {
      // Label: on
      extMode.className = "label label-success event-toggleMode";
      extMode.innerHTML = "On";
    } else {
      // Label: off
      extMode.className = "label label-danger event-toggleMode";
      extMode.innerHTML = "Off";
    }
  }
};

/**
 * Handles click events on the popup menu. Sends a message to the extension,
 * which then carries out the necessary action.
 *
 * @param {Object} event Click event.
 */
popup.clickHandler = function(event) {
  var target = event.target;
  var className = target.className;
  // Only respond to click events on specific DOM elements.
  if (target.nodeName === "A" || target.nodeName === "SPAN") {
    if (typeof className !== "undefined") {
      // All those DOM elements that send a message to the add-on have
      // a class name in the form of "event-<message>"
      var searchFor = "event-";
      var length = searchFor.length;
      // Look for "event-" in the class name.
      var idx = className.indexOf(searchFor);
      if (idx !== -1) {
        // Extract the message from the class name.
        // Send message to add-on.
        Privly.message.messageExtension({
          name: "hyperlink",
          content: className.substring(idx + length, className.length),
        }, true).then(popup.toggleLabel);
      }
    }
  }
};

Privly.message.addListener(popup.toggleLabel);
window.addEventListener("click", popup.clickHandler, false);
