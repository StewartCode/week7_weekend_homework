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
    //this.popup(long, lat);
    //console.log(popupOffsets);
  };

  MapAdd.prototype.popup = function (long, lat, string) {
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
    .setHTML('<p>Location::</p>' + string.name +
            '<p>Mass::</p>' + string.mass + " " + "tons"
  )
    .addTo(map);
};


MapAdd.prototype.addAPin2 = function(long, lat,) {
  marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map);
};




module.exports = MapAdd;
