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
    var fragment = document.createDocumentFragment();
    var image = document.createElement('img');
    image.width = 70;
    image.height = 70;
    photo.appendChild(image);

    var photoFiles = Array.prototype.slice.call(photoChooser.files);
    photoFiles.forEach(function (file, index) {
      if (index === 0) {
        renderPreview(file, image);
      } else {
        var photoBox = photo.cloneNode(true);
        var photoBoxImage = photoBox.querySelector('img');
        renderPreview(file, photoBoxImage);
        fragment.appendChild(photoBox);
      }
    });
    photoContainer.appendChild(fragment);
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

    var photoFiles = Array.prototype.slice.call(evt.dataTransfer.files);

    var fragment = document.createDocumentFragment();
    var image = document.createElement('img');
    image.width = 70;
    image.height = 70;
    photo.appendChild(image);

    photoFiles.forEach(function (file, index) {
      if (index === 0) {
        renderPreview(file, image);
      } else {
        var photoBox = photo.cloneNode(true);
        var photoBoxImage = photoBox.querySelector('img');
        renderPreview(file, photoBoxImage);
        fragment.appendChild(photoBox);
      }
    });
    photoContainer.appendChild(fragment);

  });


})();
