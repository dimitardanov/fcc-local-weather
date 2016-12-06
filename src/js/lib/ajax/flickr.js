
var owmHelpers = require('../helpers/openWeatherMap.js');
var flickrHelpers = require('../helpers/flickr.js');
var bgPhoto = require('../renderers/bgPhoto.js');
var creditsRenderer = require('../renderers/credits.js');
var events = require('../helpers/events.js');

var firstSearch = true;



function searchFlickrPhotos (wdata, flickrOpts) {
  console.log('searchFlickrPhotos');
  console.log(flickrOpts);
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
    makeFlickrAPICall(wdata, flickrOpts);
  }
}

function makeFlickrAPICall (wdata, flickrOpts) {
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
        makeFlickrAPICall(wdata, flickrOpts);
      }
    },
    error: function (jqxhr, status, error) {
      console.log(error);
    }
  });
}


module.exports = {
  searchFlickrPhotos: searchFlickrPhotos
};
