var elements = document.getElementsByTagName("privModeElement");
if (elements !== undefined && elements !== null && elements.length !== 0) {
  elements[0].setAttribute("data-mode", self.options.extensionMode);
}
else {
  var element = document.createElement("privModeElement");
  element.setAttribute("data-mode", self.options.extensionMode);
  document.documentElement.appendChild(element);
}

if (typeof privly !== 'undefined') {
  privly.start();
}
