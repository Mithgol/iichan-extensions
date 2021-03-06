(function () {
  'use strict';

  /*
  Список расширений файлов, преобразуемых в видеопроигрыватели.
  */

  var EXTENSIONS = ['webm', 'mp4', 'ogv'];
  /*
  Класс CSS, применяемый для видеопроигрывателей.
  */
  var VIDEO_PLAYER_CLASSNAME = 'iichan-video-player';

  var onThumbnailClick = function onThumbnailClick(e) {
    var parentNode = e.currentTarget.parentNode;

    if (e.currentTarget.videoMode === 'on') {
      e.currentTarget.videoMode = 'off';

      parentNode.removeChild(document.getElementById(e.currentTarget.videoplayerid));
      e.currentTarget.innerHTML = e.currentTarget.thumbHTML;
    } else {
      e.currentTarget.videoMode = 'on';

      var vp = document.createElement('video');
      vp.id = 'video' + ('' + Math.random()).replace(/\D/g, '');
      vp.poster = e.currentTarget.thumbSrc;
      vp.src = e.currentTarget.href;
      vp.autoplay = true;
      vp.controls = true;
      vp.loop = true;
      vp.muted = true;
      vp.classList.add(VIDEO_PLAYER_CLASSNAME);
      e.currentTarget.videoplayerid = vp.id;
      parentNode.insertBefore(vp, e.currentTarget.nextSibling);
      e.currentTarget.innerHTML = '<div class="hidevideo">[Свернуть видео]</div>';
    }

    e.preventDefault();
  };

  var addListeners = function addListeners(rootNode) {
    var thumbs = (rootNode || document).querySelectorAll('.thumb');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = thumbs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var img = _step.value;

        var a = img.parentNode;
        if (!a) continue;
        var videoExt = a.href.split('.').pop();
        if (!EXTENSIONS.includes(videoExt)) continue;
        a.thumbSrc = img.src;
        a.thumbHTML = a.innerHTML;
        a.addEventListener('click', onThumbnailClick);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  var appendCSS = function appendCSS() {
    return document.head.insertAdjacentHTML('beforeend', '<style type="text/css">\n      .' + VIDEO_PLAYER_CLASSNAME + ' {\n        max-width: 100%;\n        height: auto;\n        box-sizing: border-box;\n        padding: 2px 20px;\n        margin: 0;\n      }\n      .hidevideo {\n        padding: 2px 20px;\n      }\n    </style>');
  };

  var init = function init() {
    if (document.querySelector('#de-main')) return;
    appendCSS();
    addListeners();
    if ('MutationObserver' in window) {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = mutation.addedNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var node = _step2.value;

              if (!node.querySelectorAll) return;
              addListeners(node);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();