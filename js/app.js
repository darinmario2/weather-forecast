/*
  app.js
  ------
  This is the "conductor" of the app. It does not build HTML itself
  (that's what js/components/ is for) and it does not talk to the
  network itself (that's js/api/weatherApi.js). It just:
    1. Sets up the header (search bar + unit toggle) once.
    2. Reacts to user actions (search, unit change).
    3. Calls the API functions.
    4. Saves results into weatherState.
    5. Tells each component to render itself using that state.

  Loaded LAST in index.html, after every other script it depends on.
*/

/*
  init()
  Runs once when the page loads. Builds the header controls and loads
  a default city so the page isn't empty.
*/
function init() {
  var searchBarContainer = document.getElementById("search-bar-container");
  var searchBar = createSearchBar(searchWeather);
  searchBarContainer.appendChild(searchBar);

  var unitToggleContainer = document.getElementById("unit-toggle-container");
  var unitToggle = createUnitToggle(changeUnit);
  unitToggleContainer.appendChild(unitToggle);

  initBackgroundEffect();

  searchWeather(weatherState.city);
}

/*
  searchWeather(cityName)
  The main flow described in the project spec: show loading, call both
  API endpoints, handle errors, then render everything.

  Parameters: cityName (string)
  Returns: nothing.
  Called from: SearchBar.js (via the onSearch callback) and init()
*/
function searchWeather(cityName) {
  if (weatherState.isLoading) {
    return; // prevents duplicate requests while one is already running
  }

  hideError();
  setLoading(true);
  showLoading();
  setSearchButtonDisabled(true);

  getCurrentWeather(cityName, function (currentError, currentData) {
    if (currentError) {
      handleApiError(currentError);
      return;
    }

    setCurrentWeather(currentData);
    weatherState.city = cityName;

    // Air quality needs coordinates, not a city name, and is allowed to
    // fail quietly (falls back to "N/A") without blocking the rest of the app.
    getAirQuality(currentData.coord.lat, currentData.coord.lon, function (aqiError, aqiData) {
      if (!aqiError && aqiData && aqiData.list && aqiData.list.length > 0) {
        weatherState.airQualityIndex = aqiData.list[0].main.aqi;
      } else {
        weatherState.airQualityIndex = null;
      }

      // Air quality arrives independently of the forecast request, so if
      // the air quality card has already rendered once (with "N/A"),
      // refresh just that card to show the real value once it's ready.
      if (weatherState.currentWeather && document.getElementById("air-quality-container").innerHTML !== "") {
        renderAirQuality();
      }
    });

    getForecast(cityName, function (forecastError, forecastData) {
      setLoading(false);
      hideLoading();
      setSearchButtonDisabled(false);

      if (forecastError) {
        handleApiError(forecastError);
        return;
      }

      setForecastList(forecastData.list);
      setHourlyForecast(buildHourlyForecast(forecastData.list));

      // Try to get a REAL 7-day forecast from One Call 3.0. If that
      // endpoint fails (not subscribed yet, still activating, etc.),
      // fall back to grouping the 3-hour /forecast data we already have,
      // which only covers about 5-6 days but always works.
      getDailyForecast(currentData.coord.lat, currentData.coord.lon, function (dailyError, dailyData) {
        if (!dailyError && dailyData && dailyData.daily) {
          setDailyForecast(buildDailyForecastFromOneCall(dailyData.daily));
        } else {
          setDailyForecast(buildDailyForecast(forecastData.list));
        }

        renderEverything();
      });
    });
  });
}

/*
  handleApiError(errorCode)
  Turns internal error codes (thrown in weatherApi.js) into friendly
  messages, per the "no browser alert, no crashing" requirement.
*/
function handleApiError(errorCode) {
  setLoading(false);
  hideLoading();
  setSearchButtonDisabled(false);

  var message = "Something went wrong. Please try again.";

  if (errorCode === "CITY_NOT_FOUND") {
    message = "City not found. Please check the spelling and try again.";
  } else if (errorCode === "INVALID_API_KEY") {
    message = "Invalid API key. Open js/api/weatherApi.js and add your OpenWeatherMap key.";
  } else if (errorCode === "REQUEST_FAILED") {
    message = "Could not reach the weather service. Check your internet connection.";
  } else if (errorCode === "TypeError: Failed to fetch") {
    message = "Network error. Please check your internet connection.";
  }

  showError(message);
}

/*
  setSearchButtonDisabled(disabled)
  Disables the search button while a request is in flight, so the user
  can't fire off several overlapping requests.
*/
function setSearchButtonDisabled(disabled) {
  var button = document.getElementById("search-button");
  if (button) {
    button.disabled = disabled;
  }
}

/*
  changeUnit(newUnit)
  Called when the user clicks °C or °F. We already have all the data
  we need in weatherState, so we just re-render - no new API call.
*/
function changeUnit(newUnit) {
  setUnit(newUnit);
  renderEverything();
}

/*
  renderEverything()
  Calls every render function, in the same order the sections appear
  on the page.
*/
function renderEverything() {
  renderCurrentWeather();
  renderWeatherStats();
  renderSunriseSunset();
  renderAirQuality();
  renderHourlyForecast();
  renderDailyForecast();
}

