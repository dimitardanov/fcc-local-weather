

var $article = $('#weather-today');


function showLocationUnavailable () {
  var $alert = $('<div></div>', {'class': 'alert alert-warning text-center'});
  var $joke = $('<p></p>').text('I guess the sun will shine tonight, expect a full moon at noon ').append($('<strong></strong>').text(':)'));
  var $msg = $('<p></p>').text('Location, location, location, are you under cover?');
  $alert.append($msg);
  $alert.append($joke);
  $article.html($alert);
}

function showWeatherUnavailable () {
  $article.html($('<div></div>', {'class': 'alert alert-warning'}).text('Can\'t fetch the weather, plase try again.'));
}


module.exports = {
  showLocationUnavailable: showLocationUnavailable,
  showWeatherUnavailable: showWeatherUnavailable
};
