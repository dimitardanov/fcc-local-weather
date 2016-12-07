
var absZeroC = -273.15;

function determineDayOrNight (data) {
  var dayStr = '';
  var icon = _getWeatherIcon(data);
  if (typeof icon !== 'string' || icon.length === 0) {
    return dayStr;
  }
  var lastIconChar = icon[icon.length -1];
  if (lastIconChar === 'd') {
    dayStr = 'day';
  } else if (lastIconChar === 'n') {
    dayStr = 'night';
  }
  return dayStr;
}

function _getWeatherIcon (data) {
  return data.weather[0].icon;
}

function _getWeatherId (data) {
  return data.weather[0].id;
}

function getWeatherIconsClass (data) {
  var prefix = 'wi wi-owm-';
  var dayStr = determineDayOrNight(data);
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
  determineDayOrNight: determineDayOrNight,
  getWeatherIconsClass: getWeatherIconsClass,
  getTown: getTown,
  getCountryCode: getCountryCode,
  getTemp: getTemp,
  getWeatherCoords: getWeatherCoords,
  getWeatherDescription: getWeatherDescription,
  getWeatherString: getWeatherString
};
