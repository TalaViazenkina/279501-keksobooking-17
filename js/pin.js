'use strict';

// модуль отрисовки пинов на карте
(function () {
  var mapPinList = window.data.MAP.querySelector('.map__pins'); // блок с метками

  var mapPinTemplate = document.querySelector('#pin') // шаблон метки
    .content
    .querySelector('button');

  var isSimilarPin = false; // флаг, показывающий была ли уже отрисовка пинов

  /**
  * используя шаблон создает  новый DOM-элемент для метки
  * @param {Object} obj JS-объект на основе которого происходит наполнение шаблона
  * @return {Element}
  */
  var getNewPin = function (obj) {
    var newPin = mapPinTemplate.cloneNode(true);
    // добавим класс, чтобы потом эти метки можно было отследить
    newPin.classList.add('map__pin--similar');
    newPin.style.left = obj.location.x - window.data.PIN_WIDTH / 2 + 'px';
    newPin.style.top = obj.location.y - window.data.PIN_HEIGHT + 'px';

    var newPinImg = newPin.querySelector('img'); // аватар на метке
    newPinImg.src = obj.author.avatar;
    newPinImg.alt = obj.offer.title;

    newPin.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.card.render(obj);
      newPin.classList.add('map__pin--active');
    });

    return newPin;
  };

  /**
  * удаляет ранее отрисованные пины из разметки
  */
  var clearPin = function () {
    window.utils.deleteNodeList(mapPinList, '.map__pin--similar');
  };


  /**
  * добавляет в разметку необходимое количество DOM-элементов
  * @param {array} arr массив объектов на основании которого происходит наполнение шаблона
  */
  var getNewPinList = function (arr) {
    // если метки уже отрисованы - удаляем их из разметки
    if (isSimilarPin) {
      window.pin.clear();
    }

    // запускаем отрисовку и добавляем метки в разметку
    var fragment = document.createDocumentFragment();
    arr.forEach(function (it) {
      fragment.appendChild(getNewPin(it));
    });

    mapPinList.appendChild(fragment);

    isSimilarPin = true; // меняем флаг
  };


  window.pin = {
    clear: clearPin,

    render: getNewPinList
  };

})();
