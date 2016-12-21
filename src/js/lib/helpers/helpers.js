

function parseQueryStr (searchStr) {
  var qObj = {};
  searchStr = searchStr || window.location.search;
  if (searchStr) {
    var search = searchStr.slice(1).split('&');
    search.forEach(function (item) {
      kv = item.split('=');
      qObj[kv[0]] = kv[1];
    });
  }
  return qObj;
}

function determineDaytimeStr (date) {
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

function celsius2fahrenheit (tempC) {
  return tempC * 1.8 + 32;
}


module.exports = {
  parseQueryStr: parseQueryStr,
  determineDaytimeStr: determineDaytimeStr,
  randIndex: randIndex,
  celsius2fahrenheit:celsius2fahrenheit
};
