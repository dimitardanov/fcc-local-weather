

$(function() {

  var FlickrAjaxData = require('./lib/options/flickrAjaxData.js');
  var WeatherAjaxData = require('./lib/options/owmAjaxData.js');
  var errorMsg = require('./lib/renderers/errorMessages.js');
  var helpers = require('./lib/helpers/helpers.js');
  var events = require('./lib/helpers/events.js');
  var getWeather = require('./lib/ajax/owmCall.js');

  var queryObj = helpers.parseQueryStr();

  var weatherAjaxData = new WeatherAjaxData();
  weatherAjaxData.setAPIKey(queryObj.owm);

  var flickrAjaxData = new FlickrAjaxData();
  flickrAjaxData.setAPIKey(queryObj.api_key);

  if ((weatherAjaxData.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        weatherAjaxData.setPosCoords(pos);
        getWeather(weatherAjaxData, flickrAjaxData);
      },
      errorMsg.showLocationUnavailable);
  } else {
    errorMsg.showLocationUnavailable();
  }

  $('#weather-today').on('click', '#c-btn, #f-btn', events.c2fButtonToggle);

});
