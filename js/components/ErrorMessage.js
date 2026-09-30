/*
  ErrorMessage.js
  ---------------
  Displays a friendly error box instead of a browser alert(). Used for
  city-not-found, network failures, invalid API key, etc.
*/

/*
  showError(message)
  Parameters: message (string) - friendly text to display
  Returns: nothing.
  Called from: app.js, whenever getCurrentWeather/getForecast report an error
*/
function showError(message) {
  var container = document.getElementById("error-container");
  container.innerHTML = "";

  var box = document.createElement("div");
  box.className = "error-box";
  box.setAttribute("role", "alert");

  var text = document.createElement("p");
  text.textContent = message;

  box.appendChild(text);
  container.appendChild(box);
}

/*
  hideError()
  Empties the error container. Called at the start of every new search.
*/
function hideError() {
  var container = document.getElementById("error-container");
  container.innerHTML = "";
}
