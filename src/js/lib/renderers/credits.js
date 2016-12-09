
var credits = require('../templates/credits.hbs');
var $footer = $('footer');


function setImageCredits (image) {
  var data = {
    imageUrl: image.getFlickrImagePageURL(),
    imageTitle: image.getImageTitle(),
    ownerName: image.getImageOwnerName(),
    ownerUrl: image.getImageOwnerURL(),
    licenseText: image.getImageLicenseText(),
    licenseUrl: image.getImageLicenseURL()
  };
  $footer.append(credits(data));
}


module.exports = {
  setImageCredits: setImageCredits
};
