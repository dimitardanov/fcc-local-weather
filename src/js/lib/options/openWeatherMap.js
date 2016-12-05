

var owm = {
  url: 'http://api.openweathermap.org/data/2.5/weather?',
  queryData: {
    APPID: '',
    lon: 0,
    lat: 0,
  },
  setAPIKey: function (api) { this.queryData.APPID = api; },
  setCoords: function (lon, lat) {
    this.queryData.lon = lon;
    this.queryData.lat = lat;
  },
  getURL: function () { return this.url; },
  getQueryData: function () { return this.queryData; },
  hasAPIKey: function () { return Boolean(this.queryData.APPID); },
};

module.exports = owm;
