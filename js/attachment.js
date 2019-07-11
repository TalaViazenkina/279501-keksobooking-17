'use strict';

// модуль загрузки файлов в форму
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']; // допустимые расширения файлов

  var avatarChooser = window.utils.adForm.querySelector('#avatar'); // поле загрузки аватарки
  var avatar = window.utils.adForm.querySelector('.ad-form-header__preview img');
  var avatarDropZone = window.utils.adForm.querySelector('.ad-form-header__drop-zone');

  var photoChooser = window.utils.adForm.querySelector('#images'); // поле загрузки аватарки
  var photo = window.utils.adForm.querySelector('.ad-form__photo');
  var photoDropZone = window.utils.adForm.querySelector('.ad-form__drop-zone');
  var photoContainer = window.utils.adForm.querySelector('.ad-form__photo-container');

  var avatarFile;
  var photoFile;

  var renderPreview = function (file, preview) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

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
  avatarChooser.addEventListener('change', function () {
    avatarFile = avatarChooser.files[0];

    renderPreview(avatarFile, avatar);
  });

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

    var dt = evt.dataTransfer;
    avatarFile = dt.files[0];

    renderPreview(avatarFile, avatar);
  });


  // добавление фотографий жилья
  photoChooser.addEventListener('change', function () {
    renderMultipleFiles(photoChooser.files);
  });

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


})();
