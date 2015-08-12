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
 * Responds to the intial content request from Privly Application and also handles
 * the receipt of initial content from the extension. This content is then sent to 
 * the privly application.
 * 
 * @param {Object} message Message sent by Privly application.
 * @param {Function} sendResponse Function used to send a response/message back.
 */
postingProcess.initialContentHandler = function(message, sendResponse) {

  if (message.ask === "initialContent") {
    Privly.message.messageExtension({
      name: "requestInitialContent",
      content: "Ask for Initial Content",
    }, true).then(function(response) {
      // Send/Forward the response from the extension to the Privly application.
      sendResponse({
        name: response.name,
        handler: response.name,
        initialContent: response.content.initialContent,
      });
    });
  }
}

/**
 * Handles the receipt of Privly URL from the Privly Application. Forwards the URL to 
 * the extension.
 * 
 * @param {Object} message Message sent by Privly application.
 * @param {Function} sendResponse Function used to send a response/message back.
 */
postingProcess.receivePrivlyURL = function(message, sendResponse) {

  if (typeof message.privlyUrl === "string") {
    Privly.message.messageExtension({
      name: "setPrivlyURL",
      content: message.privlyUrl,
    });
  }
}

Privly.message.addListener(postingProcess.initialContentHandler);
Privly.message.addListener(postingProcess.receivePrivlyURL);
