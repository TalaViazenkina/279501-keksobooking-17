'use strict';

// модуль загрузки файлов в форму
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']; // допустимые расширения файлов
  var IMAGE_SIZE = 70; // размер изображения в превью

  var DropZoneStyle = {
    BORDER_ACTIVE: '#ff5635',
    BG_ACTIVE: 'rgba(255, 86, 53, 0.1)',
    BORDER_INITIAL: '#c7c7c7',
    BG_INITIAL: 'transparent'
  };

  var avatarChooser = window.utils.adForm.querySelector('#avatar'); // поле загрузки аватарки
  var avatar = window.utils.adForm.querySelector('.ad-form-header__preview img'); // поле отображения аватара
  var avatarDropZone = window.utils.adForm.querySelector('.ad-form-header__drop-zone'); // зона, на которую осуществляется перетаскивание
  var avatarInitial = avatar.src; // адрес аватарки по умолчанию

  var photoChooser = window.utils.adForm.querySelector('#images'); // поле загрузки фото
  var photo = window.utils.adForm.querySelector('.ad-form__photo'); // блок в котором отображается фото
  var photoDropZone = window.utils.adForm.querySelector('.ad-form__drop-zone'); // зона, на которую осуществляется перетаскивание
  var photoContainer = window.utils.adForm.querySelector('.ad-form__photo-container'); // контейнер с фотографиями

  var isAttachedFiles; // флаг, показывающий, что были добавлены фотографии

  var avatarFile;
  var photoFile;

  /**
  * меняет аватарку на аватарку по умолчанию
  */
  var clearAvatar = function () {
    avatar.src = avatarInitial;
    window.attachment.avatarFile = undefined; // обнуляем добавленный файл с аватаркой
  };

  /**
  * очищает область с превью фотографий жилья
  */
  var clearPhoto = function () {
    // если фотографии были ранее добавлены - находим блоки с превью
    if (isAttachedFiles) {
      var attachedPhotos = Array.prototype.slice.call(photoContainer.querySelectorAll('.ad-form__photo'));
      attachedPhotos.forEach(function (it, index) {
        // в первом блоке удаляем только фото
        if (index === 0) {
          (it.querySelector('img')).remove();
        } else {
        // все поледующие блоки удаляем целиком
          it.remove();
        }
      });

      window.attachment.photoFile = []; // обнуляем список добавленных файлов
      isAttachedFiles = false; // меняем флаг
    }
  };

  /**
  * проверяет соответствие расширения файла заданному
  * @param {File} file
  * @return {boolean}
  */
  var checkType = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  /**
  * отрисовывает превью файла
  * @param {File} file;
  * @param {HTMLImageElement} preview
  */
  var renderPreview = function (file, preview) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  /**
  * отрисовыват превью при загрузке несколькиз файлов
  * @param {FileList} fileList
  * @return {Array}
  */
  var renderMultipleFiles = function (fileList) {
    // удаляем превью, если они уже были отрисованы
    clearPhoto();

    var correctFiles = []; // массив для хранения только файлов изображений
    var fragment = document.createDocumentFragment();
    var image;

    // переводим FileList в массив
    var fileArray = Array.prototype.slice.call(fileList);

    fileArray.forEach(function (file) {
      if (file && checkType(file)) {
        if (!image) {
          image = document.createElement('img');
          image.width = IMAGE_SIZE;
          photo.appendChild(image);
          renderPreview(file, image);
          correctFiles.push(file);
        } else {
          var photoClone = photo.cloneNode(true);
          image = photoClone.querySelector('img');
          renderPreview(file, image);
          fragment.appendChild(photoClone);
          correctFiles.push(file);
        }
        isAttachedFiles = true;
      }
      photoContainer.appendChild(fragment); // добавляем фрагмент с блоками в разметку
    });
    return correctFiles;
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
  * "подсвечивает" область на которую осуществляется перетаскивание
  * @param {HTMLElement} dropZone
  */
  var highlight = function (dropZone) {
    dropZone.style.borderColor = DropZoneStyle.BORDER_ACTIVE;
    dropZone.style.backgroundColor = DropZoneStyle.BG_ACTIVE;
  };

  /**
  * меняет стили области перетаскивания на первоначальные
  * @param {HTMLElement} dropZone
  */
  var unhighlight = function (dropZone) {
    dropZone.style.borderColor = DropZoneStyle.BORDER_INITIAL;
    dropZone.style.backgroundColor = DropZoneStyle.BG_INITIAL;
  };


  // добавление аватарки автора
  // через окно диалога выбора файла
  avatarChooser.addEventListener('change', function () {
    avatarFile = avatarChooser.files[0];
    if (avatarFile && checkType(avatarFile)) {
      renderPreview(avatarFile, avatar);
    }
    window.attachment.avatarFile = undefined;
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

    avatarFile = evt.dataTransfer.files[0];
    if (avatarFile && checkType(avatarFile)) {
      renderPreview(avatarFile, avatar);
      window.attachment.avatarFile = avatarFile;
    }
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

    // запускаем отрисовку
    window.attachment.photoFile = renderMultipleFiles(evt.dataTransfer.files);
  });

  window.attachment = {
    avatarFile: avatarFile,
    photoFile: photoFile,
    clearAvatar: clearAvatar,
    clearPhoto: clearPhoto
  };
})();
