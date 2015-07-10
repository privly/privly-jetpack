/**
 * @fileOverview Script used to post the privly URL into the Host page target node.
 * This is injected only on receiving the URL from privly applications. The target node
 * ID and privly URL are passed as content script options.
 */
function dispatchClickEvent(target) {
  var evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: document.defaultView,
  });
  target.dispatchEvent(evt);
}

if (typeof self.options.nodeId !== "undefined" &&
    typeof self.options.privlyURL !== "undefined") {
  // Target DOM node
  var node = document.getElementById(self.options.nodeId);
  var privlyURL = self.options.privlyURL;
  // Status: success or failure
  // Determines if the Privly Application Tab needs to be closed.
  var postStatus;
  if (node !== null) {
    node.focus();
    // Click the form to trigger any click callbacks
    dispatchClickEvent(node);
    setTimeout(function() {
      bililiteRange(node).bounds('selection').sendkeys(privlyURL).select();
      self.port.emit("removeScript", "Delete worker!");
    }, 100);
    postStatus = "success";    
  } else {
    // DOM element not found.
    postStatus = "failure";
  }
  self.port.emit("postStatus", postStatus);
}
