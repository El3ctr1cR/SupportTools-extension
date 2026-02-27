/**
 * dRmmTrueStretch.js
 * Runs in the ISOLATED content script context.
 *
 * Handles: CSS stretch, storage, popup messages.
 * Injects dRmmTrueStretchScript.js into the PAGE's JS context via
 * <script src="..."> so it can patch mouse events before Datto's own
 * handlers see them. Communicates scale factors via window.postMessage.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'dattoTrueStretch_enabled';
  const MSG_TYPE    = 'dattoStretchScale';

  let stretchEnabled     = false;
  let rafId              = null;
  let currentScaleX      = 1;
  let currentScaleY      = 1;
  let pageScriptInjected = false;

  // ── Page script injection ──────────────────────────────────────────────────

  function injectPageScript() {
    if (pageScriptInjected) return;
    pageScriptInjected = true;
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('functions/dRmmTrueStretchScript.js');
    (document.head || document.documentElement).appendChild(script);
  }

  function sendScale() {
    window.postMessage({
      type:    MSG_TYPE,
      scaleX:  currentScaleX,
      scaleY:  currentScaleY,
      enabled: stretchEnabled,
    }, '*');
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

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

  // ── CSS stretch ────────────────────────────────────────────────────────────

  function applyStretch() {
    const displayOuter = document.getElementById('display-outer');
    if (!displayOuter) return;

    const naturalW = displayOuter.offsetWidth;
    const naturalH = displayOuter.offsetHeight;
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

    displayOuter.style.setProperty('transform',        `scale(${currentScaleX}, ${currentScaleY})`, 'important');
    displayOuter.style.setProperty('transform-origin', 'top left',                                  'important');

    let parent = displayOuter.parentElement;
    while (parent && parent !== document.body) {
      parent.style.setProperty('overflow', 'visible', 'important');
      parent = parent.parentElement;
    }
  }

  function removeStretch() {
    currentScaleX = 1;
    currentScaleY = 1;
    sendScale();

    const displayOuter = document.getElementById('display-outer');
    if (!displayOuter) return;
    displayOuter.style.removeProperty('transform');
    displayOuter.style.removeProperty('transform-origin');

    let parent = displayOuter.parentElement;
    while (parent && parent !== document.body) {
      parent.style.removeProperty('overflow');
      parent = parent.parentElement;
    }
  }

  // ── RAF loop ───────────────────────────────────────────────────────────────

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

  // ── Toggle ─────────────────────────────────────────────────────────────────

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

  // ── Init ───────────────────────────────────────────────────────────────────

  function init() {
    injectPageScript();

    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const saved = result[STORAGE_KEY] ?? false;

      const readyCheck = setInterval(() => {
        const displayOuter = document.getElementById('display-outer');
        if (!displayOuter || !displayOuter.offsetWidth || !displayOuter.offsetHeight) return;
        if (!findScaleDiv(displayOuter)) return;

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