var expect = require('chai').expect;
var c2f = require('../lib/helpers/helpers').celsius2fahrenheit;
var detDayStr = require('../lib/helpers/helpers').determineDaytimeStr;
var parseQS = require('../lib/helpers/helpers').parseQueryStr;
var createBBox = require('../lib/helpers/helpers').flickrCreateBbox;

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

});
