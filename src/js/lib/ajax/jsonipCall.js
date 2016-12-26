
var url = 'http://jsonip.com/?callback=?';
var getLocation = require('./freegeoipCall.js');

function getIP () {
  $.ajax({
    url: url,
    method: 'GET',
    crossDomain: true,
    jsonp: true,
    dataType: 'json',
    success: function (data, status, jqxhr) {
      getLocation(data.ip);
    },
    error: function (jqxhr, status, error) {
      console.log('ip cannot be found');
    }
  });
}

module.exports = getIP;
