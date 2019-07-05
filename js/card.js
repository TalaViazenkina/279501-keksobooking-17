'use strict';

// модуль, отвечающий за отрисовку карточки объявления
(function () {

  // шаблон объявления
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');


  /**
  * отрисовывает карточку объявления по шаблону
  * @param {object} obj
  */
  var renderCard = function (obj) {
    var card = cardTemplate.cloneNode(true);

    window.utils.MAP.insertBefore(card, window.utils.MAP.querySelector('.map__filters-container'));
  };

  window.card = {
    renderCard: renderCard
  };
})();
