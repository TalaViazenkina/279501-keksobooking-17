'use strict';

// модуль, отвечающий за активацию страницы при перетаскивании пина
(function () {
  var MAIN_PIN = window.util.MAP.querySelector('.map__pin--main'); // главная метка

  /**
  * изначальные координаты "главного пина" в состоянии "круглая метка"
  * @const
  * @type {number}
  */
  var MAIN_PIN_COORDINATE_X = MAIN_PIN.offsetLeft + window.parameter.MAIN_PIN_SIZE / 2;
  var MAIN_PIN_COORDINATE_Y = MAIN_PIN.offsetTop + window.parameter.MAIN_PIN_SIZE / 2;

  /**
  * координата Y левого верхнего угла метки на карте, диапазон (для главной метки)
  * @enum {number}
  */
  var LocationY = {
    MIN: window.parameter.LocationY.MIN - window.parameter.MAIN_PIN_HEIGHT,
    MAX: window.parameter.LocationY.MAX - window.parameter.MAIN_PIN_HEIGHT
  };

  /**
  * координата X левого верхнего угла метки на карте, диапазон (для главной метки)
  * @enum {number}
  */
  var LocationX = {
    MIN: 0,
    MAX: window.util.MAP.offsetWidth - window.parameter.MAIN_PIN_WIDTH
  };

  // форма подачи объявления
  var adFormFieldsetsList = window.util.adForm.querySelectorAll('fieldset');
  var adFormAddress = window.util.adForm.querySelector('#address'); // поля ввода координат адреса

  // форма фильтрации объявлений
  var mapFilters = window.util.MAP.querySelector('.map__filters');
  var mapFiltersSelectsList = mapFilters.querySelectorAll('.map__filter'); // все селекты в форме фильтрации
  var mapFiltersFieldset = mapFilters.querySelector('.map__features'); // филдсет в форме фильтрации

  var moveCount = 0; // флаг/счетчик передвижения мыши

  /**
  * заполняет поле изначальными координатами метки
  */
  var enterCoordinateInitial = function () {
    adFormAddress.value = MAIN_PIN_COORDINATE_X + ', ' + MAIN_PIN_COORDINATE_Y;
  };

  /**
  * заполняет поле координатами передвинутой метки
  */
  var enterCoordinate = function () {
    adFormAddress.value = (MAIN_PIN.offsetLeft + window.parameter.MAIN_PIN_WIDTH / 2) + ', ' + (MAIN_PIN.offsetTop + window.parameter.MAIN_PIN_HEIGHT);
  };

  /** сравнивает полученную координату с заданным диапазоном
  * @param {number} initialCoord
  * @param {number} shiftCoord
  * @param {number} minCoord
  * @param {number} maxCoord
  * @return {number}
  */
  var checkCoord = function (initialCoord, shiftCoord, minCoord, maxCoord) {
    var testCoord = initialCoord + shiftCoord;
    if (testCoord < minCoord) {
      testCoord = minCoord;
      return testCoord;
    }
    if (testCoord > maxCoord) {
      testCoord = maxCoord;
    }

    return testCoord;
  };

  /**
  * переводит страницу в неактивное состояние
  */
  var desactivatePage = function () {
    // добавим всем элементам управления формой атрибут disabled
    window.util.addDisabled(mapFiltersFieldset);

    for (var i = 0; i < mapFiltersSelectsList.length; i++) {
      window.util.addDisabled(mapFiltersSelectsList[i]);
    }

    for (i = 0; i < adFormFieldsetsList.length; i++) {
      window.util.addDisabled(adFormFieldsetsList[i]);
    }

    // передадим изначальные координаты метки в поле адреса
    enterCoordinateInitial();

    // зададим правильное значение минимальной цены для выбранного по умолчанию типа жилья
    window.form.getPrice(window.parameter.typePriceMap);

    moveCount = 0; // обнуляем счетчик передвижения мыши
  };

  /**
  * активирует страницу
  */
  var activatePage = function () {
    window.util.MAP.classList.remove('map--faded');
    window.util.adForm.classList.remove('ad-form--disabled');

    // удаляем со всех элементов управления формой атрибут disabled
    window.util.removeDisabled(mapFiltersFieldset);

    for (var i = 0; i < mapFiltersSelectsList.length; i++) {
      window.util.removeDisabled(mapFiltersSelectsList[i]);
    }

    for (i = 0; i < adFormFieldsetsList.length; i++) {
      window.util.removeDisabled(adFormFieldsetsList[i]);
    }
  };


  // дезактивация страницы
  desactivatePage();

  // перемещение главной метки
  MAIN_PIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    moveCount += 1;

    if (moveCount === 1) {
      activatePage();
    }

    var dragged = false; // флаг, который будет показывать было ли перемещение мыши

    // определяем координаты курсора в момент нажатия мышки
    var startCoord = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
      * обработчик передвижения мышки
      * @param {MouseEvent} moveEvt
      */
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      dragged = true;

      // определяем сдвиг курсора относительно предыдущего положения
      var shift = {
        x: moveEvt.clientX - startCoord.x,
        y: moveEvt.clientY - startCoord.y
      };

      // задаем новые координаты для метки в стили
      MAIN_PIN.style.top = checkCoord(MAIN_PIN.offsetTop, shift.y, LocationY.MIN, LocationY.MAX) + 'px'; // y
      MAIN_PIN.style.left = checkCoord(MAIN_PIN.offsetLeft, shift.x, LocationX.MIN, LocationX.MAX) + 'px'; // x

      // записываем измененные координаты в поле ввода
      enterCoordinate();

      // записываем в стартовые координаты текущие координаты курсора
      startCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (!dragged) {
        enterCoordinate(); // записываем координаты в поле ввода в случае, если не было перемещения мыши
      }

      window.pin.getNewPinList(window.parameter.ADS_NUMBER, window.data); // запускаем отрисовку меток похожих объявлений

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

})();