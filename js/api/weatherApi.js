/*
  weatherApi.js
  -------------
  WHY THIS FILE IS SEPARATE:
  Every piece of code that talks to the internet lives here, and nowhere
  else. UI components never call fetch() directly - they call the
  functions below and get plain JavaScript data back. If OpenWeatherMap
  ever changes their API, this is the only file you'd need to edit.

  >>> WHERE'S THE API KEY? <<<
  API_KEY is defined in js/api/config.js, NOT in this file. That way
  your real key lives in a file that's gitignored and never gets pushed
  to GitHub. See config.example.js for setup instructions.
*/

var BASE_URL = "https://api.openweathermap.org/data/2.5";

/*
  getCurrentWeather(cityName, callback)
  Fetches the current weather for a city.

  Parameters:
    cityName (string) - the city the user searched for
    callback (function) - called with (errorMessage, data)
                           errorMessage is null when the request succeeds
  Returns: nothing directly (results arrive through the callback,
           because fetch() is asynchronous).
  Called from: app.js, inside searchWeather()
*/
function getCurrentWeather(cityName, callback) {
  var url = BASE_URL + "/weather?q=" + encodeURIComponent(cityName) +
    "&units=metric&appid=" + API_KEY;

  fetch(url)
    .then(function (response) {
      if (response.status === 404) {
        throw new Error("CITY_NOT_FOUND");
      }
      if (response.status === 401) {
        throw new Error("INVALID_API_KEY");
      }
      if (!response.ok) {
        throw new Error("REQUEST_FAILED");
      }
      return response.json();
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (error) {
      callback(error.message, null);
    });
}

/*
  getAirQuality(latitude, longitude, callback)
  Fetches the current Air Quality Index for a location, using
  OpenWeatherMap's free "Air Pollution" endpoint. This needs
  coordinates rather than a city name, so app.js calls this AFTER
  getCurrentWeather() succeeds, using weatherData.coord.

  Parameters:
    latitude (number), longitude (number)
    callback (function) - called with (errorMessage, data)
  Called from: app.js, inside searchWeather()
*/
function getAirQuality(latitude, longitude, callback) {
  var url = BASE_URL + "/air_pollution?lat=" + latitude + "&lon=" + longitude +
    "&appid=" + API_KEY;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("REQUEST_FAILED");
      }
      return response.json();
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (error) {
      callback(error.message, null);
    });
}

/*
  getDailyForecast(latitude, longitude, callback)
  Fetches a real day-by-day forecast (up to 8 days) using OpenWeatherMap's
  "One Call 3.0" endpoint. This is a SEPARATE product from the free
  /weather and /forecast endpoints - it needs coordinates, and your
  account must have "One Call by Call" subscribed (see README.md), even
  though it's free for normal personal use.

  If this fails (for example because it isn't subscribed yet), app.js
  falls back to building a shorter daily forecast out of the regular
  /forecast data instead, so the app still works either way.

  Parameters:
    latitude (number), longitude (number)
    callback (function) - called with (errorMessage, data)
  Called from: app.js, inside searchWeather()
*/
function getDailyForecast(latitude, longitude, callback) {
  var url = "https://api.openweathermap.org/data/3.0/onecall?lat=" + latitude +
    "&lon=" + longitude + "&units=metric&exclude=current,minutely,hourly,alerts&appid=" + API_KEY;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("REQUEST_FAILED");
      }
      return response.json();
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (error) {
      callback(error.message, null);
    });
}

/*
  getForecast(cityName, callback)
  Fetches the 5-day / 3-hour forecast for a city. This single response
  is used to build BOTH the hourly forecast section and the 5-day
  forecast section (see app.js), so we only need one extra network call.

  Parameters:
    cityName (string)
    callback (function) - called with (errorMessage, data)
  Called from: app.js, inside searchWeather()
*/
function getForecast(cityName, callback) {
  var url = BASE_URL + "/forecast?q=" + encodeURIComponent(cityName) +
    "&units=metric&appid=" + API_KEY;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("REQUEST_FAILED");
      }
      return response.json();
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (error) {
      callback(error.message, null);
    });
}
