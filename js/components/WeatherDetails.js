/*
  WeatherDetails.js
  -----------------
  Builds the "Stats" glass card: a 2x2 grid of small boxed tiles for
  wind, humidity, pressure, and visibility. Each tile is built by the
  same function so the markup is never duplicated by hand.
*/

/*
  createStatTile(iconEmoji, value, label)
  Parameters:
    iconEmoji (string) - a single icon character for the tile
    value (string) - e.g. "14 km/h"
    label (string) - e.g. "Wind"
  Returns: a <div class="stat-tile"> element.
  Called from: createWeatherDetailsCard() below
*/
function createStatTile(iconEmoji, value, label) {
  var tile = document.createElement("div");
  tile.className = "stat-tile";

  var iconBox = document.createElement("div");
  iconBox.className = "stat-tile-icon";
  iconBox.setAttribute("aria-hidden", "true");
  iconBox.textContent = iconEmoji;

  var textBlock = document.createElement("div");

  var valueEl = document.createElement("div");
  valueEl.className = "stat-tile-value";
  valueEl.textContent = value;

  var labelEl = document.createElement("div");
  labelEl.className = "stat-tile-label";
  labelEl.textContent = label;

  textBlock.appendChild(valueEl);
  textBlock.appendChild(labelEl);

  tile.appendChild(iconBox);
  tile.appendChild(textBlock);

  return tile;
}

/*
  createWeatherDetailsCard(weatherData)
  Parameters: weatherData (object) - raw object from getCurrentWeather()
  Returns: a <div class="glass-card"> containing the 2x2 tile grid.
  Called from: app.js, in renderWeatherStats()
*/
function createWeatherDetailsCard(weatherData) {
  var card = document.createElement("div");
  card.className = "glass-card";

  var title = document.createElement("div");
  title.className = "card-title";
  title.textContent = "Stats";

  var grid = document.createElement("div");
  grid.className = "stat-tiles";
  grid.style.marginTop = "0.9rem";

  var windKmh = Math.round(weatherData.wind.speed * 3.6);
  var visibilityKm = (weatherData.visibility / 1000).toFixed(1);

  grid.appendChild(createStatTile("\uD83D\uDCA8", windKmh + " km/h", "Wind"));
  grid.appendChild(createStatTile("\uD83D\uDCA7", weatherData.main.humidity + "%", "Humidity"));
  grid.appendChild(createStatTile("\uD83C\uDF21\uFE0F", weatherData.main.pressure + " mb", "Pressure"));
  grid.appendChild(createStatTile("\uD83D\uDC41\uFE0F", visibilityKm + " km", "Visibility"));

  card.appendChild(title);
  card.appendChild(grid);

  return card;
}
