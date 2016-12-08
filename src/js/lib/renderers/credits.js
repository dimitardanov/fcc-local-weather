

function _setElementCredits (selector, text, url) {
  var $element = $(selector);
  $element.text(text);
  $element.attr('href', url);
}

function _setAuthorCredits (image) {
  var owner_name = image.getImageOwnerName();
  var owner_url = image.getImageOwnerURL();
  _setElementCredits('.photo-author', owner_name, owner_url);
}

function _setPhotoCredits (image) {
  var photo_title = image.getImageTitle();
  var photo_url = image.getFlickrImagePageURL();
  _setElementCredits('.photo-title', photo_title, photo_url);
}

function _setLicenseCredits (image) {
  var licenseUrl = image.getImageLicenseURL();
  var licenseText = image.getImageLicenseText();
  _setElementCredits('.photo-license', licenseText, licenseUrl);
}

function setCredits (image) {
  _setAuthorCredits(image);
  _setPhotoCredits(image);
  _setLicenseCredits(image);
}

module.exports = setCredits;
