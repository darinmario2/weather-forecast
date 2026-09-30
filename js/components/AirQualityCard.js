/*
  AirQualityCard.js
  -----------------
  Builds the "Air Quality" glass card: a large colored dot + label
  (Good/Fair/Moderate/Poor/Very Poor) from OpenWeatherMap's Air
  Pollution endpoint, plus dew point and cloudiness as supporting rows.
*/

/*
  createAirQualityCard(weatherData, unit, airQualityIndex)
  Parameters:
    weatherData (object) - raw object from getCurrentWeather()
    unit (string) - "C" or "F", needed to format the dew point
    airQualityIndex (number or null) - 1 to 5 from getAirQuality()
  Returns: a <div class="glass-card"> element.
  Called from: app.js, in renderAirQuality()
*/
function createAirQualityCard(weatherData, unit, airQualityIndex) {
  var card = document.createElement("div");
  card.className = "glass-card";

  var title = document.createElement("div");
  title.className = "card-title";
  title.textContent = "Air Quality";

  var headline = document.createElement("div");
  headline.className = "aqi-headline";

  var dot = document.createElement("span");
  dot.className = "aqi-dot-large";
  dot.style.background = "var(" + getAqiColorVar(airQualityIndex) + ")";

  var label = document.createElement("span");
  label.className = "aqi-headline-label";
  label.textContent = airQualityIndex ? getAqiLabel(airQualityIndex) : "N/A";

  headline.appendChild(dot);
  headline.appendChild(label);

  var dewPointC = calculateDewPoint(weatherData.main.temp, weatherData.main.humidity);

  var dewRow = createAqiSubRow("Dew point", formatTemperature(dewPointC, unit));
  var cloudRow = createAqiSubRow("Cloudiness", weatherData.clouds.all + "%");

  card.appendChild(title);
  card.appendChild(headline);
  card.appendChild(dewRow);
  card.appendChild(cloudRow);

  return card;
}

/*
  createAqiSubRow(label, value)
  Returns a small label/value row used under the AQI headline.
*/
function createAqiSubRow(label, value) {
  var row = document.createElement("div");
  row.className = "aqi-sub-row";

  var labelEl = document.createElement("span");
  labelEl.className = "aqi-sub-label";
  labelEl.textContent = label;

  var valueEl = document.createElement("span");
  valueEl.className = "aqi-sub-value";
  valueEl.textContent = value;

  row.appendChild(labelEl);
  row.appendChild(valueEl);

  return row;
}
