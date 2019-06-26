'use strict';

// модуль отрисовки пинов на карте
(function () {
  var mapPinList = window.utils.MAP.querySelector('.map__pins'); // блок с метками

  var mapPinTemplate = document.querySelector('#pin') // шаблон метки
    .content
    .querySelector('button');

  /**
  * используя шаблон создает  новый DOM-элемент для метки
  * @param {Object} obj JS-объект на основе которого происходит наполнение шаблона
  * @return {Element}
  */
  var getNewPin = function (obj) {
    var newPin = mapPinTemplate.cloneNode(true);
    newPin.style.left = obj.location.x - window.parameter.PIN_WIDTH / 2 + 'px';
    newPin.style.top = obj.location.y - window.parameter.PIN_HEIGHT + 'px';

    var newPinImg = newPin.querySelector('img'); // аватар на метке
    newPinImg.src = obj.author.avatar;
    newPinImg.alt = obj.offer.title;

    return newPin;
  };

  /**
  * добавляет в разметку необходимое количество DOM-элементов
  * @param {array} arr массив объектов на основании которого происходит наполнение шаблона
  */
  var getNewPinList = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].offer) {
        fragment.appendChild(getNewPin(arr[i]));
      }
    }
    mapPinList.appendChild(fragment);
  };

  window.pin = {
    onLoadSuccess: function (response) {
      getNewPinList(response);
    }
  };

})();
