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
    newPinImg.alt = 'Заголовок объявления';

    return newPin;
  };

  window.pin = {
    /**
    * добавляет в разметку необходимое количество DOM-элементов
    * @param {number} quantity
    * @param {array} arr массив объектов на основании которого происходит наполнение шаблона
    */
    getNewPinList: function (quantity, arr) {
      var fragment = document.createDocumentFragment();
      for (var j = 0; j < quantity; j++) {
        fragment.appendChild(getNewPin(arr[j]));
      }

      mapPinList.appendChild(fragment);
    }
  };

})();
