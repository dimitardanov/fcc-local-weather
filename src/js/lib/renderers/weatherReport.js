
var weatherReport = require('../templates/weatherReport.hbs');
var $article = $('#weather-today');


function addWeatherHTML (weather) {
  var data = {
    town: weather.getTown(),
    countryCode: weather.getCountryCode(),
    weatherDescription: weather.getWeatherDescription(),
    temp: weather.getTemp(),
    weatherIconClass: weather.getWeatherIconsClass()
  };
  $article.html(weatherReport(data));
}


module.exports = {
  addWeatherHTML: addWeatherHTML
};
