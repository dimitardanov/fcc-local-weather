var imgLicenses = {
  0: {abbr: 'All Rights Reserved', name: 'All Rights Reserved', url: '#'},
  1: {abbr: 'CC BY-NC-SA 2.0', name: 'Attribution-NonCommercial-ShareAlike License', url: 'http://creativecommons.org/licenses/by-nc-sa/2.0/'},
  2: {abbr: 'CC BY-NC 2.0', name: 'Attribution-NonCommercial License', url: 'http://creativecommons.org/licenses/by-nc/2.0/'},
  3: {abbr: 'CC BY-NC-ND 2.0', name: 'Attribution-NonCommercial-NoDerivs License', url: 'http://creativecommons.org/licenses/by-nc-nd/2.0/'},
  4: {abbr: 'CC BY 2.0', name: 'Attribution License', url: 'http://creativecommons.org/licenses/by/2.0/'},
  5: {abbr: 'CC BY-SA 2.0', name: 'Attribution-ShareAlike License', url: 'http://creativecommons.org/licenses/by-sa/2.0/'},
  6: {abbr: 'CC BY-ND 2.0', name: 'Attribution-NoDerivs License', url: 'http://creativecommons.org/licenses/by-nd/2.0/'},
  7: {abbr: 'No known copyright restrictions', name: 'No known copyright restrictions', url: 'http://flickr.com/commons/usage/'},
  8: {abbr: 'U.S. Government Works', name: 'United States Government Work', url: 'http://www.usa.gov/copyright.shtml'}
};


var searchOpts = {
  imageMinCoeff: 0.8,
  imageMaxCoeff: 1.6,
  maxNumPhotos: 1000,
  imageSizeMarkers: ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'],
  imageLicenses: [1, 2, 3, 4, 5, 6, 7, 8],
  termsExclude: ['history', 'war', 'visitor'],
  termsInclude: ['city'],
  termsAdditional: ['nature'],
  termsExtra: ['date_taken', 'views', 'license', 'owner_name'],
  imgSuffix: 'url_',
  latTol: 2,
  lonTol: 1,
  url: 'https://api.flickr.com/services/rest/?',
  queryData: {
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
  },
  getQueryData: function () { return this.queryData; },
  setQueryData: function () {
    this.setLicenses();
    this.setQueryExtraTerms();
  },
  setQueryExtraTerms: function () {
    this.queryData.extras = this.termsExtra.concat(this.getImageSizeURLSuffixes()).join(',');
  },
  setLicenses: function () { this.queryData.license = this.imageLicenses.join(','); },
  setAPIKey: function (key) { this.queryData.api_key = key; },
  getURL: function () { return this.url; },
  hasAPIKey: function () { return Boolean(this.queryData.api_key); },
  getMaxNumPhotos: function () { return this.maxNumPhotos; },
  getImageSizeCoeff: function () { return { max: this.imageMaxCoeff, min: this.imageMinCoeff }; },
  getImageSizeURLSuffixes: function () {
    var self = this;
    return this.imageSizeMarkers.map(function (m) {
      return self.imgSuffix + m;
    });
  },
  getImageSizeMarkers: function () { return this.imageSizeMarkers; },
  getExcludeTerms: function () { return this.termsExclude; },
  getIncludeTerms: function () { return this.termsInclude; },
  getAdditionalTerms: function () { return this.termsAdditional; },
  getCoordTolerances: function () { return { lon: this.lonTol, lat: this.latTol }; }
};

searchOpts.setQueryData();

exports.imgLicenses = imgLicenses;
exports.searchOpts = searchOpts;
