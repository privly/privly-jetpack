/**
 * @fileOverview This script is injected in popup.html and is used to 
 * communicate with the add-on code by making use of the Jetpack messaging API,
 * self.port.
 */

// Receive the "extensionMode" message from the add-on.
// Change the label in popup.html accordingly.
self.port.on("extensionMode", function(message) {
  if (typeof message === "string") {
    extMode = window.document.getElementById("extensionMode");
    if (message === "active") {
      // Label: on
      extMode.className = "label label-success event-toggleMode";
      extMode.innerHTML = "On";
    } else {
      // Label: off
      extMode.className = "label label-danger event-toggleMode";
      extMode.innerHTML = "Off";
    }
  }
});

window.addEventListener("click", function(event) {
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
        self.port.emit("hyperlink", className.substring(idx + length, className.length));
      }
    }
  }
}, false);
