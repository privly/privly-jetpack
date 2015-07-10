/**
 * @fileOverview Script used to post the privly URL into the Host page target node.
 */
function dispatchClickEvent(target) {
  var evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: document.defaultView,
  });
  target.dispatchEvent(evt);
}

/**
 * Handles the receipt of Privly URL messages from the extension for the addition 
 * to the host page.
 *
 * @param {Object} message Message containing Privly url to be posted in the host page.
 */
function postPrivlyURL(message) {
  // Check whether the privly URl is intended for the current location.
  if (message.pageURL === window.location.href) {
    // Target DOM node.
    var node = document.getElementById(message.nodeId);
    // Status: success or failure
    // Determines if the Privly Application Tab needs to be closed.
    var postStatus;
    if (node !== null) {
      node.focus();
      // Click the form to trigger any click callbacks
      dispatchClickEvent(node);
      setTimeout(function() {
        bililiteRange(node).bounds('selection').sendkeys(message.privlyURL).select();
        self.port.emit("removeScript", "Delete worker!");
      }, 100);
      postStatus = "success";
    } else {
      // DOM element not found.
      postStatus = "failure";
    }
    self.port.emit("postStatus", postStatus);
  }
}

self.port.on("postURL", postPrivlyURL);
