# Weatherly — Weather Prediction Web App

A responsive weather dashboard built with plain HTML5, CSS3 and vanilla
JavaScript (no frameworks), using the OpenWeatherMap API.

## Features

- Search weather by city
- Current weather: temperature, condition, feels-like, high/low
- Weather statistics: humidity, wind speed, pressure, visibility, cloudiness
- Sunrise / sunset times
- Hourly forecast (next 24 hours, in 3-hour steps)
- 5-day forecast
- Celsius / Fahrenheit toggle (no extra API call needed)
- Loading and friendly error states
- Fully responsive: desktop, tablet, mobile
- Built from small, reusable JavaScript components

## Design

The UI is a glassmorphism dashboard: a deep navy backdrop (built from
CSS gradients, no image file needed) with every category in its own
frosted-glass card - current weather, stats, sunrise/sunset, air
quality, hourly forecast, and the 5-day forecast are all visually
separate boxes rather than one long page.

- **Sunrise/sunset** is a progress bar from sunrise to sunset with a
  dot showing roughly where we are in the day right now, plus total
  daylight length (`SunriseSunset.js`).
- **Air Quality** is its own card, using real data from OpenWeatherMap's
  free Air Pollution endpoint, alongside dew point and cloudiness
  (`AirQualityCard.js`).
- Fonts load from Google Fonts (Inter) by default. For a fully
  offline/self-hosted version, download the font files and swap the
  `<link>` tags in `index.html` for local `@font-face` rules in `variables.css`.
- The weather icons are still OpenWeatherMap's stock icon set. A fully
  custom icon set to match the glass aesthetic exactly would be a
  separate, focused task if you want to take it further.
- **The background is "live"**: a fixed `<canvas>` behind everything
  (`js/effects/backgroundEffect.js`) draws falling rain, snow, twinkling
  stars, or slow drifting clouds depending on the *real* current
  condition and time of day, and the page background gradient itself
  slowly drifts (`skyDrift` in `css/layout.css`). Both are skipped if the
  visitor's system has "reduce motion" turned on.

## Technologies Used

- HTML5
- CSS3 (custom properties, flexbox, grid, glassmorphism)
- Vanilla JavaScript (`document.createElement`, event listeners, `fetch`)
- [OpenWeatherMap API](https://openweathermap.org/api) (free tier)

## Folder Structure

```
weather-app/
├── index.html
├── css/
│   ├── style.css        (imports the files below, in order)
│   ├── variables.css     (colors, spacing, radius, shadows)
│   ├── layout.css        (page structure, grid/flex)
│   ├── components.css    (buttons, cards, search bar, etc.)
│   └── responsive.css    (media queries)
├── js/
│   ├── app.js             (main app logic, loaded last)
│   ├── api/
│   │   ├── weatherApi.js       (all network requests)
│   │   ├── config.js           (your real key — gitignored)
│   │   └── config.example.js   (placeholder template, committed)
│   ├── components/        (one file per reusable UI piece)
│   ├── utils/              (pure formatting/helper functions)
│   └── state/
│       └── weatherState.js (single shared state object)
└── README.md
```

## API Setup

1. Create a free account at https://openweathermap.org/api
2. Go to your account's **API keys** tab and copy your key.
3. In `js/api/`, copy `config.example.js` to a new file named `config.js`
   (same folder). `config.js` is already listed in `.gitignore`, so it
   will never be committed or pushed to GitHub.
4. Open your new `config.js` and replace the placeholder:
   ```js
   var API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE";
   ```
   with your real key.
5. New keys can take up to a couple of hours to activate — if you see
   an "Invalid API key" error right after signing up, that's normal;
   try again later.

**Pushing to GitHub:** because this is a plain client-side app with no
backend, whatever key ends up in the browser is technically visible to
anyone (view-source, network tab) once the site is *deployed* — the
`.gitignore` setup above only keeps it out of your *repository history*.
That's fine for a free-tier student project, but don't reuse a
paid/rate-limited key this way for anything public-facing.

This app uses these endpoints:
- `/data/2.5/weather` — current weather (free, no setup needed)
- `/data/2.5/forecast` — 5 day / 3 hour forecast, used for the hourly
  row and as a fallback daily forecast (free, no setup needed)
- `/data/2.5/air_pollution` — air quality (free, no setup needed)
- `/data/3.0/onecall` — **for a real 7-day forecast.** This is a
  separate product: go to https://home.openweathermap.org/subscriptions
  and subscribe to **"One Call by Call"** (uses your same key). It's
  free up to 1,000 calls/day — set a call limit there to guarantee you're
  never charged. If you skip this step, the app still works: it falls
  back to showing the ~5-6 days it can build from the `/forecast`
  endpoint above instead of a true 7 days.

Note: the free tier does not include a UV index, so that card shows
"N/A". Getting live UV data requires OpenWeatherMap's paid "One Call" API.

## How to Run

No build tools or server required.

1. Download/clone this folder.
2. Add your API key (see above).
3. Open `index.html` directly in your browser, **or** for the best
   experience serve it locally, e.g. with VS Code's "Live Server"
   extension, or:
   ```bash
   npx serve weather-app
   ```

## How the App Works (short version)

1. `app.js` builds the search bar and unit toggle, then loads a default
   city.
2. Typing a city and pressing Search/Enter calls `searchWeather()`.
3. It shows the loading spinner, then calls `getCurrentWeather()` and
   `getForecast()` from `js/api/weatherApi.js`.
4. Results are saved into the shared `weatherState` object.
5. `renderEverything()` calls each component function to rebuild the
   current weather card, detail cards, sunrise/sunset card, hourly row
   and 5-day grid from that state.
6. Switching °C/°F just re-renders with the same stored data — no new
   network request.

## Future Improvements

- Geolocation ("use my current location") button
- Search suggestions/autocomplete
- Save favorite cities in `localStorage`
- Dark/light theme toggle
- Real UV index via a paid API tier
