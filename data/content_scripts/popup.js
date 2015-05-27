self.port.on("extensionMode", function(message) {
  if (typeof message === "string") {
    extMode = window.document.getElementById("extensionMode");
    if (message === "active") {
      extMode.className = "label label-success";
      extMode.innerHTML = "On";
    } else {
      extMode.className = "label label-danger";
      extMode.innerHTML = "Off";
    }
  }
});

window.addEventListener("click", function(event) {
  var target = event.target;
  if (target.nodeName === "A") {
    self.port.emit("hyperlink", target.id);
  }
}, false);
