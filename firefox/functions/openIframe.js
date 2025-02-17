let currentTicketId = null;
let openTicketsInIframeEnabled = false;
let openServiceCallIframeEnabled = false;

chrome.storage.sync.get(['openTicketsInIframeEnabled'], (result) => {
  openTicketsInIframeEnabled = result.openTicketsInIframeEnabled || false;
});
chrome.storage.sync.get(['openServiceCallIframeEnabled'], (result) => {
  openServiceCallIframeEnabled = result.openServiceCallIframeEnabled || false;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleOpenTicketsInIframe') {
    openTicketsInIframeEnabled = message.enabled;
  }
  if (message.action === 'toggleOpenServiceCallIframe') {
    openServiceCallIframeEnabled = message.enabled;
  }
});

function injectNavBarHighZIndexStyle() {
  let styleEl = document.getElementById("highZIndexNavBarStyle");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "highZIndexNavBarStyle";
    styleEl.textContent = "\n      #SiteNavigationBar, #SiteNavigationBar * {\n        z-index: 100000 !important;\n        overflow: visible !important;\n      }\n    ";
    document.head.appendChild(styleEl);
  }
}

function removeNavBarHighZIndexStyle() {
  const styleEl = document.getElementById("highZIndexNavBarStyle");
  if (styleEl) {
    styleEl.remove();
  }
}

function removeTicketIframe() {
  const iframe = document.getElementById("ticketDetailIframe");
  if (iframe) iframe.remove();
  const loadingOverlay = document.getElementById("ticketLoadingOverlay");
  if (loadingOverlay) loadingOverlay.remove();
  removeNavBarHighZIndexStyle();
  removeCloseTicketButton();
}

function addCloseTicketButton() {
  if (document.getElementById('CloseTicketButton')) return;
  const bookmarksButton = document.getElementById('BookmarksNavigationButton');
  if (!bookmarksButton) return;
  const closeButton = bookmarksButton.cloneNode(true);
  closeButton.id = 'CloseTicketButton';
  const textEl = closeButton.querySelector('.Text');
  if (textEl) {
    textEl.textContent = "Close Ticket";
  }
  closeButton.onclick = null;
  closeButton.addEventListener('click', function (e) {
    e.preventDefault();
    removeTicketIframe();
  });
  closeButton.addEventListener('mouseenter', () => {
    closeButton.classList.add('HoverState');
  });
  closeButton.addEventListener('mouseleave', () => {
    closeButton.classList.remove('HoverState');
    closeButton.classList.remove('PressedState');
  });
  closeButton.addEventListener('mousedown', () => {
    closeButton.classList.add('PressedState');
  });
  closeButton.addEventListener('mouseup', () => {
    closeButton.classList.remove('PressedState');
  });
  bookmarksButton.parentNode.insertBefore(closeButton, bookmarksButton.nextSibling);
}

function removeCloseTicketButton() {
  const btn = document.getElementById('CloseTicketButton');
  if (btn) btn.remove();
}

