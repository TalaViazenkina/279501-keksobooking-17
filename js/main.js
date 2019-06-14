'use strict';

// DOM-объекты
var map = document.querySelector('.map'); // карта
map.classList.remove('map--faded');

var mapPinList = map.querySelector('.map__pins'); // блок с метками

var mapPinTemplate = document.querySelector('#pin') // шаблон метки
  .content
  .querySelector('button');


// количество объявлений, которые необходимо сгенерировать
var ADS_NUMBER = 8;

// размеры пина из CSS
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

// исходные денные для генерации объявлений
// тип недвижимости
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

// координата Y метки на карте, диапазон
var locationY = {
  MIN: 130,
  MAX: 630
};

// координата X метки на карте, диапазон
var locationX = {
  min: 0 + PIN_WIDTH / 2,
  max: map.offsetWidth - PIN_WIDTH / 2
};


// общие функции, необходимые для расчетов
// генерирование случайного элемента массива
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// генерирование случайного числа из диапазона
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};


// создадим случайное объявление
var generateAd = function (numericalItem) {
  return {
    'author': {
      'avatar': 'img/avatars/user0' + numericalItem + '.png'
    },
    'offer': {
      'type': getRandomArrayItem(OFFER_TYPES)
    },
    'location': {
      'x': getRandomNumber(locationX.min, locationX.max),
      'y': getRandomNumber(locationY.MIN, locationY.MAX)
    }
  };
};


// создадим массив из заданного числа случайных объявлений
var randomAdsList = [];
for (var i = 0; i < ADS_NUMBER; i++) {
  randomAdsList.push(generateAd(i + 1));
}

// используя шаблон создадим новый DOM-элемент для метки для нового объявления
var getNewPin = function (obj) {
  var newPin = mapPinTemplate.cloneNode(true);
  newPin.style.left = obj.location.x - PIN_WIDTH / 2 + 'px';
  newPin.style.top = obj.location.y - PIN_HEIGHT + 'px';

  var newPinImg = newPin.querySelector('img'); // аватар на метке
  newPinImg.src = obj.author.avatar;
  newPinImg.alt = 'Заголовок объявления';

  return newPin;
};

// создадим необходимое количество меток для объявлений и добавим их в разметку
var getNewPinList = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < ADS_NUMBER; j++) {
    fragment.appendChild(getNewPin(randomAdsList[j]));
  }

  return mapPinList.appendChild(fragment);
};

getNewPinList();
