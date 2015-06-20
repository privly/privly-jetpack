var node = document.getElementById(self.options.nodeId);
var privlyURL = self.options.privlyURL;
// Status: complete or error
// Determines if the Privly Application Tab needs to be closed.
var postStatus;

if (node !== null) {
  node.focus();
  bililiteRange(node).bounds('selection').sendkeys(privlyURL).select();
  postStatus = "complete";
} else {
  // DOM element not found.
  postStatus = "error";
}

self.port.emit("postStatus", postStatus);
