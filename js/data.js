'use strict';

// модуль с исходными параметрами и данными
(function () {
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main'); // главная метка
  var adForm = document.querySelector('.ad-form'); // форма добавления объявлений

  window.data = {

    ADS_MAX_NUMBER: 5, // максимальное количество похожих объявлений, отображаемое на карте
    /**
    * тип недвижимости
    * @enum {string}
    */
    OFFER_TYPES: ['palace', 'flat', 'house', 'bungalo'],

    /**
    * координата Y острия метки на карте, допустимый диапазон
    * @enum {number}
    */
    LocationY: {
      MIN: 130,
      MAX: 630
    },

    /**
    * размеры пина для объявления из CSS
    * @const
    * @type {number}
    */
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,

    /**
    * размеры "главного пина" (изначальной метки) из CSS, состояние "с острым концом"
    * @const
    * @type {number}
    */
    MAIN_PIN_WIDTH: 65,
    MAIN_PIN_HEIGHT: 81, // складывается из диаметра круга плюс высота треугольника-острия минус смещение острия по вертикали

    /**
    * диаметр "главного пина" (изначальной метки) из CSS, состояние "круглая метка"
    * @const
    * @type {number}
    */
    MAIN_PIN_SIZE: 65,

    map: map,
    mainPin: mainPin,
    adForm: adForm,

    // начальные координаты главной метки
    MainPinInitial: {
      X: mainPin.offsetLeft,
      Y: mainPin.offsetTop
    },

    // создадим объект-мапу для хранения зависимости минимальной стоимости от типа жилья
    typePriceMap: {
      'bungalo': 0,
      'flat': 1000,
      'house': 5000,
      'palace': 10000
    },

    // переменная для хранения данных с сервера
    adsList: [],

    /**
    * возвращает главную метку в центр
    */
    movePinToInitial: function () {
      window.data.mainPin.style.top = window.data.MainPinInitial.Y + 'px';
      window.data.mainPin.style.left = window.data.MainPinInitial.X + 'px';
    }

  };

})();
