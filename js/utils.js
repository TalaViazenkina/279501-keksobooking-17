'use strict';

(function () {
  /**
  * @const
  * @type {number}
  */
  var Keycode = {
    ENTER: 13,
    ESC: 27
  };

  window.utils = {
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
    * Возвращает список элементов, а затем удаляет их из DOM
    * @param {Element} parentEl
    * @param {string} selectors
    */

    deleteNodeList: function (parentEl, selectors) {
      var nodeArray = Array.prototype.slice.call(parentEl.querySelectorAll(selectors));
      nodeArray.forEach(function (node) {
        node.remove();
      });
    },

    /**
    * проверяет, был ли нажат esc
    * @param {event} evt
    * @return {Boolean}
    */
    isEscEvent: function (evt) {
      return evt.keyCode === Keycode.ESC;
    },

    /**
    * проверяет, был ли нажат enter
    * @param {event} evt
    * @return {Boolean}
    */
    isEnterEvent: function (evt) {
      return evt.keyCode === Keycode.ENTER;
    }
  };
})();
