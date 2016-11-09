

$(function() {
  var imageMinCoeff = 0.9;
  var imageMaxCoeff = 1.6;

  var $article = $('#weather-today');
  var openWeatherMapURL = 'http://api.openweathermap.org/data/2.5/weather?';
  var openWeatherMapAPIKey;
  var wData = {};
  var absZeroC = -273.15;

  var maxNumPhotos = 1000;
  var imageSizeMarkers = ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'];
  var flickrImageSuffixURLs = imageSizeMarkers.map(
    function (m) { return 'url_' + m; }
  );
  var flickrSearchTermsExclude = ['history', 'war', 'visitor'];
  var flickrSearchTermsInclude = ['city'];//, 'landscape', 'weather'];
  var flickrSearchAdditionalTerms = ['nature'];
  var flickrExtras = ['date_taken', 'views', 'license', 'owner_name'];
  var imageLicenses = [1, 2, 3, 4, 5, 6, 7, 8];
  var firstSearch = true;
  var latTol = 2;
  var lonTol = 1;
  var fData = [];
  var flickrURL = 'https://api.flickr.com/services/rest/?';
  var flickrQueryData = {
    method: 'flickr.photos.search',
    api_key: '',
    text: '',
    sort: 'relevance',//interestingness-desc',
    license: imageLicenses.join(','),
    bbox: '',
    safe_search: 1,
    media: 'photos',
    privacy_filter: 1,
    extras: flickrExtras.concat(flickrImageSuffixURLs).join(','),
    format: 'json',
    nojsoncallback: 1
  };

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
        console.log(data);
        addWeatherHTML(wData);
        searchFlickrPhotos(wData);
      },
      error: function (jqxhr, status, error) {
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
    if (dayStr.length > 0) {
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

  var createFlickrTextSearchStr = function (data) {
    var searchStr = getWeatherString(data) + ' ' + determineDayOrNight(data);
    if (firstSearch) {
      searchStr = searchStr + ' ' + flickrSearchTermsInclude.join(' ');
    } else {
      searchStr = searchStr + ' ' + flickrSearchAdditionalTerms.join(' ');
    }
    searchStr = searchStr + ' -' + flickrSearchTermsExclude.join(' -');
    return searchStr;
  };

  var createFlickrBboxStr = function (data) {
    var lon = getWeatherCoords(data).lon;
    var lat = getWeatherCoords(data).lat;
    var latMin = Math.max(lat - latTol, -90);
    var latMax = Math.min(lat + latTol, 90);
    var lonMin = Math.max(lon - lonTol, -180);
    var lonMax = Math.min(lon + lonTol, 180);
    var bbox = [lonMin, latMin, lonMax, latMax];
    return bbox.join(',');
  };

  var searchFlickrPhotos = function (wdata) {
    if (flickrQueryData.hasOwnProperty('api_key')) {
      flickrQueryData.text = createFlickrTextSearchStr(wdata);
      flickrQueryData.bbox = createFlickrBboxStr(wdata);
      console.log(flickrQueryData);
      makeFlickrAPICall(wdata);
    }
  };

  var makeFlickrAPICall = function (wdata) {
    $.ajax({
      url: flickrURL,
      data: flickrQueryData,
      method: 'GET',
      crossDomain: true,
      jsonp: false,
      dataType: 'json',
      success: function (data, status, jqxhr) {
        if (data.photos.total >= 1) {
          fData = data.photos.photo;
          var photoData = selectPhoto(fData);
          console.log(photoData);
          showPhoto(photoData);
        } else  if (firstSearch) {
          delete flickrQueryData.bbox;
          firstSearch = false;
          flickrQueryData.text = createFlickrTextSearchStr(wdata);
          makeFlickrAPICall(wdata);
        }
      },
      error: function (jqxhr, status, error) {
        console.log(error);
      }
    });
  };

  var selectPhoto = function (fData) {
    if (fData.length === 1) {
      return fData[0];
    }

    fData = fData.sort(function (a, b) {
      return parseInt(b.views, 10) - parseInt(a.views, 10);
    });
    fData = createImageURLData(fData);
    fData = fData.filter(function (item) {
      return item.hasOwnProperty('url_t') && item.hasOwnProperty('url');
    });
    if (fData.length > maxNumPhotos) {
      fData = fData.slice(0, maxNumPhotos);
    }
    var randIndex = Math.floor(Math.random() * fData.length);
    return fData[randIndex];
  };

  var createImageURLData = function (items) {
    items.forEach(function (item) {
      createImageURLDataPerItem(item);
    });
    return items;
  };

  var createImageURLDataPerItem = function (item) {
    imageSizeMarkers.forEach(function (m) {
      var prop = 'url_' + m;
      if (item.hasOwnProperty(prop) && isURLImageWithinBounds(item, m)) {
        item.url = item[prop];
      }
    });
    return item;
  };

  var getImageWidth = function (item, marker) {
    return item['width_' + marker];
  };

  var getImageHeight = function (item, marker) {
    return item['height_' + marker];
  };

  var isURLImageWithinBounds = function (item, marker) {
    var imageW = getImageWidth(item, marker);
    var imageH = getImageHeight(item, marker);
    var screenW = screen.width;
    var screenH = screen.height;
    var minReqW = imageMinCoeff * imageW <= screenW;
    var minReqH = imageMinCoeff * imageH <= screenH;
    var maxReqW = screenW <= imageMaxCoeff * imageW;
    var maxReqH = screenH <= imageMaxCoeff * imageH;
    return ((minReqW && maxReqW) && (minReqH && maxReqH));
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
      $('head').append('<style>.weather-report:before {background-image: url(' + data.url + '); opacity: 1;}</style>');
    }, false);
    img.src = data.url;
    setCredits(data);
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

  var getWeatherCoords = function (data) {
    return {lon: data.coord.lon, lat: data.coord.lat};
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

  var licenses = {
    0: {abbr: 'All Rights Reserved', name: 'All Rights Reserved', url: '#'},
    1: {abbr: 'CC BY-NC-SA 2.0', name: 'Attribution-NonCommercial-ShareAlike License', url: 'http://creativecommons.org/licenses/by-nc-sa/2.0/'},
    2: {abbr: 'CC BY-NC 2.0', name: 'Attribution-NonCommercial License', url: 'http://creativecommons.org/licenses/by-nc/2.0/'},
    3: {abbr: 'CC BY-NC-ND 2.0', name: 'Attribution-NonCommercial-NoDerivs License', url: 'http://creativecommons.org/licenses/by-nc-nd/2.0/'},
    4: {abbr: 'CC BY 2.0', name: 'Attribution License', url: 'http://creativecommons.org/licenses/by/2.0/'},
    5: {abbr: 'CC BY-SA 2.0', name: 'Attribution-ShareAlike License', url: 'http://creativecommons.org/licenses/by-sa/2.0/'},
    6: {abbr: 'CC BY-ND 2.0', name: 'Attribution-NoDerivs License', url: 'http://creativecommons.org/licenses/by-nd/2.0/'},
    7: {abbr: 'No known copyright restrictions', name: 'No known copyright restrictions', url: 'http://flickr.com/commons/usage/'},
    8: {abbr: 'U.S. Government Works', name: 'United States Government Work', url: 'http://www.usa.gov/copyright.shtml'}
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
  };

  queryStr = parseQueryStr();
  openWeatherMapAPIKey = queryStr.owm;
  flickrQueryData.api_key = queryStr.api_key;

  $('#weather-today').on('click', '#c-btn, #f-btn', function(e) {
    var $this = $(e.target);
    var $other = $($this.data('other-btn'));
    $('#temp-val').text($this.data('temp-val'));
    $this.removeClass('btn-default')
         .addClass('btn-primary');
    $other.addClass('btn-default')
          .removeClass('btn-primary');
  });

  $('#credits-toggle').on('click', function () {
    $('.credits').toggleClass('open');
  });

  if ((openWeatherMapAPIKey.length>0) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(getWeather);
  } else {
    $article.html($('<div></div>', {'class': 'alert alert-warning text-center'}).text('The sun will shine this night, expect a full moon at noon ').append($('<strong></strong>').text(':)')));
  }


});
