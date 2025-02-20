let currentTicketId = null;
let currentAccountId = null;
let inAppIframesOutsideTicket = false;
let inAppIframesInsideTicket = false;
let gridPayloads = [];

chrome.storage.sync.get(['inAppIframesOutsideTicket'], (result) => {
  inAppIframesOutsideTicket = result.inAppIframesOutsideTicket || false;
});
chrome.storage.sync.get(['inAppIframesInsideTicket'], (result) => {
  inAppIframesInsideTicket = result.inAppIframesInsideTicket || false;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleInAppIframesOutsideTicket') {
    inAppIframesOutsideTicket = message.enabled;
  }
  if (message.action === 'toggleInAppIframesInsideTicket') {
    inAppIframesInsideTicket = message.enabled;
  }
});

(function () {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("functions/gridInterceptor.js");
  s.onload = function () { this.remove(); };
  (document.head || document.documentElement).appendChild(s);
})();

window.addEventListener("message", function (event) {
  if (event.source !== window) return;
  if (event.data && event.data.type === "GRID_PAYLOAD") {
    const data = event.data.payload;
    if (data && data.data && Array.isArray(data.data)) {
      gridPayloads.push({ data: data.data });
    } else if (data && data.primaryData) {
      gridPayloads.push({ data: [data] });
    }
  }
});

function removeTicketIframe() {
  const iframe = document.getElementById("ticketDetailIframe");
  if (iframe) iframe.remove();
  const loadingOverlay = document.getElementById("ticketLoadingOverlay");
  if (loadingOverlay) loadingOverlay.remove();
  removeCloseTicketButton();
}

function addCloseTicketButton() {
  const doc = window.top !== window.self ? window.top.document : document;
  if (doc.getElementById('CloseTicketButton')) return;
  const refContainer = doc.querySelector('div.o-header-navigation-menu-button[data-onyx-external-id="0C07O8TE"]');
  if (!refContainer) return;
  const refButton = refContainer.querySelector('button[title="Calendar"]');
  if (!refButton) return;
  const closeButton = refButton.cloneNode(true);
  closeButton.id = 'CloseTicketButton';
  const textEl = closeButton.querySelector('.o-header-navigation-menu-button__button__name');
  if (textEl) {
    textEl.textContent = "Close Ticket";
  }
  const arrowIcon = closeButton.querySelector('.o-header-navigation-menu-button__button__arrow');
  if (arrowIcon) {
    arrowIcon.remove();
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
    closeButton.classList.remove('HoverState', 'PressedState');
  });
  closeButton.addEventListener('mousedown', () => {
    closeButton.classList.add('PressedState');
  });
  closeButton.addEventListener('mouseup', () => {
    closeButton.classList.remove('PressedState');
  });
  const parent = refContainer.parentNode;
  const siblings = Array.from(parent.children);
  const refIndex = siblings.indexOf(refContainer);
  const targetIndex = refIndex + 2;
  if (siblings[targetIndex]) {
    parent.insertBefore(closeButton, siblings[targetIndex].nextSibling);
  } else {
    parent.appendChild(closeButton);
  }
}

function removeCloseTicketButton() {
  const doc = window.top !== window.self ? window.top.document : document;
  const btn = doc.getElementById('CloseTicketButton');
  if (btn) btn.remove();
}

function addCloseCustomerButton() {
  const doc = window.top !== window.self ? window.top.document : document;
  if (doc.getElementById('CloseCustomerButton')) return;
  const refContainer = doc.querySelector('div.o-header-navigation-menu-button[data-onyx-external-id="0C07O8TE"]');
  if (!refContainer) return;
  const refButton = refContainer.querySelector('button[title="Calendar"]');
  if (!refButton) return;
  const closeButton = refButton.cloneNode(true);
  closeButton.id = 'CloseCustomerButton';
  const textEl = closeButton.querySelector('.o-header-navigation-menu-button__button__name');
  if (textEl) {
    textEl.textContent = "Close Customer";
  }
  const arrowIcon = closeButton.querySelector('.o-header-navigation-menu-button__button__arrow');
  if (arrowIcon) {
    arrowIcon.remove();
  }
  closeButton.onclick = null;
  closeButton.addEventListener('click', function (e) {
    e.preventDefault();
    removeAccountIframe();
  });
  closeButton.addEventListener('mouseenter', () => {
    closeButton.classList.add('HoverState');
  });
  closeButton.addEventListener('mouseleave', () => {
    closeButton.classList.remove('HoverState', 'PressedState');
  });
  closeButton.addEventListener('mousedown', () => {
    closeButton.classList.add('PressedState');
  });
  closeButton.addEventListener('mouseup', () => {
    closeButton.classList.remove('PressedState');
  });
  const parent = refContainer.parentNode;
  const siblings = Array.from(parent.children);
  const refIndex = siblings.indexOf(refContainer);
  const targetIndex = refIndex + 2;
  if (siblings[targetIndex]) {
    parent.insertBefore(closeButton, siblings[targetIndex].nextSibling);
  } else {
    parent.appendChild(closeButton);
  }
}

function removeCloseCustomerButton() {
  const doc = window.top !== window.self ? window.top.document : document;
  const btn = doc.getElementById('CloseCustomerButton');
  if (btn) btn.remove();
}

