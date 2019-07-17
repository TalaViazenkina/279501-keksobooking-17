'use strict';

// модуль, отвечающий за активацию страницы при перетаскивании пина
(function () {

  // максимальная ширина карты (из CSS);
  var MAP_MAX_WIDTH = 1200;

  /**
  * координата Y левого верхнего угла метки на карте, диапазон (для главной метки)
  * @enum {number}
  */
  var LocationY = {
    MIN: window.data.LocationY.MIN - window.data.MAIN_PIN_HEIGHT,
    MAX: window.data.LocationY.MAX - window.data.MAIN_PIN_HEIGHT
  };

  /**
  * координата X левого верхнего угла метки на карте, диапазон (для главной метки)
  * @enum {number}
  */
  var locationX = {
    MIN: 0,
    max: window.data.map.offsetWidth - window.data.MAIN_PIN_WIDTH
  };

  // форма подачи объявления
  var adFormFieldsetArray = Array.prototype.slice.call(window.data.adForm.querySelectorAll('fieldset'));
  var adFormAddress = window.data.adForm.querySelector('#address'); // поля ввода координат адреса

  // форма фильтрации объявлений
  var mapFiltersSelectArray = Array.prototype.slice.call(window.filters.form.querySelectorAll('.map__filter')); // все селекты в форме фильтрации
  var mapFiltersFieldset = window.filters.form.querySelector('.map__features'); // филдсет в форме фильтрации


  var isFilterDisabled; // флаг заблокированной формы фильтров
  var isPageBlocked; // флаг заблокированной страницы

  /**
  * заполняет поле изначальными координатами метки
  */
  var enterCoordinateInitial = function () {
    adFormAddress.value = (window.data.MainPinInitial.X + window.data.MAIN_PIN_SIZE / 2) + ', ' + (window.data.MainPinInitial.Y + window.data.MAIN_PIN_SIZE / 2);
  };

  /**
  * перерасчитывает максимальную координату x метки при изменении ширины окна браузера
  */
  var updateCoordinate = function () {
    if (window.data.map.offsetWidth < MAP_MAX_WIDTH) {
      locationX.max = window.data.map.offsetWidth - window.data.MAIN_PIN_WIDTH;
    }
  };

  /**
  * заполняет поле координатами передвинутой метки
  */
  var enterCoordinate = function () {
    adFormAddress.value = (window.data.mainPin.offsetLeft + window.data.MAIN_PIN_WIDTH / 2) + ', ' + (window.data.mainPin.offsetTop + window.data.MAIN_PIN_HEIGHT);
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
    // если блок с картой не содержит класс map--faded, то добавляем его
    if (!window.data.map.classList.contains('map--faded')) {
      window.data.map.classList.add('map--faded');
    }
    // если форма добавления объявления не содержит класс ad-form--disabled, то добавляем его
    if (!window.data.adForm.classList.contains('ad-form--disabled')) {
      window.data.adForm.classList.add('ad-form--disabled');
    }

    // заблокируем фильтры
    window.utils.addDisabled(mapFiltersFieldset);

    mapFiltersSelectArray.forEach(function (it) {
      window.utils.addDisabled(it);
    });
    isFilterDisabled = true;

    // заблокируем поля формы подачи объявления
    adFormFieldsetArray.forEach(function (it) {
      window.utils.addDisabled(it);
    });

    // передадим изначальные координаты метки в поле адреса
    enterCoordinateInitial();

    isPageBlocked = true; // меняем флаг
  };

  /**
  * активирует страницу
  */
  var activatePage = function () {
    if (isPageBlocked) {
      window.data.map.classList.remove('map--faded');
      window.data.adForm.classList.remove('ad-form--disabled');

      // удаляем со всех элементов управления формой атрибут disabled
      adFormFieldsetArray.forEach(function (it) {
        window.utils.removeDisabled(it);
      });

      // зададим правильное значение минимальной цены для выбранного по умолчанию типа жилья
      window.form.getPrice(window.data.typePriceMap);

      isPageBlocked = false; // меняем флаг
    }
  };

  var onLoadSuccess = function (response) {
    // сохраним лишь те объявления, в которых есть offer
    window.data.adsList = response.filter(function (it) {
      return it.offer;
    });
    // запустим отрисовку меток
    window.pin.render(window.data.adsList.slice(0, window.data.ADS_MAX_NUMBER));
    // разблокируем форму с фильтрами
    if (isFilterDisabled) {
      window.utils.removeDisabled(mapFiltersFieldset);
      mapFiltersSelectArray.forEach(function (it) {
        window.utils.removeDisabled(it);
      });
      isFilterDisabled = false;
    }
  };


  // дезактивация страницы
  desactivatePage();

  window.addEventListener('resize', function () {
    window.debounce(updateCoordinate);
  });

  // перемещение главной метки
  window.data.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    activatePage(); // активируем страницу

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
      window.data.mainPin.style.top = checkCoord(window.data.mainPin.offsetTop, shift.y, LocationY.MIN, LocationY.MAX) + 'px'; // y
      window.data.mainPin.style.left = checkCoord(window.data.mainPin.offsetLeft, shift.x, locationX.MIN, locationX.max) + 'px'; // x

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
      // запускаем отрисовку меток похожих объявлений
      window.backend.load(onLoadSuccess, window.error);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  // активация страницы по enter
  window.data.mainPin.addEventListener('keydown', function (evt) {
    if (window.utils.isEnterEvent(evt)) {
      activatePage();
      window.backend.load(onLoadSuccess, window.error);
    }
  });

  window.map = {
    desactivatePage: desactivatePage
  };

})();
