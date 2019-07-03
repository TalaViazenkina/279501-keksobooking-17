'use strict';

// модуль фильтрации объявлений
(function () {
  window.filters = {
    mapFilters: window.utils.MAP.querySelector('.map__filters') // форма с фильтрами
  };

  var selectType = window.filters.mapFilters.querySelector('select[name=housing-type]'); // фильтр типа жилья
  var selectPrice = window.filters.mapFilters.querySelector('select[name=housing-price]'); // фильтр стоимости

  var unselectedValue = 'any'; // значение "невыбранного" фильтра

  // переменные для хранения текущего значения выбранного фильтра
  // зададим "стартовое" значение
  var selectedTypeValue = selectType.value;
  var selectedPriceValue = selectPrice.value;


  // объект-мапа для хранения зависимости выбранного фильтра и функции, изменяющей соответствующую переменную
  var nameSelectedValueMap = {
    'housing-type': function (val) {
      selectedTypeValue = val;
    },
    'housing-price': function (val) {
      selectedPriceValue = val;
    }
  };

  // объект-мапа для перевода значений фильтра "Стоимость" в цифры
  var priceNumberMap = {
    'low': {
      min: 0,
      max: 10000
    },

    'middle': {
      min: 10000,
      max: 50000
    },

    'high': 50000
  };


  // создадим функции сравнения отдельных параметров объявления с выбранными фильтрами
  // потом на основе их соберем общий фильтр;

  // по типу жилья
  var checkTypeValue = function (it) {
    if (selectedTypeValue === unselectedValue) {
      return true;
    }
    return it.offer.type === selectedTypeValue;
  };

  // по стоимости жилья
  var checkPriceValue = function (it) {
    if (selectedPriceValue === unselectedValue) {
      return true;
    } else if (selectedPriceValue === 'high') {
      return it.offer.price >= priceNumberMap.hight;
    }
    return it.offer.price >= priceNumberMap[selectedPriceValue].min
    && it.offer.price >= priceNumberMap[selectedPriceValue].max;
  };

  window.filters.mapFilters.addEventListener('change', function (evt) {
    nameSelectedValueMap[evt.target.name](evt.target.value);

    var filteredData = window.data.adsList.filter(function (ad) {
      return checkTypeValue(ad) && checkPriceValue(ad);
    });


    window.pin.getNewPinList(filteredData.slice(0, window.data.ADS_MAX_NUMBER));
  });

})();
