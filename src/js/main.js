

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
    var $weatherDescription = createWeatherDescriptionHTML(data);
    $article.html($locationHTML);
    $article.append($weatherDescription);
    $article.append($weatherInfoHTML);
  };

  var createLocationHTML = function (data) {
    var $locHTML = $('<h2></h2>',
        {'class': 'text-center'}).text(' ' + getTown(data) + ', ');
    $locHTML.append($('<small></small>').text(getCountryCode(data)));
    $locHTML.prepend($('<i></i>',
        {'class': getWeatherIconsClass(data)}));
    return $locHTML;
  };

  var createWeatherInfoHTML = function (data) {
    var $holder = $('<section></section>', {'class': 'temp text-center'});
    var $temp = $('<span></span>',
        {'class': 'temp-val', id: 'temp-val'}).text(getTemp(data).C);
    var $deg = createC2FSwitchHTML(data);
    $holder.append($('<i></i>', {'class': 'wi wi-thermometer temp-icon'}));
    $holder.append($temp);
    $holder.append($deg);
    return $holder;
  };

  var createC2FSwitchHTML = function (data) {
    var temps = getTemp(data);
    var $btnGrp = $('<div></div>',
        {'class': 'btn-group', role: 'group'});
    var $cBtn = $('<button></button>',
        {'class': 'btn btn-primary', type: 'button', id: 'c-btn'})
        .text('C');
    var $fBtn = $('<button></button>',
        {'class': 'btn btn-default', type: 'button', id: 'f-btn'})
        .text('F');
    $cBtn.data({'temp-val': temps.C, 'other-btn': '#f-btn'});
    $fBtn.data({'temp-val': temps.F, 'other-btn': '#c-btn'});
    $btnGrp.append($cBtn);
    $btnGrp.append($fBtn);
    return $btnGrp;
  };

  var createWeatherDescriptionHTML = function (data) {
    var $desc = $('<p></p>',
        {'class': 'text-center small weather-description'});
    $desc.text(getWeatherDescription(data));
    return $desc;
  };

  var getWeatherIconsClass = function (data) {
    var prefix = 'wi wi-owm-';
    var dayStr = determineDayOrNight(data);
    if (dayStr.length === 1) {
      prefix = prefix + dayStr + '-';
    }
    return prefix + getWeatherId(data);
  };


  var determineDayOrNight = function (data) {
    var dayStr = '';
    var icon = getWeatherIcon(data);
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
  };


  var getTown = function (data) {
    return data.name;
  };

  var getCountryCode = function (data) {
    return data.sys.country;
  };

  var getTemp = function(data) {
    var tempK = data.main.temp;
    var tempC = Math.round(tempK + absZeroC);
    tempK = Math.round(tempK);
    var tempF = celsius2fahrenheit(tempC);
    return {K: tempK, C: tempC, F: tempF};
  };

  var celsius2fahrenheit = function (tempC) {
    return tempC * 1.8 + 32;
  };

  var getWeatherIcon = function (data) {
    return data.weather[0].icon;
  };

  var getWeatherDescription = function (data) {
    return data.weather[0].description;
  };

  var getWeatherString = function (data) {
    return data.weather[0].main.toLowerCase();
  };

  var getWeatherId = function (data) {
    return data.weather[0].id;
  };

  $('#weather-today').on('click', '#c-btn, #f-btn', function(e) {
    var $this = $(e.target);
    var $other = $($this.data('other-btn'));
    $('#temp-val').text($this.data('temp-val'));
    $this.removeClass('btn-default')
         .addClass('btn-primary');
    $other.addClass('btn-default')
          .removeClass('btn-primary');
  });

  if ((openWeatherMapAPIKey.length>0) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(getWeather);
  } else {
    $article.html($('<div></div>', {'class': 'alert alert-warning text-center'}).text('The sun will shine this night, expect a full moon at noon ').append($('<strong></strong>').text(':)')));
  }


});
