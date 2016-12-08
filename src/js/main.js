

$(function() {

  var FlickrAjaxData = require('./lib/data/flickrAjaxData.js');
  var WeatherAjaxData = require('./lib/data/owmAjaxData.js');
  var errorMsg = require('./lib/renderers/errorMessages.js');
  var getWeather = require('./lib/ajax/owmCall.js');


  var weatherAjaxData = new WeatherAjaxData();
  var flickrAjaxData = new FlickrAjaxData();


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


});
