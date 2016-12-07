
var weatherReport = require('../renderers/weatherReport.js');
var errorMsg = require('../renderers/errorMessages.js');
var setBgImage = require('./flickrCall.js');
var WeatherData = require('../helpers/owmData.js');


function getWeather (owm, flickrAjaxData) {
  $.ajax({
    url: owm.getURL(),
    data: owm.getQueryData(),
    method: 'GET',
    crossDomain: true,
    jsonp: false,
    dataType: 'json',
    success: function (data, status, jqxhr) {
      console.log(data);
      var weather = new WeatherData(data);
      weatherReport.addWeatherHTML(weather);
      setBgImage(weather, flickrAjaxData);
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
