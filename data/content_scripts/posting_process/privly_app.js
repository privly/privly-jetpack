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
      // Send a message back to privly-applications.
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
      self.port.emit("askInitialContent", "initialContent");
      // initialContent or privlyApplicationStartingValue
      self.port.on("initialContent", function(data) {
        var message = JSON.stringify({
          secret: data.secret,
          handler: "initialContent",
          initialContent: data.initialContent,
        });
        window.postMessage(message, "*");
      });
    }
  }
}, false, true);
