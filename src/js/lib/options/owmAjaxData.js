
var AjaxData = require('./baseAjaxData.js');

var url = 'http://api.openweathermap.org/data/2.5/weather?';
var queryData = {
  APPID: '',
  lon: 0,
  lat: 0,
};

function OWM () {
  AjaxData.call(this, url, queryData);
  this._setAPIKey(this.queryObjStr.owm);
}

OWM.prototype = Object.create(AjaxData.prototype);
OWM.prototype.constructor = OWM;


OWM.prototype._setAPIKey = function (key) {
  this.queryData.APPID = key;
};

OWM.prototype.setPosCoords = function (pos) {
  this.queryData.lon = pos.coords.longitude;
  this.queryData.lat = pos.coords.latitude;
};

OWM.prototype.hasAPIKey = function () {
  return Boolean(this.queryData.APPID);
};

module.exports = OWM;
