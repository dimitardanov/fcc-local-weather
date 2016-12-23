
var helpers = require('../helpers/helpers.js');
var licenses = require('./licenses.js');

var sizeCoeffs = {min: 0.8, max: 1.6};
var imageSizeMarkers = ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'];
var thumbnailUrlProp = 'url_t';
var urlProp = 'url';
var urlPref = 'url_';
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
  var target = {w: screen.width, h: screen.height};
  fData.map(function (item) {
    var markers = helpers.getImageMarkers(item, urlPref);
    markers = helpers.sortMarkersByImageSize(item, markers);
    item[thumbnailUrlProp] = helpers.getThumbnailURL(item, markers);
    item[urlProp] = helpers.getBgImageURL(item, markers, target, sizeCoeffs);
  });
  return fData[helpers.randIndex(fData.length)];
}


module.exports = ImageSelector;
