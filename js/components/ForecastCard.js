/*
  ForecastCard.js
  ---------------
  Builds the "5-Day Forecast" glass card: a horizontal row of small
  boxed tiles, one per day, each with a day name, icon, temperature
  and rain chance. app.js groups the raw 3-hour API data into one
  summary object per day before calling this file (see
  buildDailyForecast() in app.js).
*/

/*
  createDailyTile(dayData, unit)
  Parameters:
    dayData (object) - { date, icon, description, maxTemp, minTemp, rainChance }
    unit (string) - "C" or "F"
  Returns: a <div class="daily-tile"> element.
  Called from: createForecastSection() below
*/
function createDailyTile(dayData, unit) {
  var tile = document.createElement("div");
  tile.className = "daily-tile";

  var dayName = document.createElement("div");
  dayName.className = "daily-tile-day";
  dayName.textContent = formatShortDay(dayData.date);

  var icon = document.createElement("img");
  icon.className = "daily-tile-icon";
  icon.src = getWeatherIconUrl(dayData.icon);
  icon.alt = dayData.description;

  var temp = document.createElement("div");
  temp.className = "daily-tile-temp";
  temp.textContent = formatTemperature(dayData.maxTemp, unit);

  var precip = document.createElement("div");
  precip.className = "daily-tile-precip";
  precip.innerHTML = '<span aria-hidden="true">\uD83D\uDCA7</span> ' + dayData.rainChance + "%";

  tile.appendChild(dayName);
  tile.appendChild(icon);
  tile.appendChild(temp);
  tile.appendChild(precip);

  return tile;
}

/*
  createForecastSection(dailyList, unit)
  Parameters:
    dailyList (array) - array of grouped day objects (see app.js)
    unit (string) - "C" or "F"
  Returns: a <div class="glass-card"> containing the title and day tiles.
  Called from: app.js, in renderDailyForecast()
*/
function createForecastSection(dailyList, unit) {
  var card = document.createElement("div");
  card.className = "glass-card";

  var title = document.createElement("div");
  title.className = "card-title";
  title.textContent = dailyList.length + "-Day Forecast";
  title.style.marginBottom = "0.9rem";

  var row = document.createElement("div");
  row.className = "daily-tiles";

  for (var i = 0; i < dailyList.length; i++) {
    row.appendChild(createDailyTile(dailyList[i], unit));
  }

  card.appendChild(title);
  card.appendChild(row);

  return card;
}
