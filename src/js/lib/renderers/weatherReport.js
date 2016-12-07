
var $article = $('#weather-today');


function _createLocationHTML (weather) {
  var $locHTML = $('<h2></h2>',
      {'class': 'text-center'}).text(' ' + weather.getTown() + ', ');
  $locHTML.append($('<small></small>').text(weather.getCountryCode()));
  $locHTML.prepend($('<i></i>',
      {'class': weather.getWeatherIconsClass()}));
  return $locHTML;
}

function _createWeatherInfoHTML (weather) {
  var $holder = $('<section></section>', {'class': 'temp text-center'});
  var $temp = $('<span></span>',
      {'class': 'temp-val', id: 'temp-val'}).text(weather.getTemp().C);
  var $deg = _createC2FSwitchHTML(weather);
  $holder.append($('<i></i>', {'class': 'wi wi-thermometer temp-icon'}));
  $holder.append($temp);
  $holder.append($deg);
  return $holder;
}

function _createC2FSwitchHTML (weather) {
  var temps = weather.getTemp();
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

function _createWeatherDescriptionHTML (weather) {
  var $desc = $('<p></p>',
      {'class': 'text-center small weather-description'});
  $desc.text(weather.getWeatherDescription());
  return $desc;
}

function addWeatherHTML (weather) {
  var $locationHTML = _createLocationHTML(weather);
  var $weatherInfoHTML = _createWeatherInfoHTML(weather);
  var $weatherDescription = _createWeatherDescriptionHTML(weather);
  $article.html($locationHTML);
  $article.append($weatherDescription);
  $article.append($weatherInfoHTML);
}


module.exports = {
  addWeatherHTML: addWeatherHTML
};
