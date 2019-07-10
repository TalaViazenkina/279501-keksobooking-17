'use strict';

// модуль загрузки файлов в форму
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']; // допустимые расширения файлов

  var avatarChooser = window.utils.adForm.querySelector('#avatar'); // поле загрузки аватарки
  var avatar = window.utils.adForm.querySelector('.ad-form-header__preview img');
  var dropZone = window.utils.adForm.querySelector('.ad-form-header__drop-zone');

  var avatarFile;

  var renderPreview = function (file) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatar.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  avatarChooser.addEventListener('change', function () {
    avatarFile = avatarChooser.files[0];

    renderPreview(avatarFile);

  });

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
  */
  var highlight = function () {
    dropZone.style.borderColor = '#ff5635';
  };

  /**
  * изменяет цвет границы (на первоначальный)
  */
  var unhighlight = function () {
    dropZone.style.borderColor = '#c7c7c7';
  };

  dropZone.addEventListener('dragenter', function (evt) {
    preventDefaults(evt);
    highlight();
  });

  dropZone.addEventListener('dragover', function (evt) {
    preventDefaults(evt);
    highlight();
    evt.dataTransfer.dropEffect = 'copy';
  });

  dropZone.addEventListener('dragleave', function (evt) {
    preventDefaults(evt);
    unhighlight();
  });

  dropZone.addEventListener('drop', function (evt) {
    preventDefaults(evt);
    unhighlight();
    // сохраняем "перетянутые" файлы в свойство .files инпута
    avatarChooser.files = evt.dataTransfer.files;

    var dt = evt.dataTransfer;
    avatarFile = dt.files[0];

    renderPreview(avatarFile);

  });

})();
