/*
  formatTemperature.js
  --------------------
  Pure utility functions: they take input, return output, and never
  touch the DOM. This makes them easy to test and reuse anywhere.

  The API always gives us temperatures in Celsius. We convert to
  Fahrenheit only when the app is displaying in Fahrenheit mode.
*/

/*
  celsiusToFahrenheit(celsius)
  Parameters: celsius (number)
  Returns: the same temperature converted to Fahrenheit (number).
*/
function celsiusToFahrenheit(celsius) {
  var fahrenheit = (celsius * 9 / 5) + 32;
  return fahrenheit;
}

/*
  calculateDewPoint(temperatureCelsius, humidityPercent)
  The API does not give us dew point directly, so we estimate it with
  a well-known simple approximation (accurate to within about 1°C for
  normal humidity ranges): Td = T - ((100 - RH) / 5)

  Parameters:
    temperatureCelsius (number)
    humidityPercent (number) - 0 to 100
  Returns: estimated dew point in Celsius (number)
*/
function calculateDewPoint(temperatureCelsius, humidityPercent) {
  var dewPoint = temperatureCelsius - ((100 - humidityPercent) / 5);
  return dewPoint;
}

/*
  formatTemperature(celsiusValue, unit)
  Converts a Celsius value to the requested unit and returns a display
  string like "28°C" or "82°F", rounded to the nearest whole number.

  Parameters:
    celsiusValue (number) - temperature in Celsius, straight from the API
    unit (string) - "C" or "F"

  Returns: a string ready to put on the screen.
  Called from: WeatherCard.js, ForecastCard.js, HourlyForecast.js, WeatherDetails.js
*/
function formatTemperature(celsiusValue, unit) {
  var displayValue = celsiusValue;

  if (unit === "F") {
    displayValue = celsiusToFahrenheit(celsiusValue);
  }

  var rounded = Math.round(displayValue);
  return rounded + "°" + unit;
}
