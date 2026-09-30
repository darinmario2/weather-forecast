/*
  backgroundEffect.js
  -------------------
  Draws a "live" background on the fixed <canvas id="weather-background-canvas">
  sitting behind the whole app. What it draws depends on the REAL current
  weather condition, so it's not just decoration:
    - Rain / Drizzle / Thunderstorm -> falling rain streaks
    - Snow                          -> falling snowflakes
    - Clear, at night               -> twinkling stars
    - Anything else (clouds, mist,
      clear daytime, unknown)        -> a few large, slow-drifting soft clouds

  This file only draws on the canvas - it doesn't know anything about the
  rest of the app. app.js calls setBackgroundCondition() once the real
  weather data arrives.

  Respecting motion preferences: if the user's system has "reduce motion"
  turned on, we skip the animation loop entirely and just draw one still
  frame, instead of animating indefinitely.
*/

var backgroundCanvas = null;
var backgroundContext = null;
var backgroundParticles = [];
var currentEffectType = "clouds"; // "rain", "snow", "stars", or "clouds"
var animationFrameId = null;

/*
  initBackgroundEffect()
  Sets up the canvas to fill the screen and starts the animation loop.
  Call this once when the page loads.
*/
function initBackgroundEffect() {
  backgroundCanvas = document.getElementById("weather-background-canvas");
  if (!backgroundCanvas) {
    return; // safety check - do nothing if the canvas isn't on the page
  }

  backgroundContext = backgroundCanvas.getContext("2d");

  resizeBackgroundCanvas();
  window.addEventListener("resize", resizeBackgroundCanvas);

  buildParticles("clouds");
  startAnimationLoop();
}

/*
  resizeBackgroundCanvas()
  Keeps the canvas the same size as the browser window.
*/
function resizeBackgroundCanvas() {
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
}

/*
  setBackgroundCondition(conditionMain, isNight)
  Called from app.js whenever new weather data arrives. Decides which
  effect to show and rebuilds the particle list for it.

  Parameters:
    conditionMain (string) - weatherData.weather[0].main, e.g. "Rain",
                              "Clouds", "Clear", "Snow", "Thunderstorm"
    isNight (boolean) - true if it's currently night at that location
  Returns: nothing.
  Called from: app.js, in renderCurrentWeather()
*/
function setBackgroundCondition(conditionMain, isNight) {
  var effectType = "clouds";

  if (conditionMain === "Rain" || conditionMain === "Drizzle" || conditionMain === "Thunderstorm") {
    effectType = "rain";
  } else if (conditionMain === "Snow") {
    effectType = "snow";
  } else if (conditionMain === "Clear" && isNight) {
    effectType = "stars";
  } else {
    effectType = "clouds";
  }

  if (effectType === currentEffectType) {
    return; // already showing the right effect, no need to rebuild it
  }

  currentEffectType = effectType;
  buildParticles(effectType);
}

/*
  buildParticles(effectType)
  Creates a fresh array of particle objects for the given effect type.
  Each particle is a plain object with just the properties that type
  needs (position, speed, size).
*/
function buildParticles(effectType) {
  backgroundParticles = [];

  var width = backgroundCanvas.width;
  var height = backgroundCanvas.height;

  if (effectType === "rain") {
    var rainCount = 120;
    for (var i = 0; i < rainCount; i++) {
      backgroundParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 12 + Math.random() * 14,
        speed: 6 + Math.random() * 6
      });
    }
  } else if (effectType === "snow") {
    var snowCount = 90;
    for (var j = 0; j < snowCount; j++) {
      backgroundParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 2.5,
        speed: 0.6 + Math.random() * 1.2,
        drift: Math.random() * 2 - 1
      });
    }
  } else if (effectType === "stars") {
    var starCount = 90;
    for (var k = 0; k < starCount; k++) {
      backgroundParticles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7, // keep stars in the upper sky
        radius: 0.6 + Math.random() * 1.4,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  } else {
    // "clouds" - a handful of large, soft, slow-moving shapes
    var cloudCount = 5;
    for (var m = 0; m < cloudCount; m++) {
      backgroundParticles.push({
        x: Math.random() * width,
        y: 40 + Math.random() * (height * 0.4),
        radius: 90 + Math.random() * 90,
        speed: 0.15 + Math.random() * 0.15
      });
    }
  }
}

/*
  startAnimationLoop()
  Runs drawFrame() repeatedly using requestAnimationFrame. If the user
  prefers reduced motion, we draw exactly one frame and stop, instead
  of animating forever.
*/
function startAnimationLoop() {
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    drawFrame();
    return;
  }

  function loop() {
    drawFrame();
    animationFrameId = window.requestAnimationFrame(loop);
  }

  loop();
}

/*
  drawFrame()
  Clears the canvas and draws every particle in its current position,
  then moves each particle for the next frame. Which drawing code runs
  depends on currentEffectType.
*/
function drawFrame() {
  var width = backgroundCanvas.width;
  var height = backgroundCanvas.height;

  backgroundContext.clearRect(0, 0, width, height);

  if (currentEffectType === "rain") {
    drawRain(width, height);
  } else if (currentEffectType === "snow") {
    drawSnow(width, height);
  } else if (currentEffectType === "stars") {
    drawStars();
  } else {
    drawClouds(width);
  }
}

function drawRain(width, height) {
  backgroundContext.strokeStyle = "rgba(180, 210, 255, 0.35)";
  backgroundContext.lineWidth = 1.5;

  for (var i = 0; i < backgroundParticles.length; i++) {
    var drop = backgroundParticles[i];

    backgroundContext.beginPath();
    backgroundContext.moveTo(drop.x, drop.y);
    backgroundContext.lineTo(drop.x, drop.y + drop.length);
    backgroundContext.stroke();

    drop.y += drop.speed;

    if (drop.y > height) {
      drop.y = -drop.length;
      drop.x = Math.random() * width;
    }
  }
}

function drawSnow(width, height) {
  backgroundContext.fillStyle = "rgba(255, 255, 255, 0.75)";

  for (var i = 0; i < backgroundParticles.length; i++) {
    var flake = backgroundParticles[i];

    backgroundContext.beginPath();
    backgroundContext.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    backgroundContext.fill();

    flake.y += flake.speed;
    flake.x += flake.drift * 0.3;

    if (flake.y > height) {
      flake.y = -flake.radius;
      flake.x = Math.random() * width;
    }
  }
}

function drawStars() {
  var nowSeconds = Date.now() / 1000;

  for (var i = 0; i < backgroundParticles.length; i++) {
    var star = backgroundParticles[i];

    // Twinkle by varying opacity with a sine wave over time
    var twinkle = 0.5 + 0.5 * Math.sin(nowSeconds * star.twinkleSpeed + star.twinkleOffset);
    var opacity = 0.3 + twinkle * 0.7;

    backgroundContext.fillStyle = "rgba(255, 255, 255, " + opacity.toFixed(2) + ")";
    backgroundContext.beginPath();
    backgroundContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    backgroundContext.fill();
  }
}

function drawClouds(width) {
  backgroundContext.fillStyle = "rgba(255, 255, 255, 0.035)";

  for (var i = 0; i < backgroundParticles.length; i++) {
    var cloud = backgroundParticles[i];

    backgroundContext.beginPath();
    backgroundContext.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    backgroundContext.fill();

    cloud.x += cloud.speed;

    if (cloud.x - cloud.radius > width) {
      cloud.x = -cloud.radius;
    }
  }
}
