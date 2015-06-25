/**
 * @fileOverview Script associated with the Context menu item. Listens for "click"
 * events on the context menu.
 */
self.on("click", function(node, data) {
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
});
