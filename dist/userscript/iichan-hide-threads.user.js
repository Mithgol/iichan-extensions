// ==UserScript==
// @name         [IIchan] Hide threads
// @namespace    http://iichan.hk/
// @license      MIT
// @version      0.2
// @description  Adds hide thread feature to iichan
// @icon         http://iichan.hk/favicon.ico
// @updateURL    https://raw.github.com/WagonOfDoubt/iichan-extensions/master/dist/userscript/iichan-hide-threads.meta.js
// @author       Cirno
// @match        http://iichan.hk/*
// @match        https://iichan.hk/*
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  /*
  Сколько первых символов из поста показывать в заголовке скрытого треда
  */
  const THREAD_TITLE_LENGTH = 50;

  const LOCALSTORAGE_KEY = 'iichan_hidden_threads';
  const HIDDEN_THREAD_CLASSNAME = 'iichan-thread-hidden';
  const HIDE_BTN_CLASSNAME = 'iichan-hide-thread-btn';
  const PLACEHOLDER_CLASSNAME = 'iichan-hidden-thread-placeholder';
  const board = window.location.href.match(/(?:\w+\.\w+\/)(.*)(?=\/)/)[1];

  const getHiddenThreads = () => {
    const json = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY) || '{}');
    return Array.isArray(json) ? {} : json;
  };

  const setHiddenThreads = (hiddenThreads) => {
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(hiddenThreads));
  };

  const addHideBtns = () => {
    const threads = document.querySelectorAll('[id^=thread]');
    for (const thread of threads) {
      const label = thread.querySelector(':scope > label');
      if (!label) continue;

      label.insertAdjacentHTML('afterend', `
        <span class="${HIDE_BTN_CLASSNAME}" title="Скрыть тред"></span>
      `);
      const btn = label.nextElementSibling;
      btn.threadId = thread.id;
      btn.addEventListener('click', hideThread);
    }
  };

  const unhideThread = (e) => {
    const threadId = typeof e === 'object' ? e.target.threadId : e;
    const hiddenThreads = getHiddenThreads();
    if (!hiddenThreads[board]) {
      hiddenThreads[board] = [];
    }
    const index = hiddenThreads[board].indexOf(threadId);
    if (index === -1) return;
    hiddenThreads[board].splice(index, 1);
    setHiddenThreads(hiddenThreads);

    const thread = document.getElementById(threadId);
    if(!thread) return;

    thread.classList.remove(HIDDEN_THREAD_CLASSNAME);
    const placeholder = document.getElementById('iichan-hidden-' + threadId);
    if (placeholder) {
      placeholder.parentElement.removeChild(placeholder);
    }
  };

  const hideThread = (e) => {
    const threadId = typeof e === 'object' ? e.target.threadId : e;
    const thread = document.getElementById(threadId);
    if(!thread || !thread.parentNode) return;

    const threadNo = threadId.split('-')[1];
    let threadTitle = thread.querySelector('.filetitle').innerText ||
      thread.querySelector('blockquote').innerText;
    threadTitle = threadTitle.substr(0, THREAD_TITLE_LENGTH);
    const placeholderId = 'iichan-hidden-' + threadId;
    thread.insertAdjacentHTML('beforebegin', `
      <div class="reply ${PLACEHOLDER_CLASSNAME}" id="${placeholderId}">Тред <a>№${threadNo}</a> скрыт (${threadTitle || 'изображение'})</div>
    `);

    const placeholderBtn = thread.previousElementSibling.querySelector(':scope > a');
    placeholderBtn.threadId = threadId;
    placeholderBtn.addEventListener('click', unhideThread);

    thread.classList.add(HIDDEN_THREAD_CLASSNAME);
    // save result
    const hiddenThreads = getHiddenThreads();
    if (!hiddenThreads[board]) {
      hiddenThreads[board] = [];
    }
    if (!hiddenThreads[board].includes(threadId)) {
      hiddenThreads[board].push(threadId);
      setHiddenThreads(hiddenThreads);
    }
  };

  const hideAllHiddenThreads = () => {
    const hiddenThreads = getHiddenThreads();
    if (!hiddenThreads[board]) {
      return;
    }
    for (const thread of hiddenThreads[board]) {
      hideThread(thread);
    }
  };

  const appendCSS = () => {
    document.head.insertAdjacentHTML('beforeend',
      `<style type="text/css">
        .${PLACEHOLDER_CLASSNAME} {
            pointer-events: none;
        }
        
        .${PLACEHOLDER_CLASSNAME} a {
            cursor: pointer;
            pointer-events: auto;
        }
        
        .${PLACEHOLDER_CLASSNAME}:hover + div,
        .${PLACEHOLDER_CLASSNAME}:hover + div + br {
            display: block !important;
        }
        
        .${HIDDEN_THREAD_CLASSNAME} {
            display: none;
        }
        .${HIDDEN_THREAD_CLASSNAME} +  br {
            display: none;
        }
        
        .${HIDE_BTN_CLASSNAME} {
            margin-left: 0.2em;
            cursor: pointer;
        }
        
        .${HIDE_BTN_CLASSNAME}::after {
            content: '[✕]';
        }
      </style>`);
  };

  const init = () => {
    const threads = document.querySelectorAll('[id^=thread]');
    if (threads.length <= 1) {
      return;
    }
    appendCSS();
    addHideBtns();
    hideAllHiddenThreads();
  };

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
