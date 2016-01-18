/**
 * @fileOverview This script is injected in
 * "chrome://privly/content/privly-applications/Pages/MessageTest.html"
 * and is used to forward messages to the extension.
 *
 */
var test = {
  /**
   * Called on receiving messages from Privly-applications and the Extension.
   * Forwards the message sent from Privly-applications to the Extension.
   *
   * @param {Object} message Message
   * @param {Function} sendResponse Function used to send a response back.
   */
  messageHandler: function(message, sendResponse) {
    if (message.name === "messageExtension") {
      var action = message.action;
      Privly.message.messageExtension(message, true).then(function(response) {
        if (action === "pingAsync") {
          setTimeout(function() {
            sendResponse(response);
          }, 10);
          return true;
        } else {
          sendResponse(response);
        }
      });
    }
  }
};
Privly.message.addListener(test.messageHandler);
