

$(function() {

  var flickrOpts = require('./lib/options/flickr.js');
  var owm = require('./lib/options/openWeatherMap.js');
  var flickrHelpers = require('./lib/helpers/flickr.js');
  var owmHelpers = require('./lib/helpers/openWeatherMap.js');
  var creditsRenderer = require('./lib/renderers/credits.js');
  var bgPhoto = require('./lib/renderers/bgPhoto.js');
  var weatherReport = require('./lib/renderers/weatherReport.js');
  var errorMsg = require('./lib/renderers/errorMessages.js');
  var helpers = require('./lib/helpers/helpers.js');
  var events = require('./lib/helpers/events.js');


  var firstSearch = true;


  var queryObj = helpers.parseQueryStr();
  owm.setAPIKey(queryObj.owm);
  flickrOpts.setAPIKey(queryObj.api_key);

  if ((owm.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        owm.setCoords(pos.coords.longitude, pos.coords.latitude);
        getWeather();
      },
      errorMsg.showLocationUnavailable);
  } else {
    errorMsg.showLocationUnavailable();
  }


  var getWeather = function () {
    $.ajax({
      url: owm.getURL(),
      data: owm.getQueryData(),
      method: 'GET',
      crossDomain: true,
      jsonp: false,
      dataType: 'json',
      success: function (data, status, jqxhr) {
        console.log(data);
        weatherReport.addWeatherHTML(data);
        searchFlickrPhotos(data);
      },
      error: function (jqxhr, status, error) {
        errorMsg.showWeatherUnavailable();
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
          var fData = data.photos.photo;
          console.log('fdata');
          console.log(fData);
          var photoData = flickrHelpers.selectPhoto(fData);
          console.log(photoData);
          bgPhoto.showPhoto(photoData);
          creditsRenderer.setCredits(photoData);
          events.activateCredits();
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

  $('#weather-today').on('click', '#c-btn, #f-btn', events.c2fButtonToggle);

});
