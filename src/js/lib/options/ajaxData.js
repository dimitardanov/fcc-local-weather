

function AjaxData (url, query) {
  this.url = url;
  this.queryData = query;
}

AjaxData.prototype.getURL = function () {
  return this.url;
};

AjaxData.prototype.getQueryData = function () {
  return this.queryData;
};

module.exports = AjaxData;
