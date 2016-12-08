

function parseQueryStr () {
  var qObj = {};
  var location = window.location.search.slice(1).split('&');
  location.forEach(function (item) {
    kv = item.split('=');
    qObj[kv[0]] = kv[1];
  });
  return qObj;
}

function determineDaytimeStr () {
  var date = new Date();
  var hour = date.getHours();
  if (hour > 6 && hour < 18) {
    return 'day';
  } else {
    return 'night';
  }
}

function randIndex (len) {
  return Math.floor(Math.random() * len);
}

module.exports = {
  parseQueryStr: parseQueryStr,
  determineDaytimeStr: determineDaytimeStr,
  randIndex: randIndex
};
