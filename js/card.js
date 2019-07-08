'use strict';

// модуль, отвечающий за отрисовку карточки объявления
(function () {
  var card;

  // шаблон объявления
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');

  // Объект-мапа соответствия типа жилья и наименования в объявлении
  var typeNameMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };


  /**
  * заполняет поле текстовой информацией
  * @param {HTMLElement} field
  * @param {string | number} text
  * @return {string}
  */
  var fillField = function (field, text) {
    if (text) {
      field.textContent = text;
    } else {
      field.style.display = 'none';
    }
    return field.textContent;
  };

  /**
  * заполняет поле с ценой
  * @param {HTMLElement} field
  * @param {number} number
  */
  var fillPrice = function (field, number) {
    field.textContent = fillField(field, number) + '₽/ночь';
  };

  /**
  * заполняет поле с типом жилья
  * @param {HTMLElement} field
  * @param {string} text
  */
  var fillType = function (field, text) {
    field.textContent = typeNameMap[fillField(field, text)];
  };

  /**
  * заполняет поле с количеством комнат и гостей
  * @param {HTMLElement} field
  * @param {number} room
  * @param {number} guest
  */
  var fillCapacity = function (field, room, guest) {
    // добавим соответствие окончания числительному
    var roomMessage;
    if (room === 1 || (room > 20 && room % 10 === 1)) {
      roomMessage = ' комната для ';
    } else if (room > 1 && room < 5 || (room > 20 && (room % 10 > 1) && (room % 10 < 5))) {
      roomMessage = ' комнаты для ';
    } else {
      roomMessage = ' комнат для ';
    }
    var guestMessage = (guest === 1) ? ' гостя' : ' гостей';

    field.textContent = fillField(field, room) + roomMessage + fillField(field, guest) + guestMessage;
  };

  /**
  * заполняет поле со временем заезда и выезда
  * @param {HTMLElement} field
  * @param {string} timeIn
  * @param {string} timeOut
  */
  var fillTime = function (field, timeIn, timeOut) {
    field.textContent = 'Заезд после ' + fillField(field, timeIn) + ', выезд до ' + fillField(field, timeOut);
  };

  /**
  * заполняет поле со списком удобств
  * @param {Element} parentNode
  * @param {string} selector
  * @param {Array} arr
  */
  var fillFeatures = function (parentNode, selector, arr) {
    // удаляем все элементы, описывающие удобства, привнесенные из шаблона
    window.utils.deleteNodeList(parentNode, selector);

    // добавим только те удобства, что есть в объявлении
    if (arr && arr.length > 0) {
      arr.forEach(function (it) {
        var feature = document.createElement('li');
        feature.classList.add('popup__feature');
        feature.classList.add('popup__feature--' + it);
        parentNode.appendChild(feature);
      });
    } else {
      parentNode.style.display = 'none';
    }
  };

  /**
  * заполняет блок с фотографиями на основании массива с адресами фотографий
  * @param {Array} arr
  * @param {Element} el
  * @param {Element} parentEl
  */
  var fillPhoto = function (arr, el, parentEl) {
    if (arr && arr.length > 0) {
      var fragment = document.createDocumentFragment();
      arr.forEach(function (it, i) {
        if (i === 0) {
          el.src = it;
        } else {
          el = el.cloneNode(true);
          el.src = it;
          fragment.appendChild(el);
        }
      });

      parentEl.appendChild(fragment);
    } else {
      parentEl.style.display = 'none';
    }
  };

  /**
  * добавляет аватарку автора
  * @param {HTMLElement} field
  * @param {string} source
  */
  var fillAvatar = function (field, source) {
    if (source) {
      field.src = source;
    } else {
      field.style.display = 'none';
    }
  };


  /**
  * закрывает попап
  * @param {Event} evt
  */
  var closePopap = function () {
    card.remove();
    document.removeEventListener('keydown', onPopapEscPress);
  };

  /**
  * закрывает попап по esc
  * @param {Event} evt
  */
  var onPopapEscPress = function (evt) {
    window.utils.isEscEvent(evt, closePopap);
  };

  /**
  * удаляет карточку из разметки, если она уже была создана
  */
  var removeCard = function () {
    if (card) {
      closePopap();
    }
  };


  /**
  * отрисовывает карточку объявления по шаблону
  * @param {object} obj
  */
  var renderCard = function (obj) {
    removeCard();

    // копируем шаблон
    card = cardTemplate.cloneNode(true);

    // поле с заголовком
    var cardTitle = card.querySelector('.popup__title');
    // поле с адресом
    var cardAddress = card.querySelector('.popup__text--address');
    // поле с ценой;
    var cardPrice = card.querySelector('.popup__text--price');
    // поле с типом жилья
    var cardType = card.querySelector('.popup__type');
    // поле с количеством гостей и комнат
    var cardCapacity = card.querySelector('.popup__text--capacity');
    // поле с описанием
    var cardDescription = card.querySelector('.popup__description');
    // поле с указанием времени заезда и выезда
    var cardTime = card.querySelector('.popup__text--time');
    // поле со списком доступных удобств
    var cardFeatures = card.querySelector('ul.popup__features');
    // блок с фото
    var photosList = card.querySelector('.popup__photos');
    var photo = photosList.querySelector('.popup__photo');
    // блок с аватаркой
    var cardAvatar = card.querySelector('.popup__avatar');

    // кнопка закрытия
    var cardButton = card.querySelector('.popup__close');


    // заполняем карточку
    fillField(cardTitle, obj.offer.title); // заголовок
    fillField(cardAddress, obj.offer.address); // адрес
    fillPrice(cardPrice, obj.offer.price); // цена
    fillType(cardType, obj.offer.type); // тип жилья
    fillCapacity(cardCapacity, obj.offer.rooms, obj.offer.guests); // количество комнат и гостей
    fillTime(cardTime, obj.offer.checkin, obj.offer.checkout); // время заезда/выезда
    fillField(cardDescription, obj.offer.description); // описание
    fillFeatures(cardFeatures, '.popup__feature', obj.offer.features); // удобства
    fillPhoto(obj.offer.photos, photo, photosList); // фото
    fillAvatar(cardAvatar, obj.author.avatar);


    // закрытие попапа
    cardButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closePopap();
    });
    document.addEventListener('keydown', onPopapEscPress);


    // добавляем отрисованную карточку в разметку
    window.data.MAP.insertBefore(card, window.data.MAP.querySelector('.map__filters-container'));
  };

  window.card = {
    render: renderCard,
    remove: removeCard
  };
})();
