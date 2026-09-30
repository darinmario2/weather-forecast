/*
  HourlyForecast.js
  -----------------
  Builds the "Hourly Forecast" glass card: a grid of small boxed tiles,
  each with a time, icon, temperature, condition and precipitation
  chance. OpenWeatherMap's free forecast endpoint gives readings every
  3 hours, so this shows the next four 3-hour steps (~12 hours ahead).
*/

/*
  createHourlyTile(hourData, unit, isFirst)
  Parameters:
    hourData (object) - one entry from the forecast "list" array
    unit (string) - "C" or "F"
    isFirst (boolean) - true for the soonest entry, labeled "Now"
  Returns: a <div class="hourly-tile"> element.
  Called from: createHourlyForecastSection() below
*/
function createHourlyTile(hourData, unit, isFirst) {
  var tile = document.createElement("div");
  tile.className = "hourly-tile";

  var time = document.createElement("div");
  time.className = "hourly-tile-time";
  time.textContent = isFirst ? "Now" : formatHourLabel(hourData.dt);

  var icon = document.createElement("img");
  icon.className = "hourly-tile-icon";
  icon.src = getWeatherIconUrl(hourData.weather[0].icon);
  icon.alt = hourData.weather[0].description;

  var temp = document.createElement("div");
  temp.className = "hourly-tile-temp";
  temp.textContent = formatTemperature(hourData.main.temp, unit);

  var condition = document.createElement("div");
  condition.className = "hourly-tile-condition";
  condition.textContent = getWeatherDescription(hourData.weather[0].description);

  var precipProbability = Math.round((hourData.pop || 0) * 100);
  var precip = document.createElement("div");
  precip.className = "hourly-tile-precip";
  precip.innerHTML = '<span aria-hidden="true">\uD83D\uDCA7</span> ' + precipProbability + "%";

  tile.appendChild(time);
  tile.appendChild(icon);
  tile.appendChild(temp);
  tile.appendChild(condition);
  tile.appendChild(precip);

  return tile;
}

/*
  createHourlyForecastSection(hourlyList, unit)
  Parameters:
    hourlyList (array) - array of forecast entries to display
    unit (string) - "C" or "F"
  Returns: a <div class="glass-card"> containing the title and tile grid.
  Called from: app.js, in renderHourlyForecast()
*/
function createHourlyForecastSection(hourlyList, unit) {
  var card = document.createElement("div");
  card.className = "glass-card";

  var headerRow = document.createElement("div");
  headerRow.className = "card-header-row";

  var titleBlock = document.createElement("div");
  var title = document.createElement("div");
  title.className = "card-title";
  title.textContent = "Hourly Forecast";
  var subtitle = document.createElement("div");
  subtitle.className = "card-subtitle";
  subtitle.textContent = "Next 12 hours";
  titleBlock.appendChild(title);
  titleBlock.appendChild(subtitle);

  headerRow.appendChild(titleBlock);

  var grid = document.createElement("div");
  grid.className = "hourly-tiles";

  for (var i = 0; i < hourlyList.length; i++) {
    grid.appendChild(createHourlyTile(hourlyList[i], unit, i === 0));
  }

  card.appendChild(headerRow);
  card.appendChild(grid);

  return card;
}
