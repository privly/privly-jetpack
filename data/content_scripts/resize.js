window.addEventListener("message", function(e) {
  if(e.origin == "chrome://privly" && typeof e.data == "string") {
    
    var data = e.data.split(",");
    if ( data.length >= 2) {
      var frame_id = data[0];
      var height = data[1];
      var frame = document.getElementById(frame_id);
      var acceptresize = frame.getAttribute("data-privly-accept-resize");
      if (acceptresize !== "true") {
        return;
      }
      frame.style.height = height + "px";
    }
  }
}, false);
