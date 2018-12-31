const PubSub = require('../helpers/pub_sub.js');

PubSub.subscribe('processing_to_app:decoded_data', (data) => {

  const meteorite = data.detail;
  let array = [];
  let counter = 1000;
  let counter2 = 100;
  let target;
  let option;
  for (m of meteorite) {

    if (m.mass !== undefined) {
      array.push(m.mass);
    };
    if (m.year !== undefined) {
      if (m.mass !== undefined) {
        if (m.reclong !== undefined) {

          if (counter > 0 && counter < 251) {
            target = document.querySelector('#meteorites4');
            option = document.createElement('option');
            counter -= 1;
            option.id = m.name;
            option.textContent = m.name;
            target.appendChild(option);
          }
          if (counter > 250 && counter < 501) {
            target = document.querySelector('#meteorites3');
            option = document.createElement('option');
            counter -= 1;
            option.id = m.name;
            option.textContent = m.name;
            target.appendChild(option);
          };
          if (counter > 500 && counter < 751) {
            target = document.querySelector('#meteorites2');
            option = document.createElement('option');
            counter -= 1;
            option.id = m.name;
            option.textContent = m.name;
            target.appendChild(option);
          };
          if (counter > 750 && counter < 1001) {
            target = document.querySelector('#meteorites');
            option = document.createElement('option');
            counter -= 1;
            option.id = m.name;
            option.textContent = m.name;
            target.appendChild(option);
          }
        };
      }
    }
  };
  array.sort(function(a, b) {
    return b - a
  });
  let array2 = [...new Set(array)];
  if (counter2 > 0) {
    for (z of array2) {
      target = document.querySelector('#by-mass');
      option = document.createElement('option');
      counter2 -= 1;
      option.id = z;
      option.textContent = z;
      target.appendChild(option);
    }
  }
});
