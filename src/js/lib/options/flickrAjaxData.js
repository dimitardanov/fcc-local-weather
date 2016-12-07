

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
  getCoordTolerances: function () { return { lon: this.lonTol, lat: this.latTol }; },
  setBBox: function (bbox) { this.queryData.bbox = bbox; },
  setTextSearchStr: function (text) { this.queryData.text = text; }
};

searchOpts.setQueryData();

module.exports = searchOpts;
