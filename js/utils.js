'use strict';

(function () {
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
  };
})();
