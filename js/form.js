'use strict';

// модуль работы с формой
(function () {

  // форма добавления объявлений
  var adFormType = window.utils.adForm.querySelector('#type'); // поле выбора типа жилья
  var adFormPrice = window.utils.adForm.querySelector('#price'); // поле ввода цены за ночь
  var adFormTimeIn = window.utils.adForm.querySelector('#timein'); // поле ввода времени заезда
  var adFormTimeOut = window.utils.adForm.querySelector('#timeout'); // поле ввода времени выезда

  window.form = {
    /**
    * устанавливает минимальное значение поля «Цена за ночь» в зависимости от типа жилья
    * @param {object} objMap
    */
    getPrice: function (objMap) {
      adFormPrice.min = objMap[adFormType.value];
      adFormPrice.placeholder = objMap[adFormType.value];
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

})();
