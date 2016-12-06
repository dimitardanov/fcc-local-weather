
var owmHelpers = require('../helpers/openWeatherMap.js');
var $article = $('#weather-today');


function _createLocationHTML (data) {
  var $locHTML = $('<h2></h2>',
      {'class': 'text-center'}).text(' ' + owmHelpers.getTown(data) + ', ');
  $locHTML.append($('<small></small>').text(owmHelpers.getCountryCode(data)));
  $locHTML.prepend($('<i></i>',
      {'class': owmHelpers.getWeatherIconsClass(data)}));
  return $locHTML;
}

function _createWeatherInfoHTML (data) {
  var $holder = $('<section></section>', {'class': 'temp text-center'});
  var $temp = $('<span></span>',
      {'class': 'temp-val', id: 'temp-val'}).text(owmHelpers.getTemp(data).C);
  var $deg = _createC2FSwitchHTML(data);
  $holder.append($('<i></i>', {'class': 'wi wi-thermometer temp-icon'}));
  $holder.append($temp);
  $holder.append($deg);
  return $holder;
}

function _createC2FSwitchHTML (data) {
  var temps = owmHelpers.getTemp(data);
  var $btnGrp = $('<div></div>',
      {'class': 'btn-group', role: 'group'});
  var $cBtn = $('<button></button>',
      {'class': 'btn btn-primary', type: 'button', id: 'c-btn'})
      .text('C');
  var $fBtn = $('<button></button>',
      {'class': 'btn btn-default', type: 'button', id: 'f-btn'})
      .text('F');
  $cBtn.data({'temp-val': temps.C, 'other-btn': '#f-btn'});
  $fBtn.data({'temp-val': temps.F, 'other-btn': '#c-btn'});
  $btnGrp.append($cBtn);
  $btnGrp.append($fBtn);
  return $btnGrp;
}

function createWeatherDescriptionHTML (data) {
  var $desc = $('<p></p>',
      {'class': 'text-center small weather-description'});
  $desc.text(owmHelpers.getWeatherDescription(data));
  return $desc;
}

function addWeatherHTML (data) {
  var $locationHTML = _createLocationHTML(data);
  var $weatherInfoHTML = _createWeatherInfoHTML(data);
  var $weatherDescription = createWeatherDescriptionHTML(data);
  $article.html($locationHTML);
  $article.append($weatherDescription);
  $article.append($weatherInfoHTML);
}


module.exports = {
  addWeatherHTML: addWeatherHTML
};
