
var weatherReport = require('../renderers/weatherReport.js');
var errorMsg = require('../renderers/errorMessages.js');
var setBgImage = require('./flickrCall.js');


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
      weatherReport.addWeatherHTML(data);
      setBgImage(data, flickrAjaxData);
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
