
var helpers = require('../helpers/helpers.js');

var absZeroC = -273.15;


function WeatherData (weatherObj) {
  this.data = weatherObj;
}

WeatherData.prototype.constructor = WeatherData;


WeatherData.prototype._getWeatherId = function () {
  return this.data.weather[0].id;
};

WeatherData.prototype.getWeatherIconsClass = function () {
  var prefix = 'wi wi-owm-';
  var dayStr = helpers.determineDaytimeStr(new Date());
  if (dayStr.length > 0) {
    prefix = prefix + dayStr + '-';
  }
  return prefix + this._getWeatherId();
};

WeatherData.prototype.getTown = function () {
  return this.data.name;
};

WeatherData.prototype.getCountryCode = function () {
  return this.data.sys.country;
};

WeatherData.prototype.getTemp = function () {
  var tempK = this.data.main.temp;
  var tempC = Math.round(tempK + absZeroC);
  tempK = Math.round(tempK);
  var tempF = Math.round(helpers.celsius2fahrenheit(tempC));
  return {K: tempK, C: tempC, F: tempF};
};

WeatherData.prototype.getWeatherCoords = function () {
  return {lon: this.data.coord.lon, lat: this.data.coord.lat};
};

WeatherData.prototype.getWeatherDescription = function () {
  return this.data.weather[0].description;
};

WeatherData.prototype.getWeatherString = function () {
  return this.data.weather[0].main.toLowerCase();
};



module.exports = WeatherData;
