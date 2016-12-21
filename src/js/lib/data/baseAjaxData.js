
var helpers = require('../helpers/helpers.js');

function AjaxData (url, query) {
  this.url = url;
  this.queryData = query;
  this.queryObjStr = helpers.parseQueryStr(window.location.search);
}

AjaxData.prototype.getURL = function () {
  return this.url;
};

AjaxData.prototype.getQueryData = function () {
  return this.queryData;
};

module.exports = AjaxData;