document.addEventListener("click", (e) => {
  if (!inAppIframesOutsideTicket) return;
  const customerRow = e.target.closest("tr.Display[data-row-key]");
  if (customerRow) {
    const textCells = customerRow.querySelectorAll("td.TextCell");
    if (!textCells || textCells.length === 0) return;
    const lastCell = textCells[textCells.length - 1];
    if (lastCell.textContent.trim().toLowerCase() !== "customer") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const accountId = customerRow.getAttribute("data-row-key");
    if (!accountId) return;
    currentAccountId = accountId;
    const host = window.location.host;
    const accountUrl = `https://${host}/Mvc/CRM/AccountDetail.mvc?accountId=${accountId}`;
    removeAccountIframe();
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "accountLoadingOverlay";
    Object.assign(loadingOverlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "transparent",
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
      spinnerStyle.textContent = `
        .spinner {
          border: 8px solid rgba(0, 0, 0, 0.1);
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(spinnerStyle);
    }
    const iframe = document.createElement("iframe");
    iframe.id = "accountDetailIframe";
    iframe.src = accountUrl;
    Object.assign(iframe.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      border: "none",
      zIndex: "10",
      background: "transparent"
    });
    document.body.appendChild(iframe);
    addCloseCustomerButton();
    iframe.addEventListener("load", () => {
      loadingOverlay.remove();
    });
  }
}, true);

function removeAccountIframe() {
  const iframe = document.getElementById("accountDetailIframe");
  if (iframe) iframe.remove();
  const overlay = document.getElementById("accountLoadingOverlay");
  if (overlay) overlay.remove();
  removeCloseCustomerButton();
  removeTicketIframe();
}

document.addEventListener("click", (e) => {
  if (!inAppIframesOutsideTicket) return;
  let ticketRow;
  const inlineElem = e.target.closest("[onclick*='TicketDetail']");
  if (inlineElem) {
    ticketRow = inlineElem.closest("tr.Display[data-row-key]");
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
    const workspaceBg = "transparent";
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "ticketLoadingOverlay";
    Object.assign(loadingOverlay.style, {
      position: "fixed",
      left: "0",
      width: "100%",
      height: "100%",
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
      left: "0",
      width: "100%",
      height: "100%",
      border: "none",
      zIndex: "10",
      background: workspaceBg
    });
    document.body.appendChild(iframe);
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

document.addEventListener("click", (e) => {
  if (!inAppIframesOutsideTicket) return;
  const advancedRow = e.target.closest("div.o-data-row.o-data-row--is-clickable.o-data-row--compact");
  if (advancedRow) {
    const viewContainer = document.querySelector("div.c-page-layout__body__view");
    if (!viewContainer || !viewContainer.contains(advancedRow)) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    const rowTextFragments = Array.from(advancedRow.querySelectorAll("div.c-text"))
      .map(el => el.textContent.trim())
      .filter(text => text.length > 3 && !/[\/:]/.test(text));
    let ticketId = null;
    outerLoop:
    for (const payload of gridPayloads) {
      if (payload && Array.isArray(payload.data)) {
        for (const ticket of payload.data) {
          let combinedText = "";
          if (ticket.primaryData && Array.isArray(ticket.primaryData)) {
            ticket.primaryData.forEach(item => {
              if (item.text && item.text.value && item.text.value.value) {
                combinedText += item.text.value.value.toLowerCase() + " ";
              }
            });
          }
          if (ticket.additionalData && Array.isArray(ticket.additionalData)) {
            ticket.additionalData.forEach(item => {
              if (item.text && item.text.value && item.text.value.value) {
                combinedText += item.text.value.value.toLowerCase() + " ";
              }
            });
          }
          combinedText = combinedText.trim();
          const allMatch = rowTextFragments.every(fragment => combinedText.includes(fragment.toLowerCase()));
          if (allMatch && ticket.contextMenuKey && ticket.contextMenuKey.value) {
            ticketId = ticket.contextMenuKey.value;
            break outerLoop;
          }
        }
      }
    }
    if (!ticketId) {
      return;
    }
    currentTicketId = ticketId;
    const host = window.location.host;
    const ticketUrl = `https://${host}/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&mode=0&ticketId=${currentTicketId}`;
    removeTicketIframe();
    const bodyViewContainer = document.querySelector("div.c-page-layout__body__view");
    if (!bodyViewContainer) {
      return;
    }
    if (window.getComputedStyle(bodyViewContainer).position === "static") {
      bodyViewContainer.style.position = "relative";
    }
    const containerBg = window.getComputedStyle(bodyViewContainer).backgroundColor || "#fff";
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "ticketLoadingOverlay";
    Object.assign(loadingOverlay.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: containerBg,
      zIndex: "50",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    });
    loadingOverlay.innerHTML = `<div class="spinner"></div>`;
    bodyViewContainer.appendChild(loadingOverlay);
    if (!document.getElementById("spinnerStyle")) {
      const spinnerStyle = document.createElement("style");
      spinnerStyle.id = "spinnerStyle";
      spinnerStyle.textContent = `
        .spinner {
          border: 8px solid rgba(0, 0, 0, 0.1);
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(spinnerStyle);
    }
    const iframe = document.createElement("iframe");
    iframe.id = "ticketDetailIframe";
    iframe.src = ticketUrl;
    Object.assign(iframe.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      border: "none",
      zIndex: "10",
      background: containerBg
    });
    bodyViewContainer.appendChild(iframe);
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
    function autoCloseIframe() {
      removeTicketIframe();
    }
    window.addEventListener("popstate", autoCloseIframe);
    window.addEventListener("hashchange", autoCloseIframe);
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      autoCloseIframe();
      return origPushState.apply(history, args);
    };
    const origReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      autoCloseIframe();
      return origReplaceState.apply(history, args);
    };
    const containerObserver = new MutationObserver((mutations, obs) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE &&
              !node.matches("#ticketDetailIframe") &&
              !node.matches("#ticketLoadingOverlay")) {
              autoCloseIframe();
              obs.disconnect();
              return;
            }
          }
        }
      }
    });
    containerObserver.observe(bodyViewContainer, { childList: true, subtree: true });
  }
}, true);

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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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
    if (!inAppIframesInsideTicket) return;
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