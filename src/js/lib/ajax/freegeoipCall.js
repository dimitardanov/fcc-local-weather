
var FlickrAjaxData = require('../data/flickrAjaxData.js');
var WeatherAjaxData = require('../data/owmAjaxData.js');
var getWeather = require('./owmCall.js');
var url = 'http://freegeoip.net/json/';


var weatherAjaxData = new WeatherAjaxData();
var flickrAjaxData = new FlickrAjaxData();


function getLocation (ip) {
  $.ajax({
    url: url + ip,
    method: 'GET',
    crossDomain: true,
    jsonp: false,
    dataType: 'json',
    success: function (data, status, jqxhr) {
      var position = {
        coords: {
          latitude: data.latitude,
          longitude: data.longitude
      }};

      weatherAjaxData.setPosCoords(position);
      getWeather(weatherAjaxData, flickrAjaxData);
    }
  });
}

module.exports = getLocation;
