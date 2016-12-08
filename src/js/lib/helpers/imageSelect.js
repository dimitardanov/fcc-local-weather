
var helpers = require('./helpers.js');

var imageSizeCoeffMin = 0.8;
var imageSizeCoeffMax = 1.6;
var imageSizeMarkers = ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'];
var thumbnailUrlProp = 'url_t';
var urlProp = 'url';
var urlPref = 'url_';
var widthPref = 'width_';
var heightPref = 'height_';




function selectPhoto (fData) {
  if (fData.length === 1) {
    return fData[0];
  }

  fData = _createImageURLData(fData);
  fData = fData.filter(function (item) {
    return item.hasOwnProperty(thumbnailUrlProp) && item.hasOwnProperty(urlProp);
  });
  return fData[helpers.randIndex(fData.length)];
}

function _createImageURLData (items) {
  items.forEach(function (item) {
    _createImageURLDataPerItem(item);
  });
  return items;
}

function _createImageURLDataPerItem (item) {
  imageSizeMarkers.forEach(function (m) {
    var prop = urlPref + m;
    var imgW = _getImageWidth(item, m);
    var imgH = _getImageHeight(item, m);
    if (item.hasOwnProperty(prop) && _isURLImageWithinBounds(imgW, imgH)) {
      item[urlProp] = item[prop];
    }
  });
  return item;
}

function _isURLImageWithinBounds (imageW, imageH) {
  var minReqW = imageSizeCoeffMin * imageW <= screen.width;
  var minReqH = imageSizeCoeffMin * imageH <= screen.height;
  var maxReqW = screen.width <= imageSizeCoeffMax * imageW;
  var maxReqH = screen.height <= imageSizeCoeffMax * imageH;
  return ((minReqW && maxReqW) && (minReqH && maxReqH));
}

function _getImageWidth (item, marker) {
  return item[widthPref + marker];
}

function _getImageHeight (item, marker) {
  return item[heightPref + marker];
}


module.exports = selectPhoto;
