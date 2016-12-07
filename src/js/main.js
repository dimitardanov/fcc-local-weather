

$(function() {

  var flickrOpts = require('./lib/options/flickr.js');
  var WeatherAjaxData = require('./lib/options/owmAjaxData.js');
  var errorMsg = require('./lib/renderers/errorMessages.js');
  var helpers = require('./lib/helpers/helpers.js');
  var events = require('./lib/helpers/events.js');
  var getWeather = require('./lib/ajax/owmCall.js');
  var flickrAjax = require('./lib/ajax/flickr.js');

  var queryObj = helpers.parseQueryStr();

  var weatherAjaxData = new WeatherAjaxData();
  weatherAjaxData.setAPIKey(queryObj.owm);

  flickrOpts.setAPIKey(queryObj.api_key);

  if ((weatherAjaxData.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        weatherAjaxData.setPosCoords(pos);
        getWeather(weatherAjaxData, flickrOpts);
      },
      errorMsg.showLocationUnavailable);
  } else {
    errorMsg.showLocationUnavailable();
  }

  $('#weather-today').on('click', '#c-btn, #f-btn', events.c2fButtonToggle);

});
