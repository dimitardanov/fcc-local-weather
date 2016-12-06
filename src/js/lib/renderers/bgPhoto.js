
function showPhoto (data) {
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
    $('head').append('<style>.weather-report:before, footer::before {background-image: url(' + data.url + '); opacity: 1;}</style>');
  }, false);
  img.src = data.url;
}

module.exports = {
  showPhoto: showPhoto
};
