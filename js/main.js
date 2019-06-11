'use strict';

// константы
var ADS_NUMBER = 8; // количество объявлений, которые необходимо сгенерировать


// общие функции, необходимые для расчетов
// создание числового массива заданной длины
var getArrayOfNumbers = function (arrayLength) {
  var arrayOfNumbers = [];
  for (var i = 1; i <= arrayLength; i++) {
    arrayOfNumbers.push(i);
  }

  return arrayOfNumbers;
};

// перемешивание массива
var getMixedArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    // получаем индекс случайного элемента в массиве с длинной (i + 1),
    // на первой итерации длина массива равна длине исходного,
    // с каждой последующей - на единицу меньше
    var randomIndex = Math.floor(Math.random() * (i + 1));

    // меняем элементы местами
    var temp = arr[i];
    arr[i] = arr[randomIndex]; // случайно выбранный элемент перенесен в конец массива
    arr[randomIndex] = temp; // на место случайно выбранного элемента записан элемент с индексом i
  }

  return arr;
};

// генерирование случайного элемента массива
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// генерирование случайного числа из диапазона
var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};


// DOM-объекты
var map = document.querySelector('.map'); // карта
map.classList.remove('map--faded');

var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('button');

var mapPinList = document.querySelector('.map__pins');


// исходные денные для генерации объявлений
// тип недвижимости
var offerTypes = ['palace', 'flat', 'house', 'bungalo'];

// координата Y метки на карте, диапазон
var locationY = {min: 130, max: 630};

// координата X метки на карте, диапазон
var locationX = {min: 0, max: map.offsetWidth};

// массив чисел для генерации адреса аватара
var avatarNumbers = getMixedArray(getArrayOfNumbers(ADS_NUMBER));

// создадим случайное объявление
var generateAd = function (numericalItem) {
  return {
    'author': {
      'avatar': 'img/avatars/user0' + numericalItem + '.png'
    },
    'offer': {
      'type': getRandomArrayItem(offerTypes)
    },
    'location': {
      'x': getRandomNumber(locationX.min, locationX.max),
      'y': getRandomNumber(locationY.min, locationY.max)
    }
  };
};


// создадим массив из заданного числа случайных объявлений
var randomAdsList = [];
for (var i = 0; i < ADS_NUMBER; i++) {
  randomAdsList.push(generateAd(avatarNumbers[i]));
}

// используя шаблон создадим новый DOM-эелемент для метки для нового объявления
var getNewPin = function (obj) {
  var newPin = mapPinTemplate.cloneNode(true);
  newPin.style.left = obj.location.x + 'px';
  newPin.style.top = obj.location.y + 'px';
  newPin.src = obj.author.avatar;
  newPin.alt = 'Заголовок объявления';

  return newPin;
};

// создадим необходимое количество меток для объявлений и добавим их в разметку
var getNewPinList = function () {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < ADS_NUMBER; j++) {
    fragment.appendChild(getNewPin(randomAdsList[j]));
  }

  return mapPinList.appendChild(fragment);
  console.log(fragment);
};

getNewPinList();
