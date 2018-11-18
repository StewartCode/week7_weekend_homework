const PubSub = require('../helpers/pub_sub.js');
const DisplayResults = require('../views/display_results.js')
const MapAdd = require('../views/map_add.js');

const Processing = function(element) {
  this.element = element;
};

let fulldata;
let selectedView;
// PubSub.publish('from_processing_to_map:selected_data_set', selectedView)
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
  //console.log('triggerggjgAllPoints');
  event.preventDefault();
  const sentToMap = new MapAdd();
  //console.log('triggerggjgAllPoints2');
  data = fulldata.detail;
  for (d of data) {
    if (d.reclong !== undefined) {
      sentToMap.addAPin2(d.reclong, d.reclat);
    }
  }
};


module.exports = Processing;
