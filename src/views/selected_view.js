const PubSub = require('../helpers/pub_sub.js');

const SelectedView = function(element) {
  this.element = element;

};

//let counter = 1

SelectedView.prototype.dropdowned = function(stuff) {
  this.element.addEventListener('change', (evt) => {
    const selectedIndex = evt.target.value;
    console.log(selectedIndex);
    PubSub.publish('SelectView:change', selectedIndex);
    // if (counter > 0){
    // var audio = new Audio('audio1.5.mp3');
    // audio.play();
    // counter -= 1;
    //  }

  });
};








module.exports = SelectedView;
