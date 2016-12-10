
var weatherUnavailable = require('../templates/errorMessageWeatherUnavailable.hbs');
var locationUnavailable = require('../templates/errorMessageLocationUnavailable.hbs');
var $article = $('#weather-today');


function showLocationUnavailable () {
  $article.html(locationUnavailable());
}

function showWeatherUnavailable () {
  $article.html(weatherUnavailable());
}


module.exports = {
  showLocationUnavailable: showLocationUnavailable,
  showWeatherUnavailable: showWeatherUnavailable
};
