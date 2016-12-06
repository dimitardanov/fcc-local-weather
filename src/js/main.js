

$(function() {

  var $article = $('#weather-today');


  var flickrOpts = require('./lib/options/flickr.js');
  var owm = require('./lib/options/openWeatherMap.js');
  var flickrHelpers = require('./lib/helpers/flickr.js');
  var owmHelpers = require('./lib/helpers/openWeatherMap.js');
  var creditsRenderer = require('./lib/renderers/credits.js');
  var bgPhoto = require('./lib/renderers/bgPhoto.js');
  var weatherReport = require('./lib/renderers/weatherReport.js');


  var wData = {};
  var firstSearch = true;
  var fData = [];


  var getWeather = function () {
    $.ajax({
      url: owm.getURL(),
      data: owm.getQueryData(),
      method: 'GET',
      crossDomain: true,
      jsonp: false,
      dataType: 'json',
      success: function (data, status, jqxhr) {
        wData = data;
        console.log(data);
        weatherReport.addWeatherHTML(wData);
        searchFlickrPhotos(wData);
      },
      error: function (jqxhr, status, error) {
        $article.html($('<div></div>', {'class': 'alert alert-warning'}).text('Can\'t fetch the weather, plase try again.'));
        console.log(jqxhr);
        console.log(status);
        console.log(error);
      },
      complete: function (jqxhr, status) {
        console.log(status);
      }
    });
  };



  var searchFlickrPhotos = function (wdata) {
    if (flickrOpts.hasAPIKey()) {
      flickrOpts.setTextSearchStr(
        flickrHelpers.createFlickrTextSearchStr(
          owmHelpers.getWeatherString(wdata),
          owmHelpers.determineDayOrNight(wdata),
          firstSearch
      ));
      flickrOpts.setBBox(
        flickrHelpers.createFlickrBboxStr(
          owmHelpers.getWeatherCoords(wdata).lon,
          owmHelpers.getWeatherCoords(wdata).lat,
          flickrOpts.getCoordTolerances()
        ));
      console.log(flickrOpts.getQueryData());
      makeFlickrAPICall(wdata);
    }
  };

  var makeFlickrAPICall = function (wdata) {
    $.ajax({
      url: flickrOpts.getURL(),
      data: flickrOpts.getQueryData(),
      method: 'GET',
      crossDomain: true,
      jsonp: false,
      dataType: 'json',
      success: function (data, status, jqxhr) {
        if (data.photos.total >= 1) {
          fData = data.photos.photo;
          console.log('fdata');
          console.log(fData);
          var photoData = flickrHelpers.selectPhoto(fData);
          console.log(photoData);
          bgPhoto.showPhoto(photoData);
          creditsRenderer.setCredits(photoData);
          activateCredits();
        } else  if (firstSearch) {
          delete flickrOpts.getQueryData().bbox;
          firstSearch = false;
          flickrOpts.setTextSearchStr(
            flickrHelpers.createFlickrTextSearchStr(
              owmHelpers.getWeatherString(wdata),
              owmHelpers.determineDayOrNight(wdata),
              firstSearch
          ));
          makeFlickrAPICall(wdata);
        }
      },
      error: function (jqxhr, status, error) {
        console.log(error);
      }
    });
  };


  var parseQueryStr = function () {
    var qObj = {};
    var location = window.location.search.slice(1).split('&');
    location.forEach(function (item) {
      kv = item.split('=');
      qObj[kv[0]] = kv[1];
    });
    return qObj;
  };



  queryStr = parseQueryStr();
  owm.setAPIKey(queryStr.owm);
  flickrOpts.setAPIKey(queryStr.api_key);

  $('#weather-today').on('click', '#c-btn, #f-btn', function(e) {
    var $this = $(e.target);
    var $other = $($this.data('other-btn'));
    $('#temp-val').text($this.data('temp-val'));
    $this.removeClass('btn-default')
         .addClass('btn-primary');
    $other.addClass('btn-default')
          .removeClass('btn-primary');
  });

  var activateCredits = function () {
    $('#credits-toggle').on('click', function () {
      $('.credits').toggleClass('open');
    });
  };


  var showLocationUnavailableMsg = function () {
    var $alert = $('<div></div>', {'class': 'alert alert-warning text-center'});
    var $joke = $('<p></p>').text('I guess the sun will shine tonight, expect a full moon at noon ').append($('<strong></strong>').text(':)'));
    var $msg = $('<p></p>').text('Location, location, location, are you under cover?');
    $alert.append($msg);
    $alert.append($joke);
    $article.html($alert);
  };

  if ((owm.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        owm.setCoords(pos.coords.longitude, pos.coords.latitude);
        getWeather();
      },
      showLocationUnavailableMsg);
  } else {
    showLocationUnavailableMsg();
  }


});
