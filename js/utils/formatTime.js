/*
  formatTime.js
  -------------
  Turns Unix timestamps (seconds since 1970, the format OpenWeatherMap
  uses) into readable clock times like "6:02 AM".
*/

/*
  formatTime(unixTimestampSeconds)
  Parameters: unixTimestampSeconds (number) - e.g. sunrise/sunset/dt fields
  Returns: a string like "6:02 AM"
  Called from: SunriseSunset.js, HourlyForecast.js
*/
function formatTime(unixTimestampSeconds) {
  var date = new Date(unixTimestampSeconds * 1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();

  var period = "AM";
  if (hours >= 12) {
    period = "PM";
  }

  var displayHours = hours % 12;
  if (displayHours === 0) {
    displayHours = 12;
  }

  var displayMinutes = minutes;
  if (displayMinutes < 10) {
    displayMinutes = "0" + displayMinutes;
  }

  return displayHours + ":" + displayMinutes + " " + period;
}

/*
  formatHourLabel(unixTimestampSeconds)
  Returns a compact label for hourly forecast cards, e.g. "3 PM".
*/
function formatHourLabel(unixTimestampSeconds) {
  var date = new Date(unixTimestampSeconds * 1000);
  var hours = date.getHours();

  var period = "AM";
  if (hours >= 12) {
    period = "PM";
  }

  var displayHours = hours % 12;
  if (displayHours === 0) {
    displayHours = 12;
  }

  return displayHours + " " + period;
}
