const PubSub = require('../helpers/pub_sub.js');
const Processing = require('../models/processing')
const MapAdd = require('./map_add.js');
const DisplayResults = function(found) {
  this.found = found;
};

DisplayResults.prototype.sendToDisplay = function(target) {
  PubSub.publish('from_display_results_to_map:selected_data_set', this.found)

  target.innerHTML = '';
  info = this.found;

  const test = new MapAdd(info.reclong, info.reclat, info.name)
  test.popup(info.reclong, info.reclat, info);

 };

module.exports = DisplayResults;
