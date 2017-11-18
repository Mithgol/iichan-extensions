(() => {
  'use strict';

  /*
  Список расширений файлов, преобразуемых в видеопроигрыватели.
  */
  const EXTENSIONS = ['webm', 'mp4', 'ogv'];
  /*
  Класс CSS, применяемый для видеопроигрывателей.
  */
  const VIDEO_PLAYER_CLASSNAME = 'iichan-video-player';

  const onThumbnailClick = e => {
    const parentNode = e.currentTarget.parentNode;

    if( e.currentTarget.dataset.videoMode ){
      e.currentTarget.dataset.videoMode = false;

      parentNode.removeChild(e.currentTarget.dataset.videoPlayer);
      e.currentTarget.innerHTML = e.currentTarget.dataset.thumbHTML;
    } else {
      e.currentTarget.dataset.videoMode = true;

      const vp = document.createElement('video');
      vp.poster = e.currentTarget.dataset.thumbSrc;
      vp.src = e.currentTarget.href;
      vp.autoplay = true;
      vp.controls = true;
      vp.loop = true;
      vp.muted = true;
      vp.classList.add(VIDEO_PLAYER_CLASSNAME);
      e.currentTarget.dataset.videoPlayer = vp;
      parentNode.insertBefore(vp, e.currentTarget.nextSibling);
      e.currentTarget.innerHTML = '[Свернуть видео]';
    }

    e.preventDefault();
  };

  const addListeners = rootNode => {
    const thumbs = (rootNode || document).querySelectorAll('.thumb');
    for (const img of thumbs) {
      const a = img.parentNode;
      if (!a) continue;
      const videoExt = a.href.split('.').pop();
      if (!EXTENSIONS.includes(videoExt)) continue;
      a.dataset.thumbSrc = img.src;
      a.dataset.thumbHTML = a.innerHTML;
      a.addEventListener('click', onThumbnailClick);
    }
  };

  const appendCSS = () => document.head.insertAdjacentHTML(
    'beforeend',
    `<style type="text/css">.${VIDEO_PLAYER_CLASSNAME} {
      max-width: 100%;
      height: auto;
      box-sizing: border-box;
      margin: 2px 20px;
    }</style>`
  );

  const init = () => {
    if (document.querySelector('#de-main')) return;
    appendCSS();
    addListeners();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
          if (!node.querySelectorAll) return;
          addListeners(node);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
