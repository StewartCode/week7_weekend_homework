const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const PubSub = require('../helpers/pub_sub.js');

const MapAdd = function(target) {
  this.target = target;

};

MapAdd.prototype.addMap = function (x) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibGluZG9ucGVhc2xleSIsImEiOiJjam9rbHllODAwM3R6M3ByeTBicTN4N3ZyIn0.GY5WQ4ZDwAHUxQIUsqBlmQ';
  var map = new mapboxgl.Map({
    container: (x),
    style: 'mapbox://styles/mapbox/streets-v10'
  });

  PubSub.subscribe('processing_to_app:selectedData', (data) => {
    target = data.detail;
    console.log('this is the data for the map',target.reclat);
    console.log('this is the data for the map',target.reclong);
    var marker = new mapboxgl.Marker()
    marker.remove()
    .setLngLat([target.reclong, target.reclat])
    .addTo(map);

  });
};






module.exports = MapAdd;
