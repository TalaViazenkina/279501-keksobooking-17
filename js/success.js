'use strict';

// модуль сообщения об успешной отправке формы
(function () {
  // шаблон сообщения об успехе
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var main = document.querySelector('main');

  var successNode;

  /*
  * удаляет сообщение об ошибке из DOM
  */
  var closeSuccess = function () {
    successNode.remove();
    document.removeEventListener('click', onSuccessClick);
    document.removeEventListener('keydown', onSuccessEscPress);
  };

  /**
  * закрывает сообщение по клику на произвольную область
  * @param {event} evt
  */
  var onSuccessClick = function (evt) {
    evt.preventDefault();
    closeSuccess();
  };

  /**
  * закрывает сообщение по esc
  * @param {event} evt
  */
  var onSuccessEscPress = function (evt) {
    evt.preventDefault();
    if (window.utils.isEscEvent(evt)) {
      closeSuccess();
    }
  };

  /**
  * выводит сообщение об успешной отправке
  * @param {string} message
  */
  var renderSuccess = function () {
    successNode = successTemplate.cloneNode(true); // клонируем шаблон

    document.addEventListener('click', onSuccessClick);
    document.addEventListener('keydown', onSuccessEscPress);

    // добавляем в разметку
    main.insertAdjacentElement('afterbegin', successNode);
  };

  // все действия при успешной отправке
  var onSuccess = function () {
    renderSuccess(); // отрисовка сообщения
    window.data.adForm.reset(); // сброс формы
    window.attachment.clearAvatar(); // обнуление аватарки
    window.attachment.clearPhoto(); // удаление превью добавленных фотографий

    window.pin.clear(); // удаление меток
    window.card.remove(); // удаление карточки объявления
    window.filters.form.reset(); // сброс фильтров

    window.data.movePinToInitial(); // передвигаем метку в центр
    window.map.desactivatePage(); // переводим страницу в неактивное состояние
  };

  window.success = onSuccess;
})();
