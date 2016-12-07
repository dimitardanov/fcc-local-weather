
var flickrOpts = {
  imageMinCoeff: 0.8,
  imageMaxCoeff: 1.6,
  imageSizeMarkers: ['t', 'm', 'n', 'z', 'c', 'l', 'b', 'h', 'k', 'o'],
  getImageSizeMarkers: function () {
    return this.imageSizeMarkers;
  },
  getImageSizeCoeff: function () {
    return { max: this.imageMaxCoeff, min: this.imageMinCoeff };
  }
};


function selectPhoto (fData) {
  if (fData.length === 1) {
    return fData[0];
  }

  fData = createImageURLData(fData);
  fData = fData.filter(function (item) {
    return item.hasOwnProperty('url_t') && item.hasOwnProperty('url');
  });
  var randIndex = Math.floor(Math.random() * fData.length);
  return fData[randIndex];
}

function createImageURLData (items) {
  items.forEach(function (item) {
    createImageURLDataPerItem(item);
  });
  return items;
}

function createImageURLDataPerItem (item) {
  flickrOpts.getImageSizeMarkers().forEach(function (m) {
    var prop = 'url_' + m;
    if (item.hasOwnProperty(prop) && isURLImageWithinBounds(item, m)) {
      item.url = item[prop];
    }
  });
  return item;
}

function isURLImageWithinBounds (item, marker) {
  var imageW = getImageWidth(item, marker);
  var imageH = getImageHeight(item, marker);
  var screenW = screen.width;
  var screenH = screen.height;
  var minReqW = flickrOpts.getImageSizeCoeff().min * imageW <= screenW;
  var minReqH = flickrOpts.getImageSizeCoeff().min * imageH <= screenH;
  var maxReqW = screenW <= flickrOpts.getImageSizeCoeff().max * imageW;
  var maxReqH = screenH <= flickrOpts.getImageSizeCoeff().max * imageH;
  return ((minReqW && maxReqW) && (minReqH && maxReqH));
}

function getImageWidth (item, marker) {
  return item['width_' + marker];
}

function getImageHeight (item, marker) {
  return item['height_' + marker];
}


module.exports = selectPhoto;