function renderCurrentWeather() {
  var container = document.getElementById("current-weather-container");
  container.innerHTML = "";
  container.appendChild(createWeatherCard(weatherState.currentWeather, weatherState.unit));

  // OpenWeatherMap icon codes end in "d" for day or "n" for night
  // (e.g. "01d", "10n"), which is the simplest way to tell which we have.
  var iconCode = weatherState.currentWeather.weather[0].icon;
  var isNight = iconCode.indexOf("n") !== -1;
  var conditionMain = weatherState.currentWeather.weather[0].main;

  setBackgroundCondition(conditionMain, isNight);
}

function renderWeatherStats() {
  var container = document.getElementById("weather-stats-container");
  container.innerHTML = "";
  container.appendChild(createWeatherDetailsCard(weatherState.currentWeather));
}

function renderSunriseSunset() {
  var container = document.getElementById("sunrise-sunset-container");
  container.innerHTML = "";
  var sys = weatherState.currentWeather.sys;
  container.appendChild(createSunriseSunsetCard(sys.sunrise, sys.sunset));
}

function renderAirQuality() {
  var container = document.getElementById("air-quality-container");
  container.innerHTML = "";
  container.appendChild(createAirQualityCard(
    weatherState.currentWeather,
    weatherState.unit,
    weatherState.airQualityIndex
  ));
}

function renderHourlyForecast() {
  var container = document.getElementById("hourly-forecast-container");
  container.innerHTML = "";
  container.appendChild(createHourlyForecastSection(weatherState.hourlyForecast, weatherState.unit));
}

function renderDailyForecast() {
  var container = document.getElementById("daily-forecast-container");
  container.innerHTML = "";
  container.appendChild(createForecastSection(weatherState.dailyForecast, weatherState.unit));
}

/*
  buildHourlyForecast(forecastList)
  The free forecast API returns readings every 3 hours for 5 days.
  We take the next 4 of them (about 12 hours ahead) to fill the
  Hourly Forecast card's 4-tile grid.

  Parameters: forecastList (array) - forecastData.list from the API
  Returns: array of the next 4 forecast entries.
*/
function buildHourlyForecast(forecastList) {
  var hourly = [];
  var count = Math.min(4, forecastList.length);

  for (var i = 0; i < count; i++) {
    hourly.push(forecastList[i]);
  }

  return hourly;
}

/*
  buildDailyForecast(forecastList)
  Groups the 3-hour entries by calendar day and summarizes each day:
  max temp, min temp, an icon/description taken from the midday
  reading, and the highest rain probability seen that day.

  Parameters: forecastList (array) - forecastData.list from the API
  Returns: array of day-summary objects, one per day (usually 5-6),
           each shaped like:
           { date, icon, description, maxTemp, minTemp, rainChance }
*/
function buildDailyForecast(forecastList) {
  var daysByKey = {};
  var orderedKeys = [];

  for (var i = 0; i < forecastList.length; i++) {
    var entry = forecastList[i];
    var entryDate = new Date(entry.dt * 1000);
    var dateKey = getDateKey(entryDate);

    if (!daysByKey[dateKey]) {
      daysByKey[dateKey] = {
        date: entryDate,
        icon: entry.weather[0].icon,
        description: entry.weather[0].description,
        maxTemp: entry.main.temp_max,
        minTemp: entry.main.temp_min,
        rainChance: Math.round((entry.pop || 0) * 100)
      };
      orderedKeys.push(dateKey);
    } else {
      var day = daysByKey[dateKey];

      if (entry.main.temp_max > day.maxTemp) {
        day.maxTemp = entry.main.temp_max;
      }
      if (entry.main.temp_min < day.minTemp) {
        day.minTemp = entry.main.temp_min;
      }

      var entryRainChance = Math.round((entry.pop || 0) * 100);
      if (entryRainChance > day.rainChance) {
        day.rainChance = entryRainChance;
      }

      // Prefer the reading closest to midday for the day's icon/description
      var hour = entryDate.getHours();
      if (hour >= 11 && hour <= 14) {
        day.icon = entry.weather[0].icon;
        day.description = entry.weather[0].description;
      }
    }
  }

  var dailyList = [];
  for (var j = 0; j < orderedKeys.length; j++) {
    dailyList.push(daysByKey[orderedKeys[j]]);
  }

  return dailyList;
}

/*
  buildDailyForecastFromOneCall(dailyArray)
  One Call 3.0's "daily" array already has one entry per day (up to 8),
  so this just reshapes each entry into the same format ForecastCard.js
  expects, and takes the next 7 days.

  Parameters: dailyArray (array) - the "daily" field from getDailyForecast()
  Returns: array of up to 7 day-summary objects, shaped like:
           { date, icon, description, maxTemp, minTemp, rainChance }
*/
function buildDailyForecastFromOneCall(dailyArray) {
  var dailyList = [];
  var count = Math.min(7, dailyArray.length);

  for (var i = 0; i < count; i++) {
    var entry = dailyArray[i];

    dailyList.push({
      date: new Date(entry.dt * 1000),
      icon: entry.weather[0].icon,
      description: entry.weather[0].description,
      maxTemp: entry.temp.max,
      minTemp: entry.temp.min,
      rainChance: Math.round((entry.pop || 0) * 100)
    });
  }

  return dailyList;
}

// Start the app once the HTML is fully parsed.
document.addEventListener("DOMContentLoaded", init);
