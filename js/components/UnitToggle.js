/*
  UnitToggle.js
  -------------
  Builds the °C / °F toggle. When clicked, it calls onUnitChange with
  the new unit so app.js can re-render existing data without another
  network request.
*/

/*
  createUnitToggle(onUnitChange)
  Parameters:
    onUnitChange (function) - called with "C" or "F" when the user switches
  Returns: a <div> element containing two buttons.
  Called from: app.js, once, when the page first loads
*/
function createUnitToggle(onUnitChange) {
  var wrapper = document.createElement("div");
  wrapper.className = "unit-toggle";

  var celsiusButton = document.createElement("button");
  celsiusButton.type = "button";
  celsiusButton.textContent = "°C";
  celsiusButton.className = "unit-toggle-btn active";
  celsiusButton.id = "celsius-btn";

  var fahrenheitButton = document.createElement("button");
  fahrenheitButton.type = "button";
  fahrenheitButton.textContent = "°F";
  fahrenheitButton.className = "unit-toggle-btn";
  fahrenheitButton.id = "fahrenheit-btn";

  celsiusButton.addEventListener("click", function () {
    celsiusButton.classList.add("active");
    fahrenheitButton.classList.remove("active");
    onUnitChange("C");
  });

  fahrenheitButton.addEventListener("click", function () {
    fahrenheitButton.classList.add("active");
    celsiusButton.classList.remove("active");
    onUnitChange("F");
  });

  wrapper.appendChild(celsiusButton);
  wrapper.appendChild(fahrenheitButton);

  return wrapper;
}
