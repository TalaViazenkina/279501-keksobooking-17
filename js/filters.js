'use strict';

// модуль фильтрации объявлений
(function () {
  window.filters = {
    mapFilters: window.utils.MAP.querySelector('.map__filters') // форма с фильтрами
  };

  // объект-мапа соответствия выбранных фильтров и полей в объявлении
  var nameOfferMap = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'features': 'features'
  };

  window.filters.mapFilters.addEventListener('change', function (evt) {
    var filteredData = window.data.adsList.filter(function (ad) {
      return ad.offer[nameOfferMap[evt.target.name]] === evt.target.value;
    });

    console.log('Выбрали фильтр ' + evt.target.name);
    console.log('выбрали значение ' + evt.target.value);

    console.log(filteredData);
    console.log(nameOfferMap[evt.target.name]);
    window.pin.getNewPinList(filteredData.slice(0, window.data.ADS_MAX_NUMBER));
  });

})();
