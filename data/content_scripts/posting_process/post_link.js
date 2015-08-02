/**
 * @fileOverview Script used to post the privly URL into the Host page target node.
 */

/**
 * @namespace Posting Process
 * If postingProcess namespace is not initialized, initialize it
 */
var postingProcess;
if (postingProcess === undefined) {
  postingProcess = {};
}

/**
 * Dispatches a mouse "click" event on the specified target node.
 * 
 * @param {Object} target DOM node.
 */
postingProcess.dispatchClickEvent = function(target) {
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
 * @param {Function} sendResponse Function used to send a response/message back.
 */
postingProcess.postPrivlyURL = function(message, sendResponse) {
  if (message.name === "postURL") {
    // Check whether the privly URl is intended for the current location.
    if (message.content.pageURL === window.location.href) {
      var pendingNode = document.getElementById("privly-pending-post-" + message.content.nodeId);
      if (pendingNode !== null) {
        // Target DOM node.
        var node = document.querySelector("[data-privly-target-" + message.content.nodeId + "=true]");
        // Status: success or failure
        // Determines if the Privly Application Tab needs to be closed.
        var postStatus;
        if (node !== null) {
          node.removeAttribute("data-privly-target-" + message.content.nodeId);
          node.focus();
          // Click the form to trigger any click callbacks
          postingProcess.dispatchClickEvent(node);
          setTimeout(function() {
            bililiteRange(node).bounds('selection').sendkeys(message.content.privlyURL).select();
          }, 100);
          postStatus = "success";
        } else {
          // DOM element not found.
          postStatus = "failure";
        }
        document.body.removeChild(pendingNode);
        sendResponse({name: "postStatus", content: postStatus});
      }
    }
  }
}

Privly.message.addListener(postingProcess.postPrivlyURL);
