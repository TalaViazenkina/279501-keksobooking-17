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
    * проверяет, был ли нажат esc
    * @param {event} evt
    * @param {function} action
    */
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
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
        if (evt.keyCode === ESC_KEYCODE) {
          closeError();
        }
      };

      var errorButton = errorNode.querySelector('.error__button');
      // добавим обработчики событий для закрытия окна ошибки
      errorButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        closeError();
      });
      document.addEventListener('click', onErrorClick);
      document.addEventListener('keydown', onErrorEscPress);
    }
  };
})();
