(function () {
  'use strict';

  const STORAGE_KEY = 'dattoTrueStretch_enabled';
  const MSG_TYPE    = 'dattoStretchScale';

  let stretchEnabled     = false;
  let rafId              = null;
  let currentScaleX      = 1;
  let currentScaleY      = 1;
  let pageScriptInjected = false;

  function injectPageScript() {
    if (pageScriptInjected) return;
    pageScriptInjected = true;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('functions/dattormm/TrueStretchScript.js');
    (document.head || document.documentElement).appendChild(script);
  }

  function getDisplayElement() {
    return (
      document.getElementById('display-outer') ||
      document.getElementById('video-display-container') ||
      null
    );
  }

  function isVideoSession(el) {
    return el && el.id === 'video-display-container';
  }

  function getLayoutOffset(el) {
    let left = 0, top = 0;
    let curr = el;
    while (curr && curr !== document.body) {
      left += curr.offsetLeft;
      top  += curr.offsetTop;
      curr  = curr.offsetParent;
    }
    return { left, top };
  }

  function sendScale() {
    const displayEl = getDisplayElement();
    const { left: elLeft, top: elTop } = displayEl
      ? getLayoutOffset(displayEl)
      : { left: 0, top: 0 };

    window.postMessage({
      type:    MSG_TYPE,
      scaleX:  currentScaleX,
      scaleY:  currentScaleY,
      enabled: stretchEnabled,
      elLeft,
      elTop,
    }, '*');
  }

  function getSidebarWidth() {
    const sider = document.querySelector('.ant-layout-sider');
    return sider ? sider.offsetWidth : 250;
  }

  function findScaleDiv(displayOuter) {
    const matches = displayOuter.querySelectorAll('div[style*="scale("]');
    if (matches.length > 0) return matches[0];
    const child = displayOuter.querySelector('div');
    return child ? (child.querySelector('div') || child) : null;
  }

  function applyStretch() {
    const displayEl = getDisplayElement();
    if (!displayEl) return;

    const naturalW = displayEl.offsetWidth;
    const naturalH = displayEl.offsetHeight;
    if (!naturalW || !naturalH) return;

    const sidebarW = getSidebarWidth();
    const availW   = window.innerWidth  - sidebarW;
    const availH   = window.innerHeight;

    const newScaleX = availW / naturalW;
    const newScaleY = availH / naturalH;

    if (newScaleX !== currentScaleX || newScaleY !== currentScaleY) {
      currentScaleX = newScaleX;
      currentScaleY = newScaleY;
      sendScale();
    }

    displayEl.style.setProperty('transform',        `scale(${currentScaleX}, ${currentScaleY})`, 'important');
    displayEl.style.setProperty('transform-origin', 'top left',                                  'important');

    let parent = displayEl.parentElement;
    while (parent && parent !== document.body) {
      parent.style.setProperty('overflow', 'visible', 'important');
      if (parent === displayEl.parentElement && isVideoSession(displayEl)) {
        parent.style.setProperty('width',  `${availW}px`, 'important');
        parent.style.setProperty('height', `${availH}px`, 'important');
      }
      parent = parent.parentElement;
    }
  }

  function removeStretch() {
    currentScaleX = 1;
    currentScaleY = 1;
    sendScale();

    const displayEl = getDisplayElement();
    if (!displayEl) return;

    displayEl.style.removeProperty('transform');
    displayEl.style.removeProperty('transform-origin');

    let parent = displayEl.parentElement;
    while (parent && parent !== document.body) {
      parent.style.removeProperty('overflow');
      if (parent === displayEl.parentElement && isVideoSession(displayEl)) {
        parent.style.removeProperty('width');
        parent.style.removeProperty('height');
      }
      parent = parent.parentElement;
    }
  }

  function startLoop() {
    function loop() {
      if (!stretchEnabled) return;
      applyStretch();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function setStretch(enabled) {
    stretchEnabled = enabled;
    chrome.storage.local.set({ [STORAGE_KEY]: enabled });
    sendScale();
    if (enabled) {
      startLoop();
    } else {
      stopLoop();
      removeStretch();
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleDattoStretch') setStretch(message.enabled);
  });

  window.addEventListener('resize', () => {
    if (stretchEnabled) applyStretch();
  });

  function isPageReady() {
    const el = getDisplayElement();
    if (!el || !el.offsetWidth || !el.offsetHeight) return false;
    if (isVideoSession(el)) return !!el.querySelector('video');
    return !!findScaleDiv(el);
  }

  function init() {
    injectPageScript();

    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const saved = result[STORAGE_KEY] ?? false;

      const readyCheck = setInterval(() => {
        if (!isPageReady()) return;
        clearInterval(readyCheck);
        if (saved) setStretch(true);
      }, 300);

      setTimeout(() => clearInterval(readyCheck), 120_000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();