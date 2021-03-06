
var AjaxData = require('./baseAjaxData.js');
var helpers = require('../helpers/helpers.js');

var url = 'https://api.flickr.com/services/rest/?';
var queryData = {
  method: 'flickr.photos.search',
  api_key: '',
  text: '',
  sort: 'relevance',
  license: '',
  bbox: '',
  safe_search: 1,
  media: 'photos',
  privacy_filter: 1,
  extras: '',
  format: 'json',
  nojsoncallback: 1
};
var options = {
  imageSizeMarkers: ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'],
  imageLicenses: [1, 2, 3, 4, 5, 6, 7, 8],
  termsExclude: ['history', 'war', 'visitor'],
  termsInclude: ['city'],
  termsAdditional: ['nature'],
  termsExtra: ['date_taken', 'views', 'license', 'owner_name'],
  imgSuffix: 'url_',
  latTol: 2,
  lonTol: 1,
};


function FAD () {
  AjaxData.call(this, url, queryData);
  this.opts = options;
  this._setLicenses();
  this._setQueryExtraTerms();
  this._setAPIKey(this.queryObjStr.api_key);
}

FAD.prototype = Object.create(AjaxData.prototype);
FAD.prototype.constructor = FAD;


FAD.prototype._setLicenses = function () {
  this.queryData.license = this.opts.imageLicenses.join(',');
};

FAD.prototype._setQueryExtraTerms = function () {
  this.queryData.extras = this.opts.termsExtra.concat(this._getImageSizeURLSuffixes()).join(',');
};

FAD.prototype._getImageSizeURLSuffixes = function () {
  var self = this;
  return this.opts.imageSizeMarkers.map(function (m) {
    return self.opts.imgSuffix + m;
  });
};

FAD.prototype._setAPIKey = function (key) {
  this.queryData.api_key = key;
};

FAD.prototype.hasAPIKey = function () {
  return Boolean(this.queryData.api_key);
};

FAD.prototype.setTextSearchStr = function (weatherStr, firstSearch) {
  var terms = {
    incl: this.opts.termsInclude,
    add: this.opts.termsAdditional,
    excl: this.opts.termsExclude
  };
  var daytimeStr = helpers.determineDaytimeStr(new Date());
  this.queryData.text = helpers.createImageSearchStr(weatherStr, terms, daytimeStr, firstSearch);
};

FAD.prototype.getCoordTolerances = function () {
  return { lon: this.opts.lonTol, lat: this.opts.latTol };
};

FAD.prototype.setBBox = function (coords) {
  var bbox = helpers.flickrCreateBbox(coords, this.getCoordTolerances());
  this.queryData.bbox = bbox.join(',');
};

FAD.prototype.removeBBox = function () {
  delete this.queryData.bbox;
};



module.exports = FAD;
