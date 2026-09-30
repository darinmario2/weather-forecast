/*
  weatherIcon.js
  --------------
  OpenWeatherMap gives us a short "icon" code (like "01d" for clear sky,
  daytime) with every weather reading. This file turns that code into
  a real image URL, so we use ONE consistent icon set throughout the
  whole app instead of mixing emoji and images.
*/

/*
  getWeatherIconUrl(iconCode)
  Parameters: iconCode (string) - e.g. "01d", "10n", from the API response
  Returns: a URL string pointing to OpenWeatherMap's icon image.
  Called from: WeatherCard.js, ForecastCard.js, HourlyForecast.js
*/
function getWeatherIconUrl(iconCode) {
  return "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

/*
  getWeatherDescription(rawDescription)
  OpenWeatherMap returns descriptions in lowercase, like "scattered clouds".
  This capitalizes the first letter of each word for display.

  Parameters: rawDescription (string)
  Returns: a nicely capitalized string, e.g. "Scattered Clouds"
*/
function getWeatherDescription(rawDescription) {
  var words = rawDescription.split(" ");
  var result = "";

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    result += capitalized;
    if (i < words.length - 1) {
      result += " ";
    }
  }

  return result;
}
