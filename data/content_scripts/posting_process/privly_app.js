/**
 * @fileOverview Script acting as a "middleman" to allow communication between
 * the extension and privly application.
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
 * Handles the receipt of initial content from the extension. This content is then 
 * sent to the privly application
 * 
 * @param {Object} data Message sent by the extension. This includes the initial content 
 *                      and the message secret(used to establish communication between the
 *                      content scripts and privly-applications).
 */
postingProcess.initialContentHandler = function(data) {
  var message = JSON.stringify({
                  secret: data.secret,
                  handler: "initialContent",
                  initialContent: data.initialContent,
                });
  window.postMessage(message, "*");
}

window.addEventListener("PrivlyMessageEvent", function(e) {
  // Firefox does not respect the targetOrigin for the postMessage command properly
  // if it is a Chrome origin page. So we must use the "*" origin in the message.
  // To make this safer, we check that the owning document is in a privly controlled
  // window.
  if ( e.originalTarget.ownerDocument.defaultView.location.origin === ("chrome://privly")) {
    // e.originalTarget.ownerDocument;
    var data = JSON.parse(e.target.getAttribute("data-message-body"));
    if (data.handler === "messageSecret") {
      // Save the messageSecret
      self.port.emit("messageSecret", data.data);
      var message = JSON.stringify({secret: data.data,
                                    handler: "messageSecret"});
      window.postMessage(message, "*");
    } 
    else if(data.handler === "privlyUrl") {
      // Send the extension the Privly URL received from Privly Applications.
      self.port.emit("setPrivlyURL", data.data);
    } 
    else if(data.handler == "initialContent") {
      // Send initialContent to Privly Application
      self.port.emit("requestInitialContent", "initialContent");
      // initialContent or privlyApplicationStartingValue
      self.port.on("initialContent", postingProcess.initialContentHandler);
    }
  }
}, false, true);
