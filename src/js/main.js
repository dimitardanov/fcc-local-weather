

$(function() {

  var getIP = require('./lib/ajax/jsonipCall.js');
  var FlickrAjaxData = require('./lib/data/flickrAjaxData.js');
  var WeatherAjaxData = require('./lib/data/owmAjaxData.js');


  getIP({
    weather: new WeatherAjaxData(),
    bgImage: new FlickrAjaxData()
  });

});
