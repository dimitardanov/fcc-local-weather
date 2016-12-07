
var owmHelpers = require('../helpers/openWeatherMap.js');
var selectPhoto = require('../helpers/imageSelect.js');
var bgPhoto = require('../renderers/bgPhoto.js');
var creditsRenderer = require('../renderers/credits.js');
var events = require('../helpers/events.js');

var firstSearch = true;

function searchFlickrPhotos (wdata, flickrAjaxData) {
  console.log('searchFlickrPhotos');
  console.log(flickrAjaxData);
  if (flickrAjaxData.hasAPIKey()) {
    flickrAjaxData.setTextSearchStr(
      owmHelpers.getWeatherString(wdata),
      owmHelpers.determineDayOrNight(wdata),
      firstSearch
    );
    flickrAjaxData.setBBox(owmHelpers.getWeatherCoords(wdata));
    console.log(flickrAjaxData.getQueryData());
    makeFlickrAPICall(wdata, flickrAjaxData);
  }
}

function makeFlickrAPICall (wdata, flickrAjaxData) {
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
          owmHelpers.getWeatherString(wdata),
          owmHelpers.determineDayOrNight(wdata),
          firstSearch
        );
        makeFlickrAPICall(wdata, flickrAjaxData);
      }
    },
    error: function (jqxhr, status, error) {
      console.log(error);
    }
  });
}


module.exports = searchFlickrPhotos;
