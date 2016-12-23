var expect = require('chai').expect;
var c2f = require('../lib/helpers/helpers').celsius2fahrenheit;
var detDayStr = require('../lib/helpers/helpers').determineDaytimeStr;
var parseQS = require('../lib/helpers/helpers').parseQueryStr;
var createBBox = require('../lib/helpers/helpers').flickrCreateBbox;
var isImageWB = require('../lib/helpers/helpers').isImageWithinBounds;
var prepST = require('../lib/helpers/helpers').prepSearchTerms;
var createISS = require('../lib/helpers/helpers').createImageSearchStr;
var getIM = require('../lib/helpers/helpers').getImageMarkers;
var imageMD = require('./fixtures/flickrImageMetadataFixture');
var calcImageSize = require('../lib/helpers/helpers').calcImageSize;
var getImageDim = require('../lib/helpers/helpers').getImageDimensions;
var getImageURL = require('../lib/helpers/helpers').getImageURL;
var sortMIS = require('../lib/helpers/helpers').sortMarkersByImageSize;
var getBgIURL = require('../lib/helpers/helpers').getBgImageURL;

describe('Helper module', function () {

  describe('celsius2fahrenheit function', function () {

    it('should convert degrees Celsius to Fahrenheit scale', function () {
      expect(c2f(0)).to.be.equal(32);
      expect(c2f(10)).to.be.equal(50);
      expect(c2f(20)).to.be.equal(68);
      expect(c2f(2)).to.be.equal(35.6);
    });
  });

  describe('determineDaytimeStr function', function () {

    it('should return "day" if the time is between 7:00 and 17:59', function () {
      var date1 = new Date(2000, 3, 12, 7, 0);
      var date2 = new Date(2000, 6, 5, 12, 0);
      var date3 = new Date(2000, 4, 11, 17, 59);
      expect(detDayStr(date1)).to.be.equal('day');
      expect(detDayStr(date3)).to.be.equal('day');
      expect(detDayStr(date2)).to.be.equal('day');
    });

    it('should return "night" if time is between 18:00 and 6:59', function () {
      var date1 = new Date(2000, 5, 2, 18, 0);
      var date2 = new Date(2000, 5, 4, 23, 0);
      var date3 = new Date(2000, 4, 2, 6, 59);
      expect(detDayStr(date1)).to.be.equal('night');
      expect(detDayStr(date2)).to.be.equal('night');
      expect(detDayStr(date3)).to.be.equal('night');
    });
  });

  describe('parseQueryStr function', function () {

    it('should return empty object if no query string present', function () {
      var qs = '';
      expect(parseQS(qs)).to.be.empty;
    });

    it('should return an object created from a query string', function () {
      var qs = '?a=123&b=890';
      var qObj = {b: '890', a: '123'};
      expect(parseQS(qs)).to.be.deep.equal(qObj);
    });
  });

  describe('flickrCreateBbox function', function () {

    before(function () {
      this.coordTols = {lat: 5, lon: 10};
      this.coords1 = {lat: 45, lon: 100};
      this.expected1 = [90, 40, 110, 50];
    });

    after(function () {
      delete this.coordTols;
      delete this.coords1;
      delete this.expected1;
    });

    it('should return a 4-element array', function () {
      expect(createBBox(this.coords1, this.coordTols)).to.be.an('array').with.length(4);
    });

    it('should return the coords of the corners of a rect surrounding the given longitude and lattide', function () {
      expect(createBBox(this.coords1, this.coordTols)).to.be.deep.equal(this.expected1);
    });

    it('should limit longitude and latitude to the maximum values', function () {
      var coords = {lat: 88, lon: 175};
      var expected = [165, 83, 180, 90];
      expect(createBBox(coords, this.coordTols)).to.be.deep.equal(expected);
    });

    it('should limit the longitude and latitude to the minumum values', function () {
      var coords = {lat: -86, lon: -173};
      var expected = [-180, -90, -163, -81];
      expect(createBBox(coords, this.coordTols)).to.be.deep.equal(expected);
    });
  });

  describe('isImageWithinBounds function', function () {

    before(function () {
      this.image = {w: 100, h: 200};
      this.coeffs = {min: 0.8, max: 1.2};
    });

    after(function () {
      delete this.image;
      delete this.coeffs;
    });

    it('should return true if image and target have equal dimensions', function () {
      var target1 = {w: 100, h: 200};
      expect(isImageWB(this.image, target1, this.coeffs)).to.be.true;
    });

    it('should return true if image larger than target and within coeff bounds', function () {
      var target2 = {w: 90, h: 180};
      expect(isImageWB(this.image, target2, this.coeffs)).to.be.true;
    });

    it('should return true if image is smaller than target and within coeff bounds', function () {
      var target3 = {w: 110, h: 220};
      expect(isImageWB(this.image, target3, this.coeffs)).to.be.true;
    });

    it('should return false if one of image\'s dimensions is outside the bounds', function () {
      var target1 = {w: 110, h: 250};
      expect(isImageWB(this.image, target1, this.coeffs)).to.be.false;
      var target2 = {w: 130, h: 220};
      expect(isImageWB(this.image, target2, this.coeffs)).to.be.false;
      var target3 = {w: 70, h: 220};
      expect(isImageWB(this.image, target3, this.coeffs)).to.be.false;
      var target4 = {w: 90, h: 150};
      expect(isImageWB(this.image, target4, this.coeffs)).to.be.false;
    });

    it('should return false if both image\'s height and width are outside of the bounds', function () {
      var target1 = {w: 130, h: 260};
      expect(isImageWB(this.image, target1, this.coeffs)).to.be.false;
      var target2 = {w: 130, h: 120};
      expect(isImageWB(this.image, target2, this.coeffs)).to.be.false;
      var target3 = {w: 60, h: 260};
      expect(isImageWB(this.image, target3, this.coeffs)).to.be.false;
      var target4 = {w: 60, h: 120};
      expect(isImageWB(this.image, target4, this.coeffs)).to.be.false;
    });
  });

  describe('prepSearchTerms function', function () {

    before(function () {
      this.terms = ['term1', 'term2', 'term3'];
    });

    after(function () {
      delete this.terms;
    });

    it('should return an empty string if given an empty array', function () {
      expect(prepST([], true)).to.be.a('string').with.length(0);
      expect(prepST([], false)).to.be.a('string').with.length(0);
    });

    it('should join the items of the given array with a " "', function () {
      var expected = 'term1 term2 term3';
      expect(prepST(this.terms, false)).to.be.deep.equal(expected);
    });

    it('should add a "-" in front of every item of the given array, if exclude param is true', function () {
      var expected = '-term1 -term2 -term3';
      expect(prepST(this.terms, true)).to.be.deep.equal(expected);
    });
  });

  describe('createImageSearchStr function', function () {

    before(function () {
      this.terms = {
        incl: ['incl1', 'incl2', 'incl3'],
        add: ['add1', 'add2'],
        excl: ['excl1', 'excl2']
      };
    });

    after(function () {
      delete this.terms;
    });

    it('should create a search string for a first ajax call', function () {
      var expected = 'weather day incl1 incl2 incl3 -excl1 -excl2';
      expect(createISS('weather', this.terms, 'day', true)).to.be.equal(expected);
    });

    it('should create a search string for a second ajax call', function () {
      var expected = 'clear sky night add1 add2 -excl1 -excl2';
      expect(createISS('clear sky', this.terms, 'night', false)).to.be.equal(expected);
    });
  });

  describe('getImageMarkers function', function () {

    before(function () {
      this.prefix = 'url_';
    });

    after(function () {
      delete this.prefix;
    });

    it('should return an empty array if given empty object', function () {
      expect(getIM({}, this.prefix)).to.be.an('array').with.length(0);
    });

    it('should return an empty array if the prefix doesn\'t match a property', function () {
      var prefix = 'noPrefix';
      expect(getIM(imageMD, prefix)).to.be.an('array').with.length(0);
    });

    it('should return image size markers', function () {
      var expected = ['t', 'm', 'n', 'z', 'c', 'l', 'h', 'k', 'o'].sort();
      expect(getIM(imageMD, this.prefix).sort()).to.be.deep.equal(expected);
    });
  });

  describe('calcImageSize function', function () {

    it('should calculate the image size for an image with a give marker', function() {
      var marker = 'c';
      var expected = 272800;
      expect(calcImageSize(imageMD, marker)).to.be.equal(expected);
    });

    it('should convert strings to integers and return a number', function () {
      var marker = 't';
      var expected = 4300;
      expect(calcImageSize(imageMD, marker)).to.be.a('number').equal(expected);
    });

    it('should throw an error if given an invalid marker', function () {
      var marker = 'a';
      expect(function () {calcImageSize(imageMD, marker);}).to.throw(Error);
    });
  });

  describe('getImageDimensions function', function () {

    it('should return an empty object for invalid marker', function () {
      expect(getImageDim(imageMD, 'a')).to.be.an('object').to.be.empty;
    });

    it('should return the image dimensions for a marker', function () {
      var expected = {w: 800, h: 341};
      expect(getImageDim(imageMD, 'c')).to.be.deep.equal(expected);
    });

    it('should return numbers as values of the object', function () {
      var expected = {w: 100, h: 43};
      expect(getImageDim(imageMD, 't')).to.be.deep.equal(expected);
    });
  });

  describe('getImageURL function', function () {

    it('should retrieve the url of an image for a marker', function () {
      var m = 't';
      var expected = 'https://farm4.staticflickr.com/1234/987654321_abcde1234_t.jpg';
      expect(getImageURL(imageMD, m)).to.be.equal(expected);
    });
  });

  describe('sortMarkersByImageSize function', function () {

    it('should return sorted markers based on ascending image size', function () {
      var markers = ['k', 'h', 'l'];
      var expected = ['l', 'h', 'k'];
      expect(sortMIS(imageMD, markers)).to.be.deep.equal(expected);
    });
  });

  describe('getBgImageURL function', function () {

    it('should return the url of the largest image, if none is within bounds', function () {
      var markers = ['c', 'l', 'h'];
      var target = {w: 100, h: 200};
      var coeffs = {min: 0.9, max: 1.1};
      var expected =  'https://farm4.staticflickr.com/1234/987654321_afbd12_h.jpg';
      expect(getBgIURL(imageMD, markers, target, coeffs)).to.be.equal(expected);
    });

    it('should return the url of an image close to the target size, if such exists', function () {
      var markers = ['t', 'n', 'h', 'o'];
      var target = {w: 1500, h: 700};
      var coeffs = {min: 0.8, max: 1.2};
      var expected = 'https://farm4.staticflickr.com/1234/987654321_afbd12_h.jpg';
      expect(getBgIURL(imageMD, markers, target, coeffs)).to.be.equal(expected);
    });
  });
});
