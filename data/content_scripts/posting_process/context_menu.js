/**
 * @fileOverview Script associated with the Context menu item. Listens for "click"
 * events on the context menu.
 */
/**
 * Called when the Context Menu Item is clicked. This sends a message to the 
 * extension in order to start the posting process.
 *
 * @param {Object} node DOM node that the user context-clicked to invoke the menu.
 * @param {Object} data Data property of the menu item that was clicked.
 */
function menuClickHandler(node, data) {
  // If the target node doesn't have an id, add one.
  if (node.id === "") {
    node.id = "privly" + Math.random().toString(36).substring(2); 
  }
  // Extract the selection text.
  // Uses bililiteRange library(sendkeys.js)
  var selectionText = bililiteRange(node).selection();
  var info = {
    nodeId: node.id.slice(0), 
    text: selectionText,
    pageURL: window.location.href,
  };
  self.postMessage(info);
}

self.on("click", menuClickHandler);
