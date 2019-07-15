'use strict';

// модуль сообщения об ошибке
(function () {
  // шаблон сообщения об ошибке
  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var main = document.querySelector('main');

  var errorNode;

  /*
  * удаляет сообщение об ошибке из DOM
  */
  var closeError = function () {
    errorNode.remove();
    document.removeEventListener('click', onErrorClick);
    document.removeEventListener('keydown', onErrorEscPress);
  };

  /**
  * закрывает сообщение по клику на произвольную область
  * @param {event} evt
  */
  var onErrorClick = function (evt) {
    evt.preventDefault();
    closeError();
  };

  /**
  * закрывает сообщение по esc
  * @param {event} evt
  */
  var onErrorEscPress = function (evt) {
    evt.preventDefault();
    if (window.utils.isEscEvent(evt)) {
      closeError();
    }
  };

  /**
  * ввыводит сообщение об ошибке
  * @param {string} message
  */
  var onError = function (message) {
    errorNode = errorTemplate.cloneNode(true); // клонируем шаблон
    var errorText = errorNode.querySelector('.error__message');
    errorText.textContent = message; // добавляем текст сообщения

    var errorButton = errorNode.querySelector('.error__button');
    // добавим обработчики событий для закрытия окна ошибки
    errorButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeError();
    });
    document.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorEscPress);

    // добавляем в разметку
    main.insertAdjacentElement('afterbegin', errorNode);
  };

  window.error = onError;

})();
