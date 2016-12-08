

function _setElementCredits (selector, text, url) {
  var $element = $(selector);
  $element.text(text);
  $element.attr('href', url);
}

function _setImageAuthorCredits (image) {
  var owner_name = image.getImageOwnerName();
  var owner_url = image.getImageOwnerURL();
  _setElementCredits('.photo-author', owner_name, owner_url);
}

function _setImageTitleCredits (image) {
  var photo_title = image.getImageTitle();
  var photo_url = image.getFlickrImagePageURL();
  _setElementCredits('.photo-title', photo_title, photo_url);
}

function _setImageLicenseCredits (image) {
  var licenseUrl = image.getImageLicenseURL();
  var licenseText = image.getImageLicenseText();
  _setElementCredits('.photo-license', licenseText, licenseUrl);
}

function setImageCredits (image) {
  _setImageAuthorCredits(image);
  _setImageTitleCredits(image);
  _setImageLicenseCredits(image);
}

module.exports = {
  setImageCredits: setImageCredits
};
