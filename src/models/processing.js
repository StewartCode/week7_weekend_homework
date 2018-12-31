const PubSub = require('../helpers/pub_sub.js');
const DisplayResults = require('../views/display_results.js')
const MapAdd = require('../views/map_add.js');

const Processing = function(element) {
  this.element = element;
};

let fulldata;
let selectedView;
let audio = new Audio('audio1.2.mp3');

PubSub.subscribe('processing_to_app:decoded_data2', (fulldataSet) => {
  fulldata = fulldataSet;
});

Processing.prototype.rawDataPacket = function(y) {
  PubSub.subscribe('get_data_pass_to_processing:raw_data', (x) => {
    const m = x.detail;
    PubSub.publish('processing_to_app:decoded_data', m);
    PubSub.publish('processing_to_app:decoded_data2', m);
    PubSub.subscribe('SelectView:change', (z) => {
      selectedView = z.detail;
      const found = m.find(function(mzoom) {
        return mzoom.name === selectedView;
      });
      const postProcessData = new DisplayResults(found);
      postProcessData.sendToDisplay(this.element);
      PubSub.publish('processing_to_app:selectedData', found);
    })
    PubSub.subscribe('SelectView:change2', (z) => {
      selectedView = z.detail;
      const found = m.find(function(mzoom) {
        return mzoom.mass === selectedView;
      });
      const postProcessData = new DisplayResults(found);
      postProcessData.sendToDisplay(this.element);
      PubSub.publish('processing_to_app:selectedData', found);
    })
  })
};

PubSub.subscribe('from_app_to_processing:all_button', (b) => {
  const c = b.detail;
  c.addEventListener('click', eventClick);
});

function eventClick() {
  audio.play();

  event.preventDefault();
  const sentToMap = new MapAdd();
  data = fulldata.detail;
  for (d of data) {
    if (d.year !== undefined) {
      if (d.mass !== undefined) {
        if (d.reclong !== undefined) {
          sentToMap.addAPin2(d.reclong, d.reclat, d);
        }
      }
    }
  }
};

module.exports = Processing;
