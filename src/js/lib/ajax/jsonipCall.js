

var getLocation = require('./freegeoipCall.js');
var errorMsg = require('../renderers/errorMessages');
var useGeolocation = require('../helpers/geolocation.js').useGeolocation;

var url = 'http://jsonip.com/?callback=?';


function getIP (calls) {
  $.ajax({
    url: url,
    method: 'GET',
    crossDomain: true,
    jsonp: true,
    dataType: 'json',
    success: function (data, status, jqxhr) {
      getLocation(data.ip, calls);
    },
    error: function (jqxhr, status, error) {
      errorMsg.showAjaxLocationUnavailable();
      useGeolocation(calls);
    }
  });
}

module.exports = getIP;
