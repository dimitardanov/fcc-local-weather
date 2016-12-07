
var helpers = require('./helpers.js');

var absZeroC = -273.15;



function _getWeatherIcon (data) {
  return data.weather[0].icon;
}

function _getWeatherId (data) {
  return data.weather[0].id;
}

function getWeatherIconsClass (data) {
  var prefix = 'wi wi-owm-';
  var dayStr = helpers.determineDaytimeStr();
  if (dayStr.length > 0) {
    prefix = prefix + dayStr + '-';
  }
  return prefix + _getWeatherId(data);
}

function getTown (data) {
  return data.name;
}

function getCountryCode (data) {
  return data.sys.country;
}

function getTemp (data) {
  var tempK = data.main.temp;
  var tempC = Math.round(tempK + absZeroC);
  tempK = Math.round(tempK);
  var tempF = Math.round(_celsius2fahrenheit(tempC));
  return {K: tempK, C: tempC, F: tempF};
}

function _celsius2fahrenheit (tempC) {
  return tempC * 1.8 + 32;
}

function getWeatherCoords (data) {
  return {lon: data.coord.lon, lat: data.coord.lat};
}

function getWeatherDescription (data) {
  return data.weather[0].description;
}

function getWeatherString (data) {
  return data.weather[0].main.toLowerCase();
}


module.exports = {
  getWeatherIconsClass: getWeatherIconsClass,
  getTown: getTown,
  getCountryCode: getCountryCode,
  getTemp: getTemp,
  getWeatherCoords: getWeatherCoords,
  getWeatherDescription: getWeatherDescription,
  getWeatherString: getWeatherString
};
