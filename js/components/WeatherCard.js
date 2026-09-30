/*
  WeatherCard.js
  --------------
  Builds the current weather glass card: day/date, icon, big
  temperature, feels-like, condition, and high/low.
*/

/*
  createWeatherCard(weatherData, unit)
  Parameters:
    weatherData (object) - the raw object returned by getCurrentWeather()
    unit (string) - "C" or "F"
  Returns: a <div class="glass-card"> element.
  Called from: app.js, in renderCurrentWeather()
*/
function createWeatherCard(weatherData, unit) {
  var card = document.createElement("div");
  card.className = "glass-card";

  var dateRow = document.createElement("div");
  dateRow.className = "current-date-row";

  var dayName = document.createElement("div");
  dayName.className = "current-day";
  dayName.textContent = fullDayName(new Date());

  var updatedTag = document.createElement("span");
  updatedTag.className = "current-updated-tag";
  updatedTag.textContent = "Updated " + formatTime(Math.floor(Date.now() / 1000));

  dateRow.appendChild(dayName);
  dateRow.appendChild(updatedTag);

  var dateLine = document.createElement("div");
  dateLine.className = "current-date";
  dateLine.textContent = formatFullDate(new Date());

  var bodyRow = document.createElement("div");
  bodyRow.className = "current-body-row";

  var tempBlock = document.createElement("div");

  var temp = document.createElement("div");
  temp.className = "current-temp";
  temp.id = "current-temp-value";
  temp.textContent = formatTemperature(weatherData.main.temp, unit);

  var feelsLike = document.createElement("div");
  feelsLike.className = "current-feels-like";
  feelsLike.textContent = "Feels like " + formatTemperature(weatherData.main.feels_like, unit);

  tempBlock.appendChild(temp);
  tempBlock.appendChild(feelsLike);

  var icon = document.createElement("img");
  icon.className = "current-icon";
  icon.src = getWeatherIconUrl(weatherData.weather[0].icon);
  icon.alt = weatherData.weather[0].description;

  bodyRow.appendChild(tempBlock);
  bodyRow.appendChild(icon);

  var condition = document.createElement("div");
  condition.className = "current-condition";
  condition.textContent = getWeatherDescription(weatherData.weather[0].description);

  var highLow = document.createElement("div");
  highLow.className = "current-highlow";
  highLow.textContent = "High: " + formatTemperature(weatherData.main.temp_max, unit) +
    "   Low: " + formatTemperature(weatherData.main.temp_min, unit);

  card.appendChild(dateRow);
  card.appendChild(dateLine);
  card.appendChild(bodyRow);
  card.appendChild(condition);
  card.appendChild(highLow);

  return card;
}

/*
  fullDayName(date)
  Returns the full weekday name, e.g. "Monday". Small helper kept here
  since only the current weather card needs the FULL name (other cards
  use the short 3-letter version from formatDate.js).
*/
function fullDayName(date) {
  var fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return fullNames[date.getDay()];
}
