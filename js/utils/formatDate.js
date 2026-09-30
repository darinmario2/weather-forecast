/*
  formatDate.js
  -------------
  Pure functions for turning raw dates/timestamps into readable text.
*/

var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/*
  formatFullDate(date)
  Parameters: date (JavaScript Date object)
  Returns: a string like "Wednesday, 23 Sep" for the current-weather card.
*/
function formatFullDate(date) {
  var dayName = DAY_NAMES[date.getDay()];
  var day = date.getDate();
  var month = MONTH_NAMES[date.getMonth()];
  return dayName + ", " + day + " " + month;
}

/*
  formatShortDay(date)
  Returns just the weekday name, e.g. "Mon". Used on daily forecast cards.
*/
function formatShortDay(date) {
  var fullName = DAY_NAMES[date.getDay()];
  return fullName.substring(0, 3);
}

/*
  formatShortDate(date)
  Returns something like "23 Sep" for daily forecast cards.
*/
function formatShortDate(date) {
  var day = date.getDate();
  var month = MONTH_NAMES[date.getMonth()];
  return day + " " + month;
}

/*
  getDateKey(date)
  Returns a string like "2026-09-23" used to group 3-hour forecast
  entries into calendar days.
*/
function getDateKey(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  if (month < 10) { month = "0" + month; }
  if (day < 10) { day = "0" + day; }

  return year + "-" + month + "-" + day;
}
