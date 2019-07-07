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

    // заполняем карточку
    // поле с заголовком
    var cardTitle = card.querySelector('.popup__title');
    fillField(cardTitle, obj.offer.title);

    // поле с адресом
    var cardAddress = card.querySelector('.popup__text--address');
    fillField(cardAddress, obj.offer.address);

    // поле с ценой;
    var cardPrice = card.querySelector('.popup__text--price');
    cardPrice.textContent = fillField(cardPrice, obj.offer.price) + '₽/ночь';

    // поле с типом жилья
    var cardType = card.querySelector('.popup__type');
    cardType.textContent = typeNameMap[fillField(cardType, obj.offer.type)];

    // поле с количеством гостей и комнат
    var cardCapacity = card.querySelector('.popup__text--capacity');
    // добавим соответствие окончания числительному
    var rooms;
    if (obj.offer.rooms === 1 || (obj.offer.rooms > 20 && obj.offer.rooms % 10 === 1)) {
      rooms = ' комната для ';
    } else if (obj.offer.rooms > 1 && obj.offer.rooms < 5 || (obj.offer.rooms > 20 && (obj.offer.rooms % 10 > 1) && (obj.offer.rooms % 10 < 5))) {
      rooms = ' комнаты для ';
    } else {
      rooms = ' комнат для ';
    }
    var guests = (obj.offer.guests === 1) ? ' гостя' : ' гостей';

    cardCapacity.textContent = fillField(cardCapacity, obj.offer.rooms) + rooms + fillField(cardCapacity, obj.offer.guests) + guests;

    // поле с указанием времени заезда и выезда
    var cardTime = card.querySelector('.popup__text--time');
    cardTime.textContent = 'Заезд после ' + fillField(cardTime, obj.offer.checkin) + ', выезд до ' + fillField(cardTime, obj.offer.checkout);

    // поле с описанием
    var cardDescription = card.querySelector('.popup__description');
    fillField(cardDescription, obj.offer.description);

    //  поле с доступными удобствами
    var cardFeatures = card.querySelector('ul.popup__features');
    var cardWifi = cardFeatures.querySelector('.popup__feature--wifi');
    var cardDishwasher = cardFeatures.querySelector('.popup__feature--dishwasher');
    var cardParking = cardFeatures.querySelector('.popup__feature--parking');
    var cardWasher = cardFeatures.querySelector('.popup__feature--washer');
    var cardElevator = cardFeatures.querySelector('.popup__feature--elevator');
    var cardConditioner = cardFeatures.querySelector('.popup__feature--conditioner');


    // объект-мапа соответствия названия удобства и HTMLElementa
    var featureLiMap = {
      'wifi': cardWifi,
      'dishwasher': cardDishwasher,
      'parking': cardParking,
      'washer': cardWasher,
      'elevator': cardElevator,
      'conditioner': cardConditioner
    };

    if (obj.offer.features && obj.offer.features.length > 0) {
      Object.keys(featureLiMap).forEach(function (it) {
        if (obj.offer.features.indexOf(it) === -1) {
          featureLiMap[it].style.display = 'none';
        }
      });
    } else {
      cardFeatures.style.display = 'none';
    }

    // блок с фото
    var photosList = card.querySelector('.popup__photos');
    var photo = photosList.querySelector('.popup__photo');

    if (obj.offer.photos && obj.offer.photos.length > 0) {
      var fragment = document.createDocumentFragment();
      obj.offer.photos.forEach(function (it, i) {
        if (i === 0) {
          photo.src = it;
        } else {
          photo = photo.cloneNode(true);
          photo.src = it;
          fragment.appendChild(photo);
        }
      });

      photosList.appendChild(fragment);
    } else {
      photosList.style.display = 'none';
    }

    // блок с аватаркой
    var cardAvatar = card.querySelector('.popup__avatar');
    if (obj.author.avatar) {
      cardAvatar.src = obj.author.avatar;
    } else {
      cardAvatar.style.display = 'none';
    }

    // закрытие попапа
    var cardButton = card.querySelector('.popup__close'); // кнопка закрытия

    cardButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closePopap();
    });

    document.addEventListener('keydown', onPopapEscPress);

    // добавляем отрисованную карточку в разметку
    window.data.MAP.insertBefore(card, window.data.MAP.querySelector('.map__filters-container'));
  };

  window.card = {
    renderCard: renderCard,
    removeCard: removeCard
  };
})();
