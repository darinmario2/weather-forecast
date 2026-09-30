/*
  Loading.js
  ----------
  Shows and hides a small spinner + message inside #loading-container.
  showLoading() and hideLoading() are called from app.js around every
  API request.
*/

/*
  showLoading()
  Puts a spinner and text into the loading container.
  Parameters: none. Returns: nothing.
*/
function showLoading() {
  var container = document.getElementById("loading-container");
  container.innerHTML = "";

  var box = document.createElement("div");
  box.className = "loading-box";

  var spinner = document.createElement("div");
  spinner.className = "spinner";

  var text = document.createElement("span");
  text.textContent = "Loading weather data...";

  box.appendChild(spinner);
  box.appendChild(text);
  container.appendChild(box);
}

/*
  hideLoading()
  Empties the loading container.
*/
function hideLoading() {
  var container = document.getElementById("loading-container");
  container.innerHTML = "";
}
