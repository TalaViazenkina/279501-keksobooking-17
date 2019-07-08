'use strict';

// модуль фильтрации объявлений
(function () {
  window.filters = {
    form: window.data.MAP.querySelector('.map__filters') // форма с фильтрами
  };

  var selectType = window.filters.form.querySelector('select[name=housing-type]'); // фильтр типа жилья
  var selectPrice = window.filters.form.querySelector('select[name=housing-price]'); // фильтр стоимости

  // переменные для хранения текущего значения выбранного фильтра
  // зададим "стартовое" значение
  var selectedTypeValue = selectType.value;
  var selectedPriceValue = selectPrice.value;

  var unselectedValue = 'any'; // значение "невыбранного" фильтра


  // массив для хранения отфильтрованного списка объявлений
  var filteredData = [];

  /**
  * запускает отрисовку отфильтрованных объявлений
  */
  var updateAdsList = function () {
    window.pin.render(filteredData.slice(0, window.data.ADS_MAX_NUMBER));
  };


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

  /**
  * сравнивает тип жилья
  * @param {Object} it
  * @return {boolean}
  */
  var checkTypeValue = function (it) {
    if (selectedTypeValue === unselectedValue) {
      return true;
    }
    return it.offer.type === selectedTypeValue;
  };

    /**
  * сравнивает стоимость жилья
  * @param {Object} it
  * @return {boolean}
  */
  var checkPriceValue = function (it) {
    if (selectedPriceValue === unselectedValue) {
      return true;
    } else if (selectedPriceValue === 'high') {
      return it.offer.price >= priceNumberMap[selectedPriceValue];
    }
    return it.offer.price >= priceNumberMap[selectedPriceValue].min
    && it.offer.price < priceNumberMap[selectedPriceValue].max;
  };


  // добавим обработчик события change на всю форму,
  // а выбранный фильтр будем отслеживать по evt.target
  window.filters.form.addEventListener('change', function (evt) {
    // запишем значение выбранного фильтра в соответствующую переменную
    nameSelectedValueMap[evt.target.name](evt.target.value);

    // отфильтруем данные
    filteredData = window.data.adsList.filter(function (ad) {
      return checkTypeValue(ad) && checkPriceValue(ad);
    });

    // запустим отрисовку отфильтрованных меток
    window.debounce(updateAdsList);
  });

})();
