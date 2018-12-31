const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const PubSub = require('../helpers/pub_sub.js');
const GetData = require('../helpers/get_data.js');
const Display_Results = require('./display_results.js');

const MapAdd = function(target) {
  this.target = target;
};

let map;
let marker;
let popup;
let popupOffsets;
let counter = 0;
const popupArray = [];
const markerArray = [];
const markerArray2 = [];
let count = 0;
let amountOfTags = 0;
let compareSwitch = false;
let audio = new Audio('audio1.2.mp3');

PubSub.subscribe('from_app_to_mapadd:switch', (pass) => {
  const compareSwitch = pass.detail;
  compareSwitch.addEventListener("click", handleCompareSwitch)
});
const handleCompareSwitch = function() {
  audio.play();
  if (compareSwitch === false) {
    compareSwitch = true;
    map.flyTo({
      center: [0, 0],
      zoom: 1,
      speed: 1,
      curve: 3,
      easing(t) {
        return t;
      }
    });
  } else {
    compareSwitch = false;
    if (amountOfTags > 0) {
      map.flyTo({
        center: [target.reclong, target.reclat],
        zoom: 2,
        speed: 1,
        curve: 3,
        easing(t) {
          return t;
        }
      });
    }
  }
};

MapAdd.prototype.deleteWhenAdding = function() {
  if (compareSwitch === false) {
    markerArray[counter].remove();
    popupArray[counter].remove();
    counter += 1;
    amountOfTags -= 1;
  }
};

MapAdd.prototype.addMap = function(x) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibGluZG9ucGVhc2xleSIsImEiOiJjam9rbHllODAwM3R6M3ByeTBicTN4N3ZyIn0.GY5WQ4ZDwAHUxQIUsqBlmQ';
  map = new mapboxgl.Map({
    container: (x),
    style: 'mapbox://styles/mapbox/streets-v10'
  });

  map.flyTo({
    center: [0, 0],
    zoom: 1,
    speed: 100,
    curve: 1,
    easing(t) {
      return t;
    }
  });

  PubSub.subscribe('processing_to_app:selectedData', (data) => {
    target = data.detail;
    this.addAPin(target.reclong, target.reclat)
    if (compareSwitch === false) {
      map.flyTo({
        center: [target.reclong, target.reclat],
        zoom: 2,
        speed: 1,
        curve: 2,
        easing(t) {
          return t;
        }
      });
    }
  });
};

MapAdd.prototype.addAPin = function(long, lat) {
  marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
  markerArray.push(marker);
  if (count > 0) {
    this.deleteWhenAdding();
  };
  count += 1;
  amountOfTags += 1;
};

//this is for the secret buttom
MapAdd.prototype.addAPin2 = function(long, lat, data) {
  marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
  markerArray2.push(marker);
};

MapAdd.prototype.popup = function(long, lat, string) {

  let weight = string.mass;
  let metric = "Grams"

  if (weight.length === 4) {
    metric = "Kg"
    weight = weight.slice(0, 1);
  };
  if (weight.length === 5) {
    metric = "Kg"
    weight = weight.slice(0, 2);
  };
  if (weight.length === 6) {
    metric = "Kg"
    weight = weight.slice(0, 3);
  };
  if (weight.length === 7) {
    metric = "Tons"
    weight = weight.slice(0, 1);
  };
  if (weight.length === 8) {
    metric = "Tons"
    weight = weight.slice(0, 2);
  };

  let markerHeight = 50,
    markerRadius = 10,
    linearOffset = 25;
  popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'left': [markerRadius, (markerHeight - markerRadius) * -1],
    'right': [-markerRadius, (markerHeight - markerRadius) * -1]
  };
  popup = new mapboxgl.Popup({
      offset: popupOffsets,
      className: 'pop-ups',
      closeOnClick: false
    })
    .setLngLat([long, lat])

    .setHTML('<p id="description">Location :</p>' + string.name +
      '<p id="description">Mass :</p>' + weight + " " + metric +
      '<p id="description">Class :</p>' + string.recclass +
      '<p id="description">Year :</p>' + string.year[0] + string.year[1] + string.year[2] + string.year[3]
    )
    .addTo(map);
  popupArray.push(popup);


  map.on('click', function(e) {

    // console.log('e', e.lngLat.lng, e.lngLat.lat);
    // console.log('marker', marker._lngLat.lng, marker._lngLat.lat);
    // console.log('popup', popup._lngLat.lng, popup._lngLat.lat);
    // console.log('popup', popupArray[0])

    const pointer = {
      long: Number((e.lngLat.lng).toFixed(0)),
      latt: Number((e.lngLat.lat).toFixed(0))
    }
    const target = {
      long: Number((marker._lngLat.lng).toFixed(0)),
      latt: Number((marker._lngLat.lat).toFixed(0))
    }

    console.log('pointer', pointer.long, pointer.latt);
    console.log('target', target.long, target.latt);

    const targetHighLong = target.long + 0;
    const targetLowLong = target.long - 6;
    const targetHighLatt = target.latt + 6;
    const targetLowLatt = target.latt - 0;

    if (pointer.long > targetLowLong && pointer.long < targetHighLong &&
      pointer.latt > targetLowLatt && pointer.latt < targetHighLatt
    ) {
      for (var i = 0; i < popupArray.length; i++) {
        if (popupArray[i]._lngLat.lng === marker._lngLat.lng) {
          popupArray[i].addTo(map);
        }
        // console.log('this is the array iteration',popupArray[i]._lngLat.lng);
        // console.log(marker._lngLat.lng);
        // console.log(popupArray);
      }
    }
  });
};

PubSub.subscribe('from_app_to_mapadd:delete', (l) => {
  const target = l.detail;
  target.addEventListener('click', deleteHandler)
});

const deleteHandler = function() {
  audio.play();

  markerArray[counter].remove();
  popupArray[counter].remove();
  count -= 1

  if (count === 0) {
    map.flyTo({
      center: [0, 0],
      zoom: 1,
      speed: 8,
      curve: 1,
      easing(t) {
        return t;
      }
    });
  }
  counter += 1;
  amountOfTags -= 1;
  if (count < 0) {
    count = 0
  }
}

PubSub.subscribe('from_app_to_mapadd:deleteAll', (pass) => {
  const deleteAllButton = pass.detail;
  deleteAllButton.addEventListener('click', handleDeleteAll)
});
const handleDeleteAll = function() {
  audio.play();

  for (var i = 0; i < popupArray.length; i++) {
    popupArray[i].remove();
  }
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].remove();
  }
  for (var i = 0; i < markerArray2.length; i++) {
    markerArray2[i].remove();
  }
  count = 0;
  counter = 0;
  popupArray.length = 0;
  markerArray.length = 0;
  markerArray2.length = 0;
  amountOfTags = 0;

  map.flyTo({
    center: [0, 0],
    zoom: 1,
    speed: 100,
    curve: 1,
    easing(t) {
      return t;
    }
  });
}

module.exports = MapAdd;