/*
  SunriseSunset.js
  ----------------
  Builds the "Sunrise & Sunset" glass card: a horizontal progress bar
  from sunrise to sunset, with a dot marking roughly where we are in
  the day right now, plus the total daylight length.
*/

/*
  createSunriseSunsetCard(sunriseUnix, sunsetUnix)
  Parameters:
    sunriseUnix (number) - sys.sunrise from getCurrentWeather()
    sunsetUnix (number) - sys.sunset from getCurrentWeather()
  Returns: a <div class="glass-card"> element.
  Called from: app.js, in renderSunriseSunset()
*/
function createSunriseSunsetCard(sunriseUnix, sunsetUnix) {
  var card = document.createElement("div");
  card.className = "glass-card";

  var title = document.createElement("div");
  title.className = "card-title";
  title.textContent = "Sunrise & Sunset";

  var labelsRow = document.createElement("div");
  labelsRow.className = "sun-progress-labels";
  labelsRow.style.marginTop = "0.9rem";
  labelsRow.innerHTML =
    '<div><div class="sun-progress-time">' + formatTime(sunriseUnix) + '</div>' +
    '<div class="sun-progress-label">Sunrise</div></div>' +
    '<div style="text-align:right"><div class="sun-progress-time">' + formatTime(sunsetUnix) + '</div>' +
    '<div class="sun-progress-label">Sunset</div></div>';

  var track = document.createElement("div");
  track.className = "sun-progress-track";

  var progress = calculateDayProgress(sunriseUnix, sunsetUnix);

  var fill = document.createElement("div");
  fill.className = "sun-progress-fill";
  fill.style.width = (progress * 100) + "%";

  var dot = document.createElement("div");
  dot.className = "sun-progress-dot";
  dot.style.left = (progress * 100) + "%";

  track.appendChild(fill);
  track.appendChild(dot);

  var daylightLength = document.createElement("div");
  daylightLength.className = "sun-daylight-length";
  daylightLength.textContent = formatDaylightLength(sunriseUnix, sunsetUnix) + " of daylight";

  card.appendChild(title);
  card.appendChild(labelsRow);
  card.appendChild(track);
  card.appendChild(daylightLength);

  return card;
}

/*
  calculateDayProgress(sunriseUnix, sunsetUnix)
  Returns a number from 0 to 1 representing how far through the
  daylight hours the current time is (0 = sunrise, 1 = sunset).
*/
function calculateDayProgress(sunriseUnix, sunsetUnix) {
  var nowSeconds = Math.floor(Date.now() / 1000);
  var dayLength = sunsetUnix - sunriseUnix;
  var elapsed = nowSeconds - sunriseUnix;

  var progress = elapsed / dayLength;
  if (progress < 0) { progress = 0; }
  if (progress > 1) { progress = 1; }

  return progress;
}

/*
  formatDaylightLength(sunriseUnix, sunsetUnix)
  Returns a string like "12 hr 34 min" for the total length of daylight.
*/
function formatDaylightLength(sunriseUnix, sunsetUnix) {
  var totalMinutes = Math.round((sunsetUnix - sunriseUnix) / 60);
  var hours = Math.floor(totalMinutes / 60);
  var minutes = totalMinutes % 60;

  return hours + " hr " + minutes + " min";
}
