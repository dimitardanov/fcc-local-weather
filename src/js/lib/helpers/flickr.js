var flickrOpts = require('../options/flickrAjaxData.js');


function createFlickrBboxStr (lon, lat, coordTols) {
  coordTols = coordTols || { lon: 1, lat: 2 };
  var latMin = Math.max(lat - coordTols.lat, -90);
  var latMax = Math.min(lat + coordTols.lat, 90);
  var lonMin = Math.max(lon - coordTols.lon, -180);
  var lonMax = Math.min(lon + coordTols.lon, 180);
  var bbox = [lonMin, latMin, lonMax, latMax];
  return bbox.join(',');
}

function createFlickrTextSearchStr (weatherStr, dayStr, firstSearch) {
  var searchStr = weatherStr + ' ' + dayStr;
  if (firstSearch) {
    searchStr = searchStr + ' ' + flickrOpts.getIncludeTerms().join(' ');
  } else {
    searchStr = searchStr + ' ' + flickrOpts.getAdditionalTerms().join(' ');
  }
  searchStr = searchStr + ' -' + flickrOpts.getExcludeTerms().join(' -');
  return searchStr;
}

function selectPhoto (fData) {
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
  if (fData.length > flickrOpts.getMaxNumPhotos()) {
    fData = fData.slice(0, flickrOpts.getMaxNumPhotos());
  }
  var randIndex = Math.floor(Math.random() * fData.length);
  return fData[randIndex];
}

function createImageURLData (items) {
  items.forEach(function (item) {
    createImageURLDataPerItem(item);
  });
  return items;
}

function createImageURLDataPerItem (item) {
  flickrOpts.getImageSizeMarkers().forEach(function (m) {
    var prop = 'url_' + m;
    if (item.hasOwnProperty(prop) && isURLImageWithinBounds(item, m)) {
      item.url = item[prop];
    }
  });
  return item;
}

function isURLImageWithinBounds (item, marker) {
  var imageW = getImageWidth(item, marker);
  var imageH = getImageHeight(item, marker);
  var screenW = screen.width;
  var screenH = screen.height;
  var minReqW = flickrOpts.getImageSizeCoeff().min * imageW <= screenW;
  var minReqH = flickrOpts.getImageSizeCoeff().min * imageH <= screenH;
  var maxReqW = screenW <= flickrOpts.getImageSizeCoeff().max * imageW;
  var maxReqH = screenH <= flickrOpts.getImageSizeCoeff().max * imageH;
  return ((minReqW && maxReqW) && (minReqH && maxReqH));
}

function getImageWidth (item, marker) {
  return item['width_' + marker];
}

function getImageHeight (item, marker) {
  return item['height_' + marker];
}


module.exports = {
  createFlickrBboxStr: createFlickrBboxStr,
  createFlickrTextSearchStr: createFlickrTextSearchStr,
  selectPhoto: selectPhoto
};
