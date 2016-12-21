var expect = require('chai').expect;
var c2f = require('../lib/helpers/helpers').celsius2fahrenheit;


describe('Helper module', function () {

  describe('celsius2fahrenheit function', function () {

    it('should convert degrees Celsius to Fahrenheit scale', function () {
      expect(c2f(0)).to.be.equal(32);
      expect(c2f(10)).to.be.equal(50);
      expect(c2f(20)).to.be.equal(68);
      expect(c2f(2)).to.be.equal(35.6);
    });
  });


});
