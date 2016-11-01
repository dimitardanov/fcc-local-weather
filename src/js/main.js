

$(function() {
  var $article = $('#weather-today');
  var openWeatherMapURL = 'http://api.openweathermap.org/data/2.5/weather?';
  var openWeatherMapAPIKey = window.location.search.slice(5);
  var wData = {};
  var absZeroC = -273.15;


  var getWeather = function (pos) {
    $.ajax({
      url: openWeatherMapURL,
      data: {
        lon: pos.coords.longitude,
        lat: pos.coords.latitude,
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
    var $icon = $('<i></i>', {'class': 'wi wi-refresh'});
    $holder.append($icon);
    var $temp = $('<span></span>').html(Math.round(getTemp(data).C) + '&deg;');
    var $deg = $('<span>C</span>');
    $holder.append($temp);
    $holder.append($deg);
    return $holder;
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
    navigator.geolocation.getCurrentPosition(getWeather);
  } else {
    $article.html($('<div></div>', {'class': 'alert alert-warning text-center'}).text('The sun will shine this night, expect a full moon at noon ').append($('<strong></strong>').text(':)')));
  }


});
