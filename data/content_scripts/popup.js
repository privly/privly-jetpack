self.port.on("extensionMode", function(message) {
  if (typeof message === "string") {
    extMode = window.document.getElementById("extensionMode");
    if (message === "active") {
      extMode.className = "label label-success event-toggleMode";
      extMode.innerHTML = "On";
    } else {
      extMode.className = "label label-danger event-toggleMode";
      extMode.innerHTML = "Off";
    }
  }
});

window.addEventListener("click", function(event) {
  var target = event.target;
  var className = target.className;
  if (target.nodeName === "A" || target.nodeName === "SPAN") {
    if (typeof className !== "undefined") {
      var searchFor = "event-"; 
      var length = searchFor.length;
      var idx = className.indexOf(searchFor);
      if (idx !== -1) {
        self.port.emit("hyperlink", className.substring(idx + length, className.length));
      }
    }
  }
}, false);
