var expect = require('chai').expect;
var c2f = require('../lib/helpers/helpers').celsius2fahrenheit;
var detDayStr = require('../lib/helpers/helpers').determineDaytimeStr;

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

});
