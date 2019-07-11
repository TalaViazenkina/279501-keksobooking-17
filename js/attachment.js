'use strict';

// модуль загрузки файлов в форму
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']; // допустимые расширения файлов

  var avatarChooser = window.utils.adForm.querySelector('#avatar'); // поле загрузки аватарки
  var avatar = window.utils.adForm.querySelector('.ad-form-header__preview img'); // поле отображения аватара
  var avatarDropZone = window.utils.adForm.querySelector('.ad-form-header__drop-zone'); // зона, на которую осуществляется перетаскивание
  var avatarInitial = avatar.src; // адрес аватарки по умолчанию

  var photoChooser = window.utils.adForm.querySelector('#images'); // поле загрузки фото
  var photo = window.utils.adForm.querySelector('.ad-form__photo'); // блок в котором отображается фото
  var photoDropZone = window.utils.adForm.querySelector('.ad-form__drop-zone'); // зона, на которую осуществляется перетаскивание
  var photoContainer = window.utils.adForm.querySelector('.ad-form__photo-container'); // контейнер с фотографиями

  /**
  * меняет аватарку на аватарку по умолчанию
  */
  var clearAvatar = function () {
    avatar.src = avatarInitial;
  };

  /**
  * отрисовывает превью файла
  * @param {File} file;
  * @param {HTMLImageElement} preview
  */
  var renderPreview = function (file, preview) {
    var fileName = file.name.toLowerCase();
    // по расширению файла проверяем, является ли выбранный файл изображением
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    // если файл прошел проверку, с помощью FileReader записываем его в кодировке Base:64 в src
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  };

  /**
  * отрисовыват превью при загрузке несколькиз файлов
  * @param {FileList} fileList
  */
  var renderMultipleFiles = function (fileList) {
    var fragment = document.createDocumentFragment();

    // переводим FileList в массив
    var fileArray = Array.prototype.slice.call(fileList);

    fileArray.forEach(function (file, index) {
      if (index === 0) {
        // в блок, в котором должно быть размещено фото добавляем img
        var image = document.createElement('img');
        image.width = 70;
        image.height = 70;
        photo.appendChild(image);
        // отрисовываем превью в img
        renderPreview(file, image);
      } else {
        // если фото > 1 -> клонируем блок для отображения фото
        photo = photo.cloneNode(true);
        image = photo.querySelector('img');
        renderPreview(file, image); // отрисовываем превью
        fragment.appendChild(photo); // добовляем сформированный блок во фрагмент
      }
    });
    photoContainer.appendChild(fragment); // добавляем фрагмент с блоками в разметку
  };


  /**
  * запрещает события по умолчанию
  * @param {Event} evt
  */
  var preventDefaults = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  };

  /**
  * изменяет цвет границы
  * @param {HTMLElement} dropZone
  */
  var highlight = function (dropZone) {
    dropZone.style.borderColor = '#ff5635';
  };

  /**
  * изменяет цвет границы (на первоначальный)
  * @param {HTMLElement} dropZone
  */
  var unhighlight = function (dropZone) {
    dropZone.style.borderColor = '#c7c7c7';
  };


  // добавление аватарки автора
  // через окно диалога выбора файла
  avatarChooser.addEventListener('change', function () {
    var avatarFile = avatarChooser.files[0];
    renderPreview(avatarFile, avatar);
  });

  // с помощью drag-n-drop
  avatarDropZone.addEventListener('dragenter', function (evt) {
    preventDefaults(evt);
    highlight(avatarDropZone);
  });

  avatarDropZone.addEventListener('dragover', function (evt) {
    preventDefaults(evt);
    highlight(avatarDropZone);
    evt.dataTransfer.dropEffect = 'copy';
  });

  avatarDropZone.addEventListener('dragleave', function (evt) {
    preventDefaults(evt);
    unhighlight(avatarDropZone);
  });

  avatarDropZone.addEventListener('drop', function (evt) {
    preventDefaults(evt);
    unhighlight(avatarDropZone);
    // сохраняем "перетянутые" файлы в свойство .files инпута
    avatarChooser.files = evt.dataTransfer.files;

    var avatarFile = evt.dataTransfer.files[0];
    renderPreview(avatarFile, avatar);
  });


  // добавление фотографий жилья
  // через окно диалога выбора файла
  photoChooser.addEventListener('change', function () {
    renderMultipleFiles(photoChooser.files);
  });

  // с помощью drag-n-drop
  photoDropZone.addEventListener('dragenter', function (evt) {
    preventDefaults(evt);
    highlight(photoDropZone);
  });

  photoDropZone.addEventListener('dragover', function (evt) {
    preventDefaults(evt);
    highlight(photoDropZone);
    evt.dataTransfer.dropEffect = 'copy';
  });

  photoDropZone.addEventListener('dragleave', function (evt) {
    preventDefaults(evt);
    unhighlight(photoDropZone);
  });

  photoDropZone.addEventListener('drop', function (evt) {
    preventDefaults(evt);
    unhighlight(photoDropZone);
    // сохраняем "перетянутые" файлы в свойство .files инпута
    photoChooser.files = evt.dataTransfer.files;
    // запускаем отрисовку
    renderMultipleFiles(evt.dataTransfer.files);
  });

  window.attachment = {
    clearAvatar: clearAvatar
  };
})();
