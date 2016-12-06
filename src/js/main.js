

$(function() {

  var $article = $('#weather-today');


  var licenses = require('./lib/options/licenses.js');
  var flickrOpts = require('./lib/options/flickr.js');
  var owm = require('./lib/options/openWeatherMap.js');
  var flickrHelpers = require('./lib/helpers/flickr.js');
  var owmHelpers = require('./lib/helpers/openWeatherMap.js');


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
        addWeatherHTML(wData);
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
        {'class': 'text-center'}).text(' ' + owmHelpers.getTown(data) + ', ');
    $locHTML.append($('<small></small>').text(owmHelpers.getCountryCode(data)));
    $locHTML.prepend($('<i></i>',
        {'class': owmHelpers.getWeatherIconsClass(data)}));
    return $locHTML;
  };

  var createWeatherInfoHTML = function (data) {
    var $holder = $('<section></section>', {'class': 'temp text-center'});
    var $temp = $('<span></span>',
        {'class': 'temp-val', id: 'temp-val'}).text(owmHelpers.getTemp(data).C);
    var $deg = createC2FSwitchHTML(data);
    $holder.append($('<i></i>', {'class': 'wi wi-thermometer temp-icon'}));
    $holder.append($temp);
    $holder.append($deg);
    return $holder;
  };

  var createC2FSwitchHTML = function (data) {
    var temps = owmHelpers.getTemp(data);
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
    $desc.text(owmHelpers.getWeatherDescription(data));
    return $desc;
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
          showPhoto(photoData);
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


  var showPhoto = function (data) {
    var $body = $('body');
    var $bgCurtain = $('.cover');
    var $bgImage = $('.bg-image');
    $bgImage.css({
      'background-image': 'url(' + data.url_t + ')'
    });
    $bgCurtain.addClass('transparent');
    var img = new Image();
    img.addEventListener('load', function() {
      $('head').append('<style>body {background-image: url(' + data.url + ');}</style>');
      $bgImage.addClass('transparent');
      $('head').append('<style>.weather-report:before, footer::before {background-image: url(' + data.url + '); opacity: 1;}</style>');
    }, false);
    img.src = data.url;
    setCredits(data);
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


  var setElementCredits = function (selector, text, url) {
    var $element = $(selector);
    $element.text(text);
    $element.attr('href', url);
  };

  var setAuthorCredits = function (data) {
    var owner_name = data.ownername;
    var owner_url = 'https://www.flickr.com/people/' + data.owner;
    setElementCredits('.photo-author', owner_name, owner_url);
  };

  var setPhotoCredits = function (data) {
    var photo_title = data.title;
    var photo_url = 'https://www.flickr.com/photos/' + data.owner + '/' + data.id;
    setElementCredits('.photo-title', photo_title, photo_url);
  };

  var setLicenseCredits = function (data) {
    var id = parseInt(data.license, 10);
    var licenseText = licenses[id].abbr;
    var licenseUrl = licenses[id].url;
    setElementCredits('.photo-license', licenseText, licenseUrl);
  };

  var setCredits = function (data) {
    setAuthorCredits(data);
    setPhotoCredits(data);
    setLicenseCredits(data);
    activateCredits();
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
