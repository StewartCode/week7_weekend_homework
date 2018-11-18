const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const PubSub = require('../helpers/pub_sub.js');
const GetData = require('../helpers/get_data.js');
const Display_Results = require('./display_results.js');


const MapAdd = function(target) {
  this.target = target;
  //console.log(this.target);
};

let map;
let marker;
let popup;
let popupOffsets;
let counter = 1;


MapAdd.prototype.addMap = function(x) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibGluZG9ucGVhc2xleSIsImEiOiJjam9rbHllODAwM3R6M3ByeTBicTN4N3ZyIn0.GY5WQ4ZDwAHUxQIUsqBlmQ';
  map = new mapboxgl.Map({
    container: (x),
    style: 'mapbox://styles/mapbox/streets-v10'
  });

  PubSub.subscribe('processing_to_app:selectedData', (data) => {
    target = data.detail;
    this.addAPin(target.reclong, target.reclat)
  });

};
MapAdd.prototype.addAPin = function(long, lat) {
  marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
};

MapAdd.prototype.popup = function(long, lat, string) {

  //**************************************************************** to the next stars not working mouse hover
  map.on('mouseenter', 'places', function(e) {
    console.log(e);
    //Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
    //    Ensure that if the map is zoomed out such that multiple
    //    copies of the feature are visible, the popup appears
    //    over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;

      popup.setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    }
  });

  map.on('mouseleave', 'places', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

  //*******************************************************************

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
      className: 'my-class'
    })

    .setLngLat([long, lat])
    .setHTML('<p id="description">Location :</p>' + string.name +
      '<p id="description">Mass :</p>' + string.mass + " " + "Grams" +
      '<p id="description">Year :</p>' + string.year[0] + string.year[1] + string.year[2] + string.year[3]
    )
    .addTo(map);
};


MapAdd.prototype.addAPin2 = function(long, lat, ) {
  marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
};

PubSub.subscribe('from_app_to_mapadd:delete', (l) => {
  target = l.detail;
  target.addEventListener('click', deleteHandler)
});

deleteHandler = function(){
  marker.remove();
  popup.remove();
}
MapAdd.prototype.deleteLastPoint = function () {
  console.log('loop start');
  if(counter < 1){
    marker.remove();
    //popup.remove();
    console.log('no log');
    counter -= 1;
    console.log('loop end');
  }
  counter -= 1;
  console.log('counter post');
};
MapAdd.prototype.deleteLastPopup = function () {
  console.log('loop start');
  if(counter < 1){
    popup.remove();
    //marker.remove();
    console.log('no log');
    counter -= 1;
    console.log('loop end');
  }
  counter -= 1;
  console.log('counter post');
};


module.exports = MapAdd;
