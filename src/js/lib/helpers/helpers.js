

function parseQueryStr () {
  var qObj = {};
  var location = window.location.search.slice(1).split('&');
  location.forEach(function (item) {
    kv = item.split('=');
    qObj[kv[0]] = kv[1];
  });
  return qObj;
}

module.exports = {
  parseQueryStr: parseQueryStr
};
