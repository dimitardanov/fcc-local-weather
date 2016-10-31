
$(function() {
  var $article = $('#weather-today');
  var location = {
    lon: 135,
    lat: 45
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
        console.log(data);
        console.log(status);
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

  var getTown = function (data) {
    return data.name;
  };

  var getCountryCode = function (data) {
    return data.sys.country;
  };

  var celsius2fahrenheit = function (tempC) {
    return tempC * 1.8 + 32;
  };

  if (openWeatherMapAPIKey.length>0) {
    getWeather();
  } else {
    $article.html($('<div></div>', {'class': 'alert alert-warning text-center'}).text('The sun will shine this night, expect a full moon at noon ').append($('<strong></strong>').text(':)')));
  }


});
