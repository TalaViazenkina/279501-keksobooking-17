'use strict';

// константы
var MAP = document.querySelector('.map'); // карта
var MAIN_PIN = MAP.querySelector('.map__pin--main'); // главная метка

/**
* количество объявлений, которые необходимо сгенерировать
* @const
* @type {number}
*/
var ADS_NUMBER = 8;

/**
* размеры пина для объявления из CSS
* @const
* @type {number}
*/
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

/**
* размеры "главного пина" (изначальной метки) из CSS, состояние "с острым концом"
* @const
* @type {number}
*/
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 81; // складывается из диаметра круга плюс высота треугольника-острия минус смещение острия по вертикали

/**
* диаметр "главного пина" (изначальной метки) из CSS, состояние "круглая метка"
* @const
* @type {number}
*/
var MAIN_PIN_SIZE = 65;

/**
* изначальные координаты "главного пина" в состоянии "круглая метка"
* @const
* @type {number}
*/
var MAIN_PIN_COORDINATE_X = MAIN_PIN.offsetLeft + MAIN_PIN_SIZE / 2;
var MAIN_PIN_COORDINATE_Y = MAIN_PIN.offsetTop + MAIN_PIN_SIZE / 2;


/**
* тип недвижимости
* @enum {string}
*/
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

/**
* координата Y острия метки на карте, диапазон (для похожих меток)
* @enum {number}
*/
var LocationMarkerY = {
  MIN: 130,
  MAX: 630
};

/**
* координата Y левого верхнего угла метки на карте, диапазон (для главной метки)
* @enum {number}
*/
var LocationY = {
  MIN: LocationMarkerY.MIN - MAIN_PIN_HEIGHT,
  MAX: LocationMarkerY.MAX - MAIN_PIN_HEIGHT
};

/**
* координата X левого верхнего угла метки на карте, диапазон (для главной метки)
* @enum {number}
*/
var LocationX = {
  MIN: 0,
  MAX: MAP.offsetWidth - MAIN_PIN_WIDTH
};

/**
* координата X острия метки на карте, диапазон (для похожих меток)
* @enum {number}
*/
var LocationMarkerX = {
  MIN: 0 + PIN_WIDTH / 2,
  MAX: MAP.offsetWidth - PIN_WIDTH / 2
};

// DOM-объекты
var mapPinList = MAP.querySelector('.map__pins'); // блок с метками

var mapPinTemplate = document.querySelector('#pin') // шаблон метки
  .content
  .querySelector('button');

// форма фильтрации объявлений
var mapFilters = MAP.querySelector('.map__filters');
var mapFiltersSelectsList = mapFilters.querySelectorAll('.map__filter'); // все селекты в форме фильтрации
var mapFiltersFieldset = mapFilters.querySelector('.map__features'); // филдсет в форме фильтрации

// форма добавления объявлений
var adForm = document.querySelector('.ad-form');
var adFormFieldsetsList = adForm.querySelectorAll('fieldset');
var adFormAddress = adForm.querySelector('#address'); // поля ввода координат адреса
var adFormType = adForm.querySelector('#type'); // поле выбора типа жилья
var adFormPrice = adForm.querySelector('#price'); // поле ввода цены за ночь
var adFormTimeIn = adForm.querySelector('#timein'); // поле ввода времени заезда
var adFormTimeOut = adForm.querySelector('#timeout'); // поле ввода времени выезда

/**
* генерирует случайный элемент массива
* @param {array} arr
* @return {(number|string|boolean|Array|Object)}
*/
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
* генерирует случайное число из диапазона
* @param {number} min
* @param {number} max
* @return {number}
*/
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

/**
* создает случайное объявление
* @param {number} numericalItem
* @return {Object}
*/
var generateAd = function (numericalItem) {
  return {
    'author': {
      'avatar': 'img/avatars/user0' + numericalItem + '.png'
    },
    'offer': {
      'type': getRandomArrayItem(OFFER_TYPES)
    },
    'location': {
      'x': getRandomNumber(LocationMarkerX.MIN, LocationMarkerX.MAX),
      'y': getRandomNumber(LocationMarkerY.MIN, LocationMarkerY.MAX)
    }
  };
};


// создадим массив из заданного числа случайных объявлений
var randomAdsList = [];
for (var i = 0; i < ADS_NUMBER; i++) {
  randomAdsList.push(generateAd(i + 1));
}

