
function showBgPhoto (image) {
  var $body = $('body');
  var $bgCurtain = $('.cover');
  var $bgImage = $('.bg-image');
  var thumbnailURL = image.getThumbnailURL();
  var imageURL = image.getImageURL();
  $bgImage.css({
    'background-image': 'url(' + thumbnailURL + ')'
  });
  $bgCurtain.addClass('transparent');
  var img = new Image();
  img.addEventListener('load', function() {
    $('head').append('<style>body {background-image: url(' + imageURL + ');}</style>');
    $bgImage.addClass('transparent');
    $('head').append('<style>.weather-report:before, footer::before {background-image: url(' + imageURL + '); opacity: 1;}</style>');
  }, false);
  img.src = imageURL;
}

module.exports = showBgPhoto;
