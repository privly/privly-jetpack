self.on("click", function(node, data) {
  if (node.id === "") {
    node.id = "privly" + Math.random().toString(36).substring(2); 
  }
  node.setAttribute("data-privlynode", node.id.slice(0));
  var selectionText = bililiteRange(node).selection();
  var info = {
    nodeId: node.id.slice(0), 
    text: selectionText,
    pageURL: window.location.href,
  };    
  self.postMessage(info);
});
