

var errorMsg = require('../renderers/errorMessages.js');
var getWeather = require('../ajax/owmCall.js');


function useGeolocation (calls) {

  if ((calls.weather.hasAPIKey()) && ('geolocation' in navigator)) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        fetchWeather(pos, calls);
      }, errorMsg.showLocationUnavailable
    );
  } else {
    errorMsg.showLocationUnavailable();
    console.log('show locationUnavailable');
  }
}

function fetchWeather (pos, calls) {
  calls.weather.setPosCoords(pos);
  getWeather(calls.weather, calls.bgImage);
}

module.exports = {
  useGeolocation: useGeolocation,
  fetchWeather: fetchWeather
};
