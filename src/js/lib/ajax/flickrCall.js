
var selectPhoto = require('../helpers/imageSelect.js');
var bgPhoto = require('../renderers/bgPhoto.js');
var creditsRenderer = require('../renderers/credits.js');
var events = require('../helpers/events.js');

var firstSearch = true;

function searchFlickrPhotos (weather, flickrAjaxData) {
  console.log('searchFlickrPhotos');
  console.log(flickrAjaxData);
  if (flickrAjaxData.hasAPIKey()) {
    flickrAjaxData.setTextSearchStr(weather.getWeatherString(), firstSearch);
    flickrAjaxData.setBBox(weather.getWeatherCoords());
    console.log(flickrAjaxData.getQueryData());
    makeFlickrAPICall(weather, flickrAjaxData);
  }
}

function makeFlickrAPICall (weather, flickrAjaxData) {
  $.ajax({
    url: flickrAjaxData.getURL(),
    data: flickrAjaxData.getQueryData(),
    method: 'GET',
    crossDomain: true,
    jsonp: false,
    dataType: 'json',
    success: function (data, status, jqxhr) {
      if (data.photos.total >= 1) {
        var fData = data.photos.photo;
        console.log('fdata');
        console.log(fData);
        var photoData = selectPhoto(fData);
        console.log(photoData);
        bgPhoto.showPhoto(photoData);
        creditsRenderer.setCredits(photoData);
        events.activateCredits();
      } else  if (firstSearch) {
        flickrAjaxData.removeBBox();
        firstSearch = false;
        flickrAjaxData.setTextSearchStr(
          weather.getWeatherString(),
          firstSearch
        );
        makeFlickrAPICall(weather, flickrAjaxData);
      }
    },
    error: function (jqxhr, status, error) {
      console.log(error);
    }
  });
}


module.exports = searchFlickrPhotos;
