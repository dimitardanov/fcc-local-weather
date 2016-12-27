

var errorMsg = require('../renderers/errorMessages');
var geoloc = require('../helpers/geolocation.js');

var url = 'http://freegeoip.net/json/';


function getLocation (ip, calls) {
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
        }
      };
      geoloc.fetchWeather(position, calls);
    },
    error: function () {
      errorMsg.showAjaxLocationUnavailable();
      geoloc.useGeolocation(calls);
    }
  });
}

module.exports = getLocation;
