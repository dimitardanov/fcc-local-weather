

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
        getWeather();
      },
      errorMsg.showLocationUnavailable);
  } else {
    errorMsg.showLocationUnavailable();
  }


  var getWeather = function () {
    $.ajax({
      url: owm.getURL(),
      data: owm.getQueryData(),
      method: 'GET',
      crossDomain: true,
      jsonp: false,
      dataType: 'json',
      success: function (data, status, jqxhr) {
        console.log(data);
        weatherReport.addWeatherHTML(data);
        flickrAjax.searchFlickrPhotos(data, flickrOpts);
      },
      error: function (jqxhr, status, error) {
        errorMsg.showWeatherUnavailable();
        console.log(jqxhr);
        console.log(status);
        console.log(error);
      },
      complete: function (jqxhr, status) {
        console.log(status);
      }
    });
  };



  $('#weather-today').on('click', '#c-btn, #f-btn', events.c2fButtonToggle);

});
