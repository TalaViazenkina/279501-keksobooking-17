'use strict';

// DOM-объекты
var map = document.querySelector('.map'); // карта


var mapPinList = map.querySelector('.map__pins'); // блок с метками

var mapPinTemplate = document.querySelector('#pin') // шаблон метки
  .content
  .querySelector('button');

// форма фильтрации объявлений
var mapFilters = map.querySelector('.map__filters');
var mapFiltersSelectsList = mapFilters.querySelectorAll('.map__filter'); // все селекты в форме фильтрации
var mapFiltersFieldset = mapFilters.querySelector('.map__features'); // филдсет в форме фильтрации

// форма добавления объявлений
var adForm = document.querySelector('.ad-form');
var adFormFieldsetsList = adForm.querySelectorAll('fieldset');

var mainPin = map.querySelector('.map__pin--main'); // главная метка

/**
* количество объявлений, которые необходимо сгенерировать
* @const
* @type {number}
*/
var ADS_NUMBER = 8;

/**
* размеры пина из CSS
* @const
* @type {number}
*/
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;


/**
* тип недвижимости
* @enum {string}
*/
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

/**
* координата Y метки на карте, диапазон
* @enum {number}
*/
var LocationY = {
  MIN: 130,
  MAX: 630
};

/**
* координата X метки на карте, диапазон
* @enum {number}
*/
var LocationX = {
  MIN: 0 + PIN_WIDTH / 2,
  MAX: map.offsetWidth - PIN_WIDTH / 2
};


/**
* генерируем случайный элемент массива
* @param {array} arr
* @return {(number|string|boolean|Array|Object)}
*/
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
* генерируем случайное число из диапазона
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
      'x': getRandomNumber(LocationX.MIN, LocationX.MAX),
      'y': getRandomNumber(LocationY.MIN, LocationY.MAX)
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

//getNewPinList();

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

// в исходном состоянии все элементы управления формой должны быть неактивны
// добавим всем элементам управления формой атрибут disabled
addDisabled(mapFiltersFieldset);

for (i = 0; i < mapFiltersSelectsList.length; i++) {
  addDisabled(mapFiltersSelectsList[i]);
}

for (i = 0; i < adFormFieldsetsList.length; i++) {
  addDisabled(adFormFieldsetsList[i]);
}

// активация страницы
mainPin.addEventListener('click', function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  // удаляем со всех элементов управления формой атрибут disabled
  removeDisabled(mapFiltersFieldset);

  for (i = 0; i < mapFiltersSelectsList.length; i++) {
    removeDisabled(mapFiltersSelectsList[i]);
  }

  for (i = 0; i < adFormFieldsetsList.length; i++) {
    removeDisabled(adFormFieldsetsList[i]);
  }
});