document.addEventListener("click", (e) => {
  const navBar = document.getElementById("SiteNavigationBar");
  if (navBar && navBar.contains(e.target)) {
    if (e.target.closest(".AutotaskLogoImage")) {
      removeTicketIframe();
      return;
    }
    let inException = false;
    if (e.target.closest("#NewSiteNavigationButton")) {
      inException = true;
    } else if (e.target.closest(".SearchBoxContainer") && !e.target.closest(".SearchButton")) {
      inException = true;
    } else {
      const anchor = e.target.closest("a");
      if (anchor && anchor.textContent.trim().toLowerCase().includes("dispatch calendar")) {
        inException = true;
      }
    }
    const interactive = e.target.closest("a, button, .SiteNavigationButton, .Button, .SearchButton");
    if (inException || !interactive) return;
    removeTicketIframe();
    return;
  }
  if (!openTicketsInIframeEnabled) return;
  let ticketRow = e.target.closest('tr.Display[data-interactive="true"]');
  if (!ticketRow) {
    const inlineElem = e.target.closest("[onclick*='TicketDetail']");
    if (inlineElem) {
      ticketRow = inlineElem.closest("tr.Display[data-row-key]");
    }
  }
  if (ticketRow) {
    e.preventDefault();
    e.stopImmediatePropagation();
    currentTicketId = ticketRow.getAttribute("data-row-key");
    if (!currentTicketId) return;
    const host = window.location.host;
    const ticketUrl = `https://${host}/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&mode=0&ticketId=${currentTicketId}`;
    let textEl = ticketRow.querySelector('.TextPartCell');
    if (!textEl) {
      const inlineElem = e.target.closest("[onclick*='TicketDetail']");
      textEl = inlineElem;
    }
    const displayText = textEl ? textEl.textContent.trim() : currentTicketId;
    const newEntry = {
      ticketId: currentTicketId,
      ticketNumber: currentTicketId,
      ticketTitle: displayText,
      displayText: displayText,
      timestamp: Date.now(),
      host: host
    };
    chrome.storage.sync.get(['ticketHistory'], (res) => {
      const oldHistory = res.ticketHistory || [];
      oldHistory.unshift(newEntry);
      chrome.storage.sync.set({ ticketHistory: oldHistory.slice(0, 30) });
    });
    removeTicketIframe();
    const navHeight = navBar ? navBar.offsetHeight : 0;
    const workspaceContainer = document.querySelector("#WorkspaceContainer");
    const workspaceBg = workspaceContainer ? window.getComputedStyle(workspaceContainer).backgroundColor : "#111b22";
    injectNavBarHighZIndexStyle();
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "ticketLoadingOverlay";
    Object.assign(loadingOverlay.style, {
      position: "fixed",
      top: navHeight + "px",
      left: "0",
      width: "100%",
      height: `calc(100% - ${navHeight}px)`,
      background: workspaceBg,
      zIndex: "50",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    });
    loadingOverlay.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loadingOverlay);
    if (!document.getElementById("spinnerStyle")) {
      const spinnerStyle = document.createElement("style");
      spinnerStyle.id = "spinnerStyle";
      spinnerStyle.textContent = "\n        .spinner {\n          border: 8px solid rgba(0, 0, 0, 0.1);\n          border-top: 8px solid #3498db;\n          border-radius: 50%;\n          width: 60px;\n          height: 60px;\n          animation: spin 1s linear infinite;\n        }\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n      ";
      document.head.appendChild(spinnerStyle);
    }
    const iframe = document.createElement("iframe");
    iframe.id = "ticketDetailIframe";
    iframe.src = ticketUrl;
    Object.assign(iframe.style, {
      position: "fixed",
      top: navHeight + "px",
      left: "0",
      width: "100%",
      height: `calc(100% - ${navHeight}px)`,
      border: "none",
      zIndex: "10",
      background: workspaceBg
    });
    document.body.appendChild(iframe);

    console.log("test");

    addCloseTicketButton();

    iframe.addEventListener("load", () => {
      loadingOverlay.remove();
      const detailDoc = iframe.contentDocument || iframe.contentWindow.document;
      const secTextElem = detailDoc.querySelector(".TitleBarItem.Title .SecondaryText");
      if (secTextElem) {
        const m = secTextElem.textContent.match(/T\d{8}\.\d{4}/);
        if (m && m[0]) {
          const correctTicketNumber = m[0];
          const rawTitle = secTextElem.textContent.trim();
          const cleanedTitle = rawTitle.replace(/^-?\s*T\d{8}\.\d{4}\s*-\s*/, "");
          chrome.storage.sync.get(["ticketHistory"], (res) => {
            let history = res.ticketHistory || [];
            for (let i = 0; i < history.length; i++) {
              if (history[i].ticketId === currentTicketId) {
                history[i].ticketNumber = correctTicketNumber;
                history[i].ticketTitle = cleanedTitle;
                history[i].displayText = `${correctTicketNumber} - ${cleanedTitle}`;
                break;
              }
            }
            chrome.storage.sync.set({ ticketHistory: history.slice(0, 30) });
          });
        }
      }
    });
  }
}, true);

document.addEventListener("keydown", (e) => {
  const searchInput = document.querySelector(".SearchInput");
  if (searchInput && document.activeElement === searchInput && e.key === "Enter") {
    removeTicketIframe();
  }
});

function attachToolbarButtonHandlers(container, iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const buttons = doc.querySelectorAll('div.Button2.ButtonIcon2.NormalBackground');
    buttons.forEach(btn => {
      const textElem = btn.querySelector('.Text2');
      if (!textElem) return;
      const btnText = textElem.textContent.trim();
      if (btnText === 'Save & Close') {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          iframe.addEventListener('load', function handler() {
            container.remove();
            iframe.removeEventListener('load', handler);
          });
        }, true);
      } else if (btnText === 'Cancel' || btnText === 'Close') {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          container.remove();
        }, true);
      }
    });
  } catch (err) { }
}

function attachForwardToolbarHandlers(container, iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const anchors = doc.querySelectorAll('a.ImgLink');
    anchors.forEach(anchor => {
      const title = anchor.getAttribute('title');
      if (title && title.toLowerCase() === 'save & close') {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          iframe.addEventListener('load', function handler() {
            container.remove();
            iframe.removeEventListener('load', handler);
          });
        }, true);
      } else if (title && title.toLowerCase() === 'cancel') {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          container.remove();
        }, true);
      }
    });
  } catch (err) { }
}

