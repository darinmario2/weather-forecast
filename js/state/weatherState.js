/*
  weatherState.js
  ---------------
  WHY THIS FILE EXISTS:
  Different parts of the app need access to the same data (the current
  weather, the forecast, which unit is selected). Instead of passing
  this data around through many function parameters, we keep it in one
  plain JavaScript object called "weatherState". Any file loaded after
  this one can read or update it.

  This is NOT a state-management library like Redux. It is just one
  object plus a few helper functions to change it safely.
*/

var weatherState = {
  currentWeather: null,   // object returned by getCurrentWeather()
  forecastList: [],       // raw 3-hour forecast list from the API
  dailyForecast: [],      // forecast grouped into days (built in app.js)
  hourlyForecast: [],     // next several 3-hour steps (built in app.js)
  unit: "C",              // "C" or "F", controls what temperatures are shown
  city: "Chennai",        // last searched / default city
  isLoading: false,       // true while a request is in progress
  airQualityIndex: null   // 1-5 from getAirQuality(), or null if unavailable
};

/*
  setCurrentWeather(data)
  Stores the current weather object in state.
  Parameters: data (object) - the current weather data.
  Returns: nothing.
*/
function setCurrentWeather(data) {
  weatherState.currentWeather = data;
}

/*
  setForecastList(list)
  Stores the raw forecast list from the API in state.
*/
function setForecastList(list) {
  weatherState.forecastList = list;
}

/*
  setDailyForecast(list) / setHourlyForecast(list)
  Store the processed forecast arrays used for rendering.
*/
function setDailyForecast(list) {
  weatherState.dailyForecast = list;
}

function setHourlyForecast(list) {
  weatherState.hourlyForecast = list;
}

/*
  setUnit(unit)
  Changes the temperature unit ("C" or "F") stored in state.
*/
function setUnit(unit) {
  weatherState.unit = unit;
}

/*
  setLoading(value)
  Marks whether a request is currently in progress. Used to disable the
  search button and avoid firing duplicate requests.
*/
function setLoading(value) {
  weatherState.isLoading = value;
}
