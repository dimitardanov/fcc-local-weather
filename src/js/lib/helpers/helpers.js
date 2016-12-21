

function parseQueryStr (searchStr) {
  var qObj = {};
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


function flickrCreateBbox (coords, coordTols) {
  var latMin = Math.max(coords.lat - coordTols.lat, -90);
  var latMax = Math.min(coords.lat + coordTols.lat, 90);
  var lonMin = Math.max(coords.lon - coordTols.lon, -180);
  var lonMax = Math.min(coords.lon + coordTols.lon, 180);
  return [lonMin, latMin, lonMax, latMax];
}


module.exports = {
  parseQueryStr: parseQueryStr,
  determineDaytimeStr: determineDaytimeStr,
  randIndex: randIndex,
  celsius2fahrenheit:celsius2fahrenheit,
  flickrCreateBbox: flickrCreateBbox
};