function attachTicketHistoryToolbarHandler(container, iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const btn = Array.from(doc.querySelectorAll('div.Button2.ButtonIcon2.NormalBackground'))
      .find(el => el.textContent.trim().toLowerCase() === 'close');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        container.remove();
      }, true);
    }
  } catch (err) { }
}

function extractTicketId() {
  const scripts = document.getElementsByTagName('script');
  const regex = /autotask\.bookmarkManagement\.__toggleBookmark\('TicketDetail',\s*(\d+)\)/;
  for (let script of scripts) {
    if (script.textContent) {
      const match = script.textContent.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  return null;
}

(function () {
  function addInterceptListeners(element, handler) {
    ['mousedown', 'mouseup', 'click'].forEach(function (eventType) {
      element.addEventListener(eventType, handler, true);
    });
  }

  function createIframeContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    Object.assign(container.style, {
      position: 'fixed',
      top: '10%',
      left: '50%',
      width: '56%',
      height: '80%',
      transform: 'translateX(-50%)',
      zIndex: '9999',
      backgroundColor: '#fff',
      border: '2px solid #000',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
    });
    return container;
  }

  function openServiceCallIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('service-call-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/Autotask/views/ServiceDesk/ServiceDeskTicket/service_ticket_panel_edit.aspx?ticketRenderType=ServiceCall&action=3&ticketID=${ticketId}`;
    const container = createIframeContainer('service-call-iframe-container');
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    let pendingClose = false;
    iframe.addEventListener('load', function () {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (pendingClose) {
          container.remove();
          return;
        }
        const buttonConfigs = [
          { id: 'ServiceCallButtonBar_btnSave', immediate: false },
          { id: 'ServiceCallButtonBar__ctl3', immediate: false },
          { id: 'ServiceCallButtonBar_btnCancel', immediate: true }
        ];
        buttonConfigs.forEach(function (config) {
          const btn = doc.getElementById(config.id);
          if (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              if (config.immediate) {
                container.remove();
              } else {
                pendingClose = true;
              }
            }, true);
          }
        });
        attachToolbarButtonHandlers(container, iframe);
      } catch (err) { }
    });
    iframe.src = url;
  }

  function openNewAttachmentIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('new-attachment-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/Mvc/File/Attachment.mvc/TicketAttachment?enablePublishing=True&ticketId=${ticketId}`;
    const container = createIframeContainer('new-attachment-iframe-container');
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    iframe.addEventListener('load', function () {
      attachToolbarButtonHandlers(container, iframe);
    });
    iframe.src = url;
  }

  function openForwardIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('forward-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/ServiceDesk/Popups/Forward/svcForward.asp?forward=1&taskIDs=${ticketId}`;
    const container = createIframeContainer('forward-iframe-container');
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    iframe.addEventListener('load', function () {
      attachForwardToolbarHandlers(container, iframe);
    });
    iframe.src = url;
  }

  function openTicketHistoryIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('ticket-history-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/Mvc/ServiceDesk/TicketHistory.mvc/ServiceTicketHistory?ticketId=${ticketId}`;
    const container = createIframeContainer('ticket-history-iframe-container');
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    iframe.addEventListener('load', function () {
      attachTicketHistoryToolbarHandler(container, iframe);
    });
    iframe.src = url;
  }

  function replaceServiceCallButtons() {
    if (!openServiceCallIframeEnabled) return;
    const buttons = document.querySelectorAll('.QuickLaunchButton.ServiceCall');
    buttons.forEach((btn) => {
      if (btn.dataset.replacedByExtension) return;
      btn.dataset.replacedByExtension = "true";
      if (btn.tagName === 'A') {
        btn.setAttribute('data-orig-href', btn.getAttribute('href'));
        btn.setAttribute('href', 'javascript:void(0);');
      }
      function interceptEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btn.onclick = null;
        btn.removeAttribute('onclick');
        if (e.type === 'click') {
          const ticketId = extractTicketId();
          if (ticketId) {
            openServiceCallIframe(ticketId);
          }
        }
      }
      addInterceptListeners(btn, interceptEvent);
    });
  }

  function replaceNewAttachmentButtons() {
    if (!openServiceCallIframeEnabled) return;
    const buttons = document.querySelectorAll('div.Button2.ButtonIcon2.NormalBackground');
    buttons.forEach((btn) => {
      if (btn.dataset.attachmentReplacedByExtension) return;
      const textElem = btn.querySelector('.Text2');
      if (textElem && textElem.textContent.trim() === 'New Attachment') {
        btn.dataset.attachmentReplacedByExtension = "true";
        function interceptEvent(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          btn.onclick = null;
          btn.removeAttribute('onclick');
          if (e.type === 'click') {
            let ticketId = currentTicketId || new URLSearchParams(window.location.search).get("ticketId");
            if (ticketId) {
              openNewAttachmentIframe(ticketId);
            }
          }
        }
        addInterceptListeners(btn, interceptEvent);
      }
    });
  }

  function replaceForwardButton() {
    if (!openServiceCallIframeEnabled) return;
    const items = document.querySelectorAll('.ToolBarItem.Left');
    items.forEach(item => {
      const btn = item.querySelector('div.Button2.ButtonIcon2.NormalBackground');
      if (btn) {
        const textElem = btn.querySelector('.Text2');
        if (textElem && textElem.textContent.trim().toLowerCase().includes('forward')) {
          if (btn.dataset.forwardReplacedByExtension) return;
          btn.dataset.forwardReplacedByExtension = "true";
          function interceptEvent(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            btn.onclick = null;
            btn.removeAttribute('onclick');
            if (e.type === 'click') {
              if (currentTicketId) {
                openForwardIframe(currentTicketId);
              }
            }
          }
          addInterceptListeners(btn, interceptEvent);
        }
      }
    });
  }

  function replaceTicketHistoryButton() {
    if (!openServiceCallIframeEnabled) return;
    const btn = Array.from(document.querySelectorAll('a.Button.ButtonIcon.ViewHistory.Navigation.NormalState'))
      .find(el => el.textContent.trim().toLowerCase().includes('ticket history'));
    if (btn && !btn.dataset.historyReplacedByExtension) {
      btn.dataset.historyReplacedByExtension = "true";
      if (btn.tagName === 'A') {
        btn.setAttribute('data-orig-href', btn.getAttribute('href'));
        btn.setAttribute('href', 'javascript:void(0);');
      }
      function interceptEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btn.onclick = null;
        btn.removeAttribute('onclick');
        if (e.type === 'click') {
          if (!currentTicketId) {
            currentTicketId = extractTicketId();
          }
          if (currentTicketId) {
            openTicketHistoryIframe(currentTicketId);
          }
        }
      }
      addInterceptListeners(btn, interceptEvent);
    }
  }

  function replaceQuickLaunchAttachmentButtons() {
    if (!openServiceCallIframeEnabled) return;
    const buttons = document.querySelectorAll('div.QuickLaunchButton.Attachment.NormalState');
    buttons.forEach((btn) => {
      if (btn.dataset.attachmentQuickLaunchReplacedByExtension) return;
      btn.dataset.attachmentQuickLaunchReplacedByExtension = "true";
      function interceptEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btn.onclick = null;
        btn.removeAttribute('onclick');
        if (e.type === 'click') {
          let ticketId = currentTicketId || new URLSearchParams(window.location.search).get("ticketId");
          if (ticketId) {
            openNewAttachmentIframe(ticketId);
          }
        }
      }
      addInterceptListeners(btn, interceptEvent);
    });
  }

  const observer = new MutationObserver(() => {
    replaceServiceCallButtons();
    replaceNewAttachmentButtons();
    replaceForwardButton();
    replaceTicketHistoryButton();
    replaceQuickLaunchAttachmentButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  replaceServiceCallButtons();
  replaceNewAttachmentButtons();
  replaceForwardButton();
  replaceTicketHistoryButton();
  replaceQuickLaunchAttachmentButtons();

  document.addEventListener('click', function (e) {
    if (!openServiceCallIframeEnabled) return;
    const forwardEl = e.target.closest('div.Button2.ButtonIcon2.NormalBackground');
    if (forwardEl && forwardEl.querySelector('.StandardButtonIcon.Forward')) {
      const txt = forwardEl.querySelector('.Text2');
      if (txt && txt.textContent.trim().toLowerCase().includes('forward')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (!currentTicketId) {
          currentTicketId = extractTicketId();
        }
        if (currentTicketId) {
          openForwardIframe(currentTicketId);
        }
      }
    }
  }, true);

  document.addEventListener('click', function (e) {
    if (!openServiceCallIframeEnabled) return;
    const historyEl = e.target.closest('a.Button.ButtonIcon.ViewHistory.Navigation.NormalState');
    if (historyEl && historyEl.textContent.trim().toLowerCase().includes('ticket history')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!currentTicketId) {
        currentTicketId = extractTicketId();
      }
      if (currentTicketId) {
        openTicketHistoryIframe(currentTicketId);
      }
    }
  }, true);
})();