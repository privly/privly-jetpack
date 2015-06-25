/**
 * @fileOverview Script used to post the privly URL into the Host page target node.
 */
self.port.on("postURL", function(message) {
  // Check whether the privly URl is intended for the current location.
  if (message.pageURL === window.location.href) {
    // Target DOM node.
    var node = document.getElementById(message.nodeId);
    // Status: complete or error
    // Determines if the Privly Application Tab needs to be closed.
    var postStatus;

    if (node !== null) {
      node.focus();
      bililiteRange(node).bounds('selection').sendkeys(message.privlyURL).select();
      postStatus = "complete";
    } else {
      postStatus = "error";
    }
    self.port.emit("postStatus", postStatus);
  }
});
