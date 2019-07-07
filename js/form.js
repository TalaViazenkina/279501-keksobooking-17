'use strict';

// модуль работы с формой
(function () {

  // форма добавления объявлений
  var adFormType = window.utils.adForm.querySelector('#type'); // поле выбора типа жилья
  var adFormPrice = window.utils.adForm.querySelector('#price'); // поле ввода цены за ночь
  var adFormTimeIn = window.utils.adForm.querySelector('#timein'); // поле выбора времени заезда
  var adFormTimeOut = window.utils.adForm.querySelector('#timeout'); // поле выбора времени выезда
  var adFormRoom = window.utils.adForm.querySelector('#room_number'); // поле выбора количества комната
  var adFormCapacity = window.utils.adForm.querySelector('#capacity'); // поле выбора количества гостей

  window.form = {
    /**
    * устанавливает минимальное значение поля «Цена за ночь» в зависимости от типа жилья
    * @param {object} objMap
    */
    getPrice: function (objMap) {
      adFormPrice.min = objMap[adFormType.value];
      adFormPrice.placeholder = objMap[adFormType.value];
    },

    /**
    * устанавливает допустимое количество густей в зависимости от количества комнат
    */
    getValidCapacity: function () {
      if (adFormRoom.value === '100') {
        adFormCapacity = '0';
      } else {
        adFormCapacity.value = adFormRoom.value;
      }
    }
  };

  adFormType.addEventListener('change', function () {
    window.form.getPrice(window.data.typePriceMap);
  });

  // т.к. по ТЗ поля «Время заезда» и «Время выезда» синхронизированы, создадим функцию, которая синхронизирует два селекта
  /**
  * синхронихирует выбор полей с одинаковым значением в двух списках
  * @param {HTMLSelectElement} select1
  * @param {HTMLSelectElement} select2
  */
  var getSimilarChoice = function (select1, select2) {
    select2.value = select1.value; // для списка2 делаем выбранным пункт с тем же значением value, что и выбранный пункт списка1
  };

  // синхронизируем изменения в полях «Время заезда» и «Время выезда»
  adFormTimeIn.addEventListener('change', function () {
    getSimilarChoice(adFormTimeIn, adFormTimeOut);
  });

  adFormTimeOut.addEventListener('change', function () {
    getSimilarChoice(adFormTimeOut, adFormTimeIn);
  });

  /**
  * проверяет соответствие между количеством гостей и комнат
  */
  var onCapacityChange = function () {
    if (adFormRoom.value !== '100') {
      if (adFormCapacity.value !== '0' && adFormCapacity.value <= adFormRoom.value) {
        adFormCapacity.setCustomValidity('');
      } else {
        adFormCapacity.setCustomValidity('Для выбранного количества комнат укажите количество гостей отличное от 0, но не более ' + adFormRoom.value);
      }
    } else {
      if (adFormCapacity.value !== '0') {
        adFormCapacity.setCustomValidity('Для выбранного количества комнат возможное количество гостей  - 0');
      } else {
        adFormCapacity.setCustomValidity('');
      }
    }
  };

  // при изменении значений полей Количество комнат или Количество гостей будем запускать проверку на соответствие между количеством гостей и комнат
  adFormRoom.addEventListener('change', onCapacityChange);
  adFormCapacity.addEventListener('change', onCapacityChange);
})();
