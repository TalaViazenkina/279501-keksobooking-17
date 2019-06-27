'use strict';

(function () {
  /**
  * @const
  * @type {number}
  */
  var ESC_KEYCODE = 27;

  // шаблон сообщения об ошибке
  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var main = document.querySelector('main');

  window.utils = {
    MAP: document.querySelector('.map'), // карта
    adForm: document.querySelector('.ad-form'), // форма добавления объявлений

    /**
    * генерирует случайный элемент массива
    * @param {array} arr
    * @return {(number|string|boolean|Array|Object)}
    */
    getRandomArrayItem: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
    * генерирует случайное число из диапазона
    * @param {number} min
    * @param {number} max
    * @return {number}
    */
    getRandomNumber: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },

    /**
    * добавляет DOM-элементу атрибут disabled
    * @param {Element} el
    */
    addDisabled: function (el) {
      el.setAttribute('disabled', 'disabled');
    },

    /**
    * удаляет у DOM-элемента атрибут disabled
    * @param {Element} el
    */
    removeDisabled: function (el) {
      el.removeAttribute('disabled');
    },

    /**
    * ввыводит сообщение об ошибке
    * @param {string} message
    */
    onError: function (message) {
      var errorNode = errorTemplate.cloneNode(true); // клонируем шаблон
      var errorText = errorNode.querySelector('.error__message');
      errorText.textContent = message; // добавляем текст сообщения

      // добавляем в разметку
      main.insertAdjacentElement('afterbegin', errorNode);

      /*
      * удаляет сообщение об ошибке из DOM
      * @param {event} evt
      */
      var closeError = function (evt) {
        evt.preventDefault();
        errorNode.remove();
      };

      /**
      * закрывает сообщение по клику на кнопку
      * @param {event} evt
      */
      var onButtonClick = function (evt) {
        closeError(evt);
        errorButton.removeEventListener('click', onButtonClick);
      };

      /**
      * закрывает сообщение по клику на произвольную область
      * @param {event} evt
      */
      var onDocumentMousedown = function (evt) {
        closeError(evt);
        document.removeEventListener('click', onDocumentMousedown);
      };

      /**
      * закрывает сообщение по esc
      * @param {event} evt
      */
      var onDocumentKeydown = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          closeError(evt);
          document.removeEventListener('keydown', onDocumentKeydown);
        }
      };

      var errorButton = errorNode.querySelector('.error__button');
      // добавим обработчики событий для закрытия окна ошибки
      errorButton.addEventListener('click', onButtonClick);
      document.addEventListener('mousedown', onDocumentMousedown);
      document.addEventListener('keydown', onDocumentKeydown);
    }
  };
})();
