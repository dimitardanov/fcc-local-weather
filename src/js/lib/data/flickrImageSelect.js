
var helpers = require('../helpers/helpers.js');
var licenses = require('./licenses.js');

var imageSizeCoeffMin = 0.8;
var imageSizeCoeffMax = 1.6;
var imageSizeMarkers = ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'];
var thumbnailUrlProp = 'url_t';
var urlProp = 'url';
var urlPref = 'url_';
var widthPref = 'width_';
var heightPref = 'height_';
var imageOwnerNameProp = 'ownername';
var imageOwnerURLId = 'owner';
var imageTitlePref = 'title';
var flickrPeopleURL = 'https://www.flickr.com/people/';
var flickrPhotosURL = 'https://www.flickr.com/photos/';
var flickrPhotoIdProp = 'id';
var licenseProp = 'license';

function ImageSelector (images) {
  this.images = images;
  this.selectedImage = {};
}
ImageSelector.prototype.constructor = ImageSelector;

ImageSelector.prototype.selectImage = function () {
  this.selectedImage = _selectPhoto(this.images);
};

ImageSelector.prototype.getThumbnailURL = function () {
  return this.selectedImage[thumbnailUrlProp];
};

ImageSelector.prototype.getImageURL = function () {
  return this.selectedImage[urlProp];
};

ImageSelector.prototype.getImageOwnerName = function () {
  return this.selectedImage[imageOwnerNameProp];
};

ImageSelector.prototype.getImageOwnerURL = function () {
  return flickrPeopleURL + this.selectedImage[imageOwnerURLId];
};

ImageSelector.prototype.getImageTitle = function () {
  return this.selectedImage[imageTitlePref];
};

ImageSelector.prototype.getFlickrImagePageURL = function () {
  return flickrPhotosURL + this.getImageOwnerName() + '/' + this.selectedImage[flickrPhotoIdProp];
};

ImageSelector.prototype.getImageLicenseURL = function () {
  return licenses.getURL(this.selectedImage[licenseProp]);
};

ImageSelector.prototype.getImageLicenseText = function () {
  return licenses.getText(this.selectedImage[licenseProp]);
};



function _selectPhoto (fData) {
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
    var imageSize = {w: _getImageWidth(item, m), h: _getImageHeight(item, m)};
    var targetSize = {w: screen.width, h: screen.height};
    var sizeCoeffs = {max: imageSizeCoeffMax, min: imageSizeCoeffMin};
    if (
      item.hasOwnProperty(prop) &&
      helpers.isImageWithinBounds(imageSize, targetSize, sizeCoeffs)) {
      item[urlProp] = item[prop];
    }
  });
  return item;
}


function _getImageWidth (item, marker) {
  return item[widthPref + marker];
}

function _getImageHeight (item, marker) {
  return item[heightPref + marker];
}


module.exports = ImageSelector;
