/*
  Button.js
  ---------
  A single function that builds a <button> element. Every button in the
  app (search, retry, etc.) is created by calling this function instead
  of writing <button> HTML by hand in several places.

  createButton(text, className, clickHandler)
  Parameters:
    text (string) - label shown on the button
    className (string) - CSS class(es) to apply, e.g. "btn btn-primary"
    clickHandler (function) - function to run when the button is clicked
  Returns: a <button> DOM element (not yet attached to the page).
  Called from: SearchBar.js, ErrorMessage.js (retry button)
*/
function createButton(text, className, clickHandler) {
  var button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = className;

  if (clickHandler) {
    button.addEventListener("click", clickHandler);
  }

  return button;
}
