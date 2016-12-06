

$(function() {

  var flickrOpts = require('./lib/options/flickr.js');
  var owm = require('./lib/options/openWeatherMap.js');
  var flickrHelpers = require('./lib/helpers/flickr.js');
  var owmHelpers = require('./lib/helpers/openWeatherMap.js');
  var creditsRenderer = require('./lib/renderers/credits.js');
  var bgPhoto = require('./lib/renderers/bgPhoto.js');
  var weatherReport = require('./lib/renderers/weatherReport.js');
  var errorMsg = require('./lib/renderers/errorMessages.js');
  var helpers = require('./lib/helpers/helpers.js');
  var events = require('./lib/helpers/events.js');
  var weatherAjax = require('./lib/ajax/openWeatherMap.js');
  var flickrAjax = require('./lib/ajax/flickr.js');




  var queryObj = helpers.parseQueryStr();
  owm.setAPIKey(queryObj.owm);
  flickrOpts.setAPIKey(queryObj.api_key);

  if ((owm.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        owm.setCoords(pos.coords.longitude, pos.coords.latitude);
        weatherAjax.getWeather(owm, flickrOpts);
      },
      errorMsg.showLocationUnavailable);
  } else {
    errorMsg.showLocationUnavailable();
  }


  $('#weather-today').on('click', '#c-btn, #f-btn', events.c2fButtonToggle);

});
