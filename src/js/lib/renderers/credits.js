
var licenses = require('../options/licenses.js');


function _setElementCredits (selector, text, url) {
  var $element = $(selector);
  $element.text(text);
  $element.attr('href', url);
}

function _setAuthorCredits (data) {
  var owner_name = data.ownername;
  var owner_url = 'https://www.flickr.com/people/' + data.owner;
  _setElementCredits('.photo-author', owner_name, owner_url);
}

function _setPhotoCredits (data) {
  var photo_title = data.title;
  var photo_url = 'https://www.flickr.com/photos/' + data.owner + '/' + data.id;
  _setElementCredits('.photo-title', photo_title, photo_url);
}

function _setLicenseCredits (data) {
  var licenseUrl = licenses.getURL(data.license);
  var licenseText = licenses.getText(data.license);
  _setElementCredits('.photo-license', licenseText, licenseUrl);
}

function setCredits (data) {
  _setAuthorCredits(data);
  _setPhotoCredits(data);
  _setLicenseCredits(data);
}

module.exports = {
  setCredits: setCredits
};
