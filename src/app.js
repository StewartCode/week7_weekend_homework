const GetData = require('./helpers/get_data.js');
const PubSub = require('./helpers/pub_sub.js');
const Processing = require('./models/processing.js');
const AppProcessing = require('./models/appProcessing.js');
const Display_Results = require('./views/display_results.js');
const SelectedView = require('./views/selected_view.js');
const MapAdd = require('./views/map_add.js');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Lets go now!!');

  const selectElement = document.querySelector('#meteorites');
  const selectElement2 = document.querySelector('#meteorites2');
  const selectElement3 = document.querySelector('#meteorites3');
  const selectElement4 = document.querySelector('#meteorites4');
  const selectElement5 = document.querySelector('#by-mass');
  const selectElementList = document.querySelector('#meteorite-data');
  const mapPackTarget = document.querySelector('#mappack');
  const allSwitch = document.querySelector('#all-switch');
  PubSub.publish('from_app_to_processing:all_button', allSwitch);
  const deleteButton = document.querySelector('#delete');
  PubSub.publish('from_app_to_mapadd:delete', deleteButton);
  const deleteAllButton = document.querySelector('#deleteAll')
  PubSub.publish('from_app_to_mapadd:deleteAll', deleteAllButton);
  const compareSwitch = document.querySelector('#switch')
  PubSub.publish('from_app_to_mapadd:switch', compareSwitch);
  const popupFind = document.querySelector('.mapboxgl-popup-tip')
  PubSub.publish('from_app_to_mapadd:popupFind', popupFind);

  const mapAdd = new MapAdd(mapPackTarget);
  mapAdd.addMap(mapPackTarget);

  const dropdown = new SelectedView(selectElement);
  dropdown.dropdowned(selectElement);
  const dropdown2 = new SelectedView(selectElement2);
  dropdown2.dropdowned(selectElement2);
  const dropdown3 = new SelectedView(selectElement3);
  dropdown3.dropdowned(selectElement3);
  const dropdown4 = new SelectedView(selectElement4);
  dropdown4.dropdowned(selectElement4);
  const dropdown5 = new SelectedView(selectElement5);
  dropdown5.dropdowned2(selectElement5); //mass

  const getData = new GetData();
  getData.getData();

  const processing = new Processing(selectElementList);
  processing.rawDataPacket(selectElement);

});
