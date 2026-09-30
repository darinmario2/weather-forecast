/*
  SearchBar.js
  ------------
  Builds the search input + search button as one reusable piece of UI.
  This file does NOT call the weather API itself - it only reports the
  city name the user typed, through the onSearch callback. That keeps
  UI code separate from API code (rule from the project spec).
*/

/*
  createSearchBar(onSearch)
  Parameters:
    onSearch (function) - called with the typed city name (string)
                           when the user clicks "Search" or presses Enter
  Returns: a <div> element containing the input and button.
  Called from: app.js, once, when the page first loads
*/
function createSearchBar(onSearch) {
  var wrapper = document.createElement("div");
  wrapper.className = "search-bar";

  var input = document.createElement("input");
  input.type = "text";
  input.className = "search-input";
  input.placeholder = "Search city...";
  input.setAttribute("aria-label", "Search city");
  input.id = "city-search-input";

  function triggerSearch() {
    var cityName = input.value.trim();
    if (cityName.length > 0) {
      onSearch(cityName);
    }
  }

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      triggerSearch();
    }
  });

  var searchButton = createButton("Search", "btn btn-primary", triggerSearch);
  searchButton.id = "search-button";

  wrapper.appendChild(input);
  wrapper.appendChild(searchButton);

  return wrapper;
}
