'use strict';

// модуль фильтрации объявлений
(function () {
  window.filters = {
    form: window.data.MAP.querySelector('.map__filters') // форма с фильтрами
  };

  var selectType = window.filters.form.querySelector('select[name=housing-type]'); // фильтр типа жилья
  var selectPrice = window.filters.form.querySelector('select[name=housing-price]'); // фильтр стоимости
  var selectRoom = window.filters.form.querySelector('select[name=housing-rooms]'); // фильтр количества комнат
  var selectGuest = window.filters.form.querySelector('select[name=housing-guests]'); // фильтр гостей

  // фильтры удобств
  var wifi = window.filters.form.querySelector('#filter-wifi');
  var dishwasher = window.filters.form.querySelector('#filter-dishwasher');
  var parking = window.filters.form.querySelector('#filter-parking');
  var washer = window.filters.form.querySelector('#filter-washer');
  var elevator = window.filters.form.querySelector('#filter-elevator');
  var conditioner = window.filters.form.querySelector('#filter-conditioner');


  // переменные для хранения текущего значения выбранного фильтра
  // зададим "стартовое" значение
  var selectedTypeValue = selectType.value;
  var selectedPriceValue = selectPrice.value;
  var selectedRoomValue = selectRoom.value;
  var selectedGuestValue = selectGuest.value;

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
    },
    'housing-rooms': function (val) {
      selectedRoomValue = val;
    },
    'housing-guests': function (val) {
      selectedGuestValue = val;
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

  /**
  * сравнивает количество комнат
  * @param {Object} it
  * @return {boolean}
  */
  var checkRoomValue = function (it) {
    if (selectedRoomValue === unselectedValue) {
      return true;
    }
    return it.offer.rooms.toString() === selectedRoomValue;
  };

    /**
  * сравнивает количество гостей
  * @param {Object} it
  * @return {boolean}
  */
  var checkGuestValue = function (it) {
    if (selectedGuestValue === unselectedValue) {
      return true;
    }
    return it.offer.guests.toString() === selectedGuestValue;
  };

  /**
  * проверяет выбранные удобства
  * @param {HTMLInputElement} input
  * @param {Object} it
  * @return {boolean}
  */

  var checkFeatures = function (input, it) {
    if (!input.checked) {
      return true;
    }
    return it.offer.features.indexOf(input.value) !== -1;
  };


  // добавим обработчик события change на всю форму,
  // а выбранный фильтр будем отслеживать по evt.target
  window.filters.form.addEventListener('change', function (evt) {
    // удалим карточку объявления
    window.card.remove();

    if (evt.target.name !== 'features') {
      // запишем значение выбранного фильтра в соответствующую переменную
      nameSelectedValueMap[evt.target.name](evt.target.value);
    }

    // отфильтруем данные
    filteredData = window.data.adsList.filter(function (ad) {
      return checkTypeValue(ad) && checkPriceValue(ad) && checkRoomValue(ad) && checkGuestValue(ad) && checkFeatures(wifi, ad) && checkFeatures(dishwasher, ad) && checkFeatures(parking, ad) && checkFeatures(washer, ad) && checkFeatures(elevator, ad) && checkFeatures(conditioner, ad);
    });

    // запустим отрисовку отфильтрованных меток
    window.debounce(updateAdsList);
  });

})();
