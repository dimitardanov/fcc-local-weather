

$(function() {

  var flickrOpts = require('./lib/options/flickr.js');
  var WeatherData = require('./lib/options/owmAjaxData.js');
  var errorMsg = require('./lib/renderers/errorMessages.js');
  var helpers = require('./lib/helpers/helpers.js');
  var events = require('./lib/helpers/events.js');
  var weatherAjax = require('./lib/ajax/openWeatherMap.js');
  var flickrAjax = require('./lib/ajax/flickr.js');

  var queryObj = helpers.parseQueryStr();

  var weatherData = new WeatherData();
  weatherData.setAPIKey(queryObj.owm);

  flickrOpts.setAPIKey(queryObj.api_key);

  if ((weatherData.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        weatherData.setPosCoords(pos);
        weatherAjax.getWeather(weatherData, flickrOpts);
      },
      errorMsg.showLocationUnavailable);
  } else {
    errorMsg.showLocationUnavailable();
  }

  $('#weather-today').on('click', '#c-btn, #f-btn', events.c2fButtonToggle);

});
