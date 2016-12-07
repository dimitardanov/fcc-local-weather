
var weatherReport = require('../renderers/weatherReport.js');
var errorMsg = require('../renderers/errorMessages.js');
var flickrAjax = require('./flickr.js');

function getWeather (owm, flickrOpts) {
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
}


module.exports = getWeather;
