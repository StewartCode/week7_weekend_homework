const PubSub = require('../helpers/pub_sub.js');
const MapAdd = require('./map_add.js');

const SelectedView = function(element) {
  this.element = element;

};

let audio = new Audio('audio1.2.mp3');

SelectedView.prototype.dropdowned = function(stuff) {
  this.element.addEventListener('change', (evt) => {
    const selectedIndex = evt.target.value;
    audio.play();
    PubSub.publish('SelectView:change', selectedIndex);
  });
};

SelectedView.prototype.dropdowned2 = function(stuff) {
  this.element.addEventListener('change', (evt) => {
    const selectedIndex = evt.target.value;
    audio.play();
    PubSub.publish('SelectView:change2', selectedIndex);
  });
};








module.exports = SelectedView;
