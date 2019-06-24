'use strict';

// модуль, который создаёт данные для случайных объявлений
(function () {

  /**
  * координата X острия метки на карте, диапазон (для похожих меток)
  * @enum {number}
  */
  var LocationMarkerX = {
    MIN: window.parameter.PIN_WIDTH / 2,
    MAX: window.util.MAP.offsetWidth - window.parameter.PIN_WIDTH / 2
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
        'type': window.util.getRandomArrayItem(window.parameter.OFFER_TYPES)
      },
      'location': {
        'x': window.util.getRandomNumber(LocationMarkerX.MIN, LocationMarkerX.MAX),
        'y': window.util.getRandomNumber(window.parameter.LocationY.MIN, window.parameter.LocationY.MAX)
      }
    };
  };


  // создадим массив из заданного числа случайных объявлений
  var randomAdsList = [];
  for (var i = 0; i < window.parameter.ADS_NUMBER; i++) {
    randomAdsList.push(generateAd(i + 1));
  }

  window.data = randomAdsList;
})();
