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

  var resetButton = window.utils.adForm.querySelector('button[type=reset]'); // кнопка сброса

  window.form = {
    /**
    * устанавливает минимальное значение поля «Цена за ночь» в зависимости от типа жилья
    * @param {object} objMap
    */
    getPrice: function (objMap) {
      adFormPrice.min = objMap[adFormType.value];
      adFormPrice.placeholder = objMap[adFormType.value];
    },

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
  var checkCapacity = function () {
    var validityMessage;
    if (adFormRoom.value !== '100') {
      validityMessage = (adFormCapacity.value !== '0' && adFormCapacity.value <= adFormRoom.value) ? '' : 'Для выбранного количества комнат укажите количество гостей отличное от 0, но не более ' + adFormRoom.value;
    } else {
      validityMessage = (adFormCapacity.value !== '0') ? 'Для выбранного количества комнат возможное количество гостей  - 0' : '';
    }

    adFormCapacity.setCustomValidity(validityMessage);
  };

  // запустим проверку на случай, если пользователь решит не менять значения этих полей
  checkCapacity();

  // при изменении значений полей Количество комнат или Количество гостей так же будем запускать проверку
  adFormRoom.addEventListener('change', function () {
    checkCapacity();
  });
  adFormCapacity.addEventListener('change', function () {
    checkCapacity();
  });

  // отправка формы
  window.utils.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    // запускаем отправку данных на сервер только в том случае,
    // если в данный момент никакая другая отправка не выполняется
    if (!window.backend.isSaving) {
      window.backend.isSaving = true;
      window.backend.save(new FormData(window.utils.adForm), window.success, window.error);
    }
  });

  // ресет формы
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();

    window.utils.adForm.reset(); // сброс формы
    window.attachment.clearAvatar(); // обнуление аватарки
    window.pin.clear(); // удаление меток
    window.card.remove(); // удаление карточки объявления
    window.map.enterCoordinateInitial(); // ввод координат, соответствующих изначальному положению метки

    // передвигаем метку в центр
    window.data.MAIN_PIN.style.top = window.data.MainPinInitial.Y + 'px';
    window.data.MAIN_PIN.style.left = window.data.MainPinInitial.X + 'px';
  });

})();
