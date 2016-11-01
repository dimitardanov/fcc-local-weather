
var weatherIconsMapping = require('./lib/weathericons.js');

$(function() {
  var $article = $('#weather-today');
  var location = {
    lon: 0,
    lat: 0
  };
  var openWeatherMapURL = 'http://api.openweathermap.org/data/2.5/weather?';
  var openWeatherMapAPIKey = window.location.search.slice(5);
  var wData = {};
  var absZeroC = -273.15;


  var getWeather = function () {
    $.ajax({
      url: openWeatherMapURL,
      data: {
        lon: location.lon,
        lat: location.lat,
        APPID: openWeatherMapAPIKey
      },
      method: 'GET',
      crossDomain: true,
      jsonp: false,
      dataType: 'json',
      success: function (data, status, jqxhr) {
        wData = data;
        addWeatherHTML(wData);
      },
      error: function (jqxhr, status, error) {
        console.log(jqxhr);
        console.log(status);
        console.log(error);
      },
      complete: function (jqxhr, status) {
        console.log(jqxhr);
        console.log(status);
      }
    });
  };

  var addWeatherHTML = function (data) {
    var $locationHTML = createLocationHTML(data);
    var $weatherInfoHTML = createWeatherInfoHTML(data);
    $article.html($locationHTML);
    $article.append($weatherInfoHTML);
  };

  var createLocationHTML = function (data) {
    var $locHTML = $('<h2></h2>',
        {'class': 'text-center'}).text(getTown(data));
    $locHTML.append($('<small></small>').text(', ' + getCountryCode(data)));
    return $locHTML;
  };

  var createWeatherInfoHTML = function (data) {
    var $holder = $('<div></div>', {'class': 'text-center lead'});
    var $icon = $('<i></i>', {'class': getWeatherIconsClass(data)});
    $holder.append($icon);
    var $temp = $('<span></span>', {'class': 'wi'}).text(' ' + Math.round(getTemp(data).C) + ' ');
    var $deg = $('<i></i>', {'class': 'wi wi-celsius'});
    $holder.append($temp);
    $holder.append($deg);
    return $holder;
  };

  var getWeatherIconsClass = function (data) {
    var code = getWeatherId(data);
    var prefix = 'wi wi-';
    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
      prefix = prefix + 'day-';
    }
    return prefix + weatherIconsMapping[code.toString(10)].icon;
  };

  var getTown = function (data) {
    return data.name;
  };

  var getCountryCode = function (data) {
    return data.sys.country;
  };

  var getTemp = function(data) {
    var tempK = data.main.temp;
    var tempC = tempK + absZeroC;
    var tempF = celsius2fahrenheit(tempC);
    return {K: tempK, C: tempC, F: tempF};
  };

  var celsius2fahrenheit = function (tempC) {
    return tempC * 1.8 + 32;
  };

  var getWeatherIcon = function (data) {
    return data.weather.icon;
  };

  var getWeatherDescription = function (data) {
    return data.weather.description;
  };

  var getWeatherString = function (data) {
    return data.weather.main.toLowerCase();
  };

  var getWeatherId = function (data) {
    return data.weather[0].id;
  };


  if ((openWeatherMapAPIKey.length>0) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(function (position) {
      location.lat = position.coords.latitude;
      location.lon = position.coords.longitude;
      getWeather();
    });
  } else {
    $article.html($('<div></div>', {'class': 'alert alert-warning text-center'}).text('The sun will shine this night, expect a full moon at noon ').append($('<strong></strong>').text(':)')));
  }


});
