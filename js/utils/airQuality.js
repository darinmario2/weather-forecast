/*
  airQuality.js
  -------------
  OpenWeatherMap's Air Pollution endpoint returns a simple index from
  1 (Good) to 5 (Very Poor) rather than the 0-500 style AQI number some
  other services show. This file turns that index into a readable
  label and a color, used for the small colored dot in the details row.
*/

var AQI_LABELS = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
var AQI_COLOR_VARS = ["", "--aqi-good", "--aqi-fair", "--aqi-moderate", "--aqi-poor", "--aqi-very-poor"];

/*
  getAqiLabel(aqiIndex)
  Parameters: aqiIndex (number) - 1 to 5, from data.list[0].main.aqi
  Returns: a readable string, e.g. "Good"
*/
function getAqiLabel(aqiIndex) {
  return AQI_LABELS[aqiIndex] || "Unknown";
}

/*
  getAqiColorVar(aqiIndex)
  Returns the CSS variable name (as a string) to use for this AQI level,
  e.g. "--aqi-good". The component wraps this in var(...) itself.
*/
function getAqiColorVar(aqiIndex) {
  return AQI_COLOR_VARS[aqiIndex] || "--text-muted";
}