/**
* используя шаблон создает  новый DOM-элемент для метки
* @param {Object} obj JS-объект на основе которого происходит наполнение шаблона
* @return {Element}
*/
var getNewPin = function (obj) {
  var newPin = mapPinTemplate.cloneNode(true);
  newPin.style.left = obj.location.x - PIN_WIDTH / 2 + 'px';
  newPin.style.top = obj.location.y - PIN_HEIGHT + 'px';

  var newPinImg = newPin.querySelector('img'); // аватар на метке
  newPinImg.src = obj.author.avatar;
  newPinImg.alt = 'Заголовок объявления';

  return newPin;
};

/**
* добавляет в разметку необходимое количество DOM-элементов
* @return {Element}
*/
var getNewPinList = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < ADS_NUMBER; j++) {
    fragment.appendChild(getNewPin(randomAdsList[j]));
  }

  return mapPinList.appendChild(fragment);
};


/**
* добавляет DOM-элементу атрибут disabled
* @param {Element} el
*/
var addDisabled = function (el) {
  el.setAttribute('disabled', 'disabled');
};

/**
* удаляет у DOM-элемента атрибут disabled
* @param {Element} el
*/
var removeDisabled = function (el) {
  el.removeAttribute('disabled');
};

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
  adFormAddress.value = (MAIN_PIN.offsetLeft + MAIN_PIN_WIDTH / 2) + ', ' + (MAIN_PIN.offsetTop + MAIN_PIN_HEIGHT);
};

/**
* активирует страницу
*/
var activatePage = function () {
  MAP.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  // удаляем со всех элементов управления формой атрибут disabled
  removeDisabled(mapFiltersFieldset);

  for (i = 0; i < mapFiltersSelectsList.length; i++) {
    removeDisabled(mapFiltersSelectsList[i]);
  }

  for (i = 0; i < adFormFieldsetsList.length; i++) {
    removeDisabled(adFormFieldsetsList[i]);
  }
};

// создадим объект-мапу для хранения зависимости минимальной стоимости от типа жилья

var typePriceMap = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

/**
* устанавливает минимальное значение поля «Цена за ночь» в зависимости от типа жилья
* @param {object} objMap
*/
var getPrice = function (objMap) {
  adFormPrice.min = objMap[adFormType.value];
  adFormPrice.placeholder = objMap[adFormType.value];
};

/**
* переводит страницу в неактивное состояние
*/
var desactivatePage = function () {
  // добавим всем элементам управления формой атрибут disabled
  addDisabled(mapFiltersFieldset);

  for (i = 0; i < mapFiltersSelectsList.length; i++) {
    addDisabled(mapFiltersSelectsList[i]);
  }

  for (i = 0; i < adFormFieldsetsList.length; i++) {
    addDisabled(adFormFieldsetsList[i]);
  }

  // передадим изначальные координаты метки в поле адреса
  enterCoordinateInitial();

  // зададим правильное значение минимальной цены для выбранного по умолчанию типа жилья
  getPrice(typePriceMap);
};


// дезактивация страницы
desactivatePage();

MAIN_PIN.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  activatePage();

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

    // пересчитываем координаты метки, сравниваем их с диапазоном и задаем их в стили
    // для y
    var testCoord = MAIN_PIN.offsetTop + shift.y;
    if (testCoord < LocationY.MIN) {
      MAIN_PIN.style.top = LocationY.MIN + 'px';
    } else if (testCoord < LocationY.MAX) {
      MAIN_PIN.style.top = testCoord + 'px';
    } else {
      MAIN_PIN.style.top = LocationY.MAX + 'px';
    }

    // для х
    testCoord = MAIN_PIN.offsetLeft + shift.x;
    if (testCoord < LocationX.MIN) {
      MAIN_PIN.style.left = LocationX.MIN + 'px';
    } else if (testCoord < LocationX.MAX) {
      MAIN_PIN.style.left = testCoord + 'px';
    } else {
      MAIN_PIN.style.left = LocationX.MAX + 'px';
    }

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

    getNewPinList(); // запускаем отрисовку меток похожих объявлений

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

});

adFormType.addEventListener('change', function () {
  getPrice(typePriceMap);
});

// т.к. по ТЗ поля «Время заезда» и «Время выезда» синхронизированы, создадим функцию, которая синхронизирует два селекта
/**
* синхронихирует выбор полей с одинаковым значением в двух списках
* @param {HTMLSelectElement} select1
* @param {HTMLSelectElement} select2
*/
var getSimilarChoice = function (select1, select2) {
  select2.value = select1.value; // для списка2 делаем выбранным пункт с тем же значением value, что и выбранный пункт списка1
};

// синхронизируем изменения в полях «Время заезда» и «Время выезда»
adFormTimeIn.addEventListener('change', function () {
  getSimilarChoice(adFormTimeIn, adFormTimeOut);
});

adFormTimeOut.addEventListener('change', function () {
  getSimilarChoice(adFormTimeOut, adFormTimeIn);
});
