
var weatherUnavailable = require('../templates/errorMessageWeatherUnavailable.hbs');
var locationUnavailable = require('../templates/errorMessageLocationUnavailable.hbs');
var ajaxLocationUnavailable = require('../templates/errorMessageAjaxLocationUnavailable.hbs');
var $article = $('#weather-today');


function showLocationUnavailable () {
  $article.html(locationUnavailable());
}

function showWeatherUnavailable () {
  $article.html(weatherUnavailable());
}

function showAjaxLocationUnavailable () {
  $article.html(ajaxLocationUnavailable());
}


module.exports = {
  showLocationUnavailable: showLocationUnavailable,
  showWeatherUnavailable: showWeatherUnavailable,
  showAjaxLocationUnavailable: showAjaxLocationUnavailable
};
