/**
 * @fileOverview Script associated with the Context menu item. Listens for "click"
 * events on the context menu.
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
 * Called when the Context Menu Item is clicked. This sends a message to the 
 * extension in order to start the posting process.
 *
 * @param {Object} node DOM node that the user context-clicked to invoke the menu.
 * @param {Object} data Data property of the menu item that was clicked.
 */
postingProcess.menuClickHandler = function(node, data) {
  var targetNodeId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  // Set privly attribute so that the node can be identified.
  node.setAttribute("data-privly-target-node", targetNodeId);
  // Extract the selection text.
  // Uses bililiteRange library(sendkeys.js)
  var selectionText = bililiteRange(node).selection();
  var info = {
    nodeId: targetNodeId,
    text: selectionText,
    pageURL: window.location.href,
  };
  self.postMessage(info);
}

self.on("click", postingProcess.menuClickHandler);
