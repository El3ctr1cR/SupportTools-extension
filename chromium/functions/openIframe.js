let currentTicketId = null;
let openTicketsInIframeEnabled = false;
let openServiceCallIframeEnabled = false;

chrome.storage.sync.get(['openTicketsInIframeEnabled'], (result) => {
  openTicketsInIframeEnabled = result.openTicketsInIframeEnabled || false;
  console.log('[Storage] openTicketsInIframeEnabled:', openTicketsInIframeEnabled);
});
chrome.storage.sync.get(['openServiceCallIframeEnabled'], (result) => {
  openServiceCallIframeEnabled = result.openServiceCallIframeEnabled || false;
  console.log('[Storage] openServiceCallIframeEnabled:', openServiceCallIframeEnabled);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Message]', message);
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
    styleEl.textContent = `
      #SiteNavigationBar, #SiteNavigationBar * {
        z-index: 100000 !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(styleEl);
    console.log('[injectNavBarHighZIndexStyle] Injected style.');
  }
}

function removeNavBarHighZIndexStyle() {
  const styleEl = document.getElementById("highZIndexNavBarStyle");
  if (styleEl) {
    styleEl.remove();
    console.log('[removeNavBarHighZIndexStyle] Removed style.');
  }
}

function removeTicketIframe() {
  const iframe = document.getElementById("ticketDetailIframe");
  if (iframe) iframe.remove();
  const loadingOverlay = document.getElementById("ticketLoadingOverlay");
  if (loadingOverlay) loadingOverlay.remove();
  removeNavBarHighZIndexStyle();
  console.log('[removeTicketIframe] Removed ticket iframe and overlay.');
}

document.addEventListener("click", (e) => {
  const navBar = document.getElementById("SiteNavigationBar");
  if (navBar && navBar.contains(e.target)) {
    if (e.target.closest(".AutotaskLogoImage")) {
      console.log('[Click] AutotaskLogoImage clicked. Removing ticket iframe.');
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
    console.log('[TicketRow] currentTicketId:', currentTicketId);
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
      console.log('[TicketRow] Updated ticketHistory.');
    });
    removeTicketIframe();
    const navHeight = navBar ? navBar.offsetHeight : 0;
    const workspaceContainer = document.querySelector("#WorkspaceContainer");
    const workspaceBg = workspaceContainer
      ? window.getComputedStyle(workspaceContainer).backgroundColor
      : "#111b22";
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
    iframe.addEventListener("load", () => {
      console.log('[TicketDetailIframe] Loaded.');
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
            console.log('[TicketDetailIframe] Updated ticketHistory.');
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

// --- Toolbar handler for iframes (Save & Close / Cancel/Close) ---
function attachToolbarButtonHandlers(container, iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const buttons = doc.querySelectorAll('div.Button2.ButtonIcon2.NormalBackground');
    console.log('[attachToolbarButtonHandlers] Found buttons:', buttons.length);
    buttons.forEach(btn => {
      const textElem = btn.querySelector('.Text2');
      if (!textElem) return;
      const btnText = textElem.textContent.trim();
      console.log('[attachToolbarButtonHandlers] Button text:', btnText);
      if (btnText === 'Save & Close') {
        btn.addEventListener('click', function (e) {
          console.log('[attachToolbarButtonHandlers] Save & Close clicked.');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          iframe.addEventListener('load', function handler() {
            console.log('[attachToolbarButtonHandlers] Iframe reloaded after Save & Close.');
            container.remove();
            iframe.removeEventListener('load', handler);
          });
        }, true);
      } else if (btnText === 'Cancel' || btnText === 'Close') {
        btn.addEventListener('click', function (e) {
          console.log('[attachToolbarButtonHandlers] Cancel/Close clicked.');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          container.remove();
        }, true);
      }
    });
  } catch (err) {
    console.error('[attachToolbarButtonHandlers] Error:', err);
  }
}

// --- Specialized handler for the Forward iframe toolbar (anchor-based) ---
function attachForwardToolbarHandlers(container, iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const anchors = doc.querySelectorAll('a.ImgLink');
    console.log('[attachForwardToolbarHandlers] Found anchors:', anchors.length);
    anchors.forEach(anchor => {
      const title = anchor.getAttribute('title');
      console.log('[attachForwardToolbarHandlers] Anchor title:', title);
      if (title && title.toLowerCase() === 'save & close') {
        anchor.addEventListener('click', function (e) {
          console.log('[attachForwardToolbarHandlers] Save & Close anchor clicked.');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          iframe.addEventListener('load', function handler() {
            console.log('[attachForwardToolbarHandlers] Iframe reloaded after Save & Close.');
            container.remove();
            iframe.removeEventListener('load', handler);
          });
        }, true);
      } else if (title && title.toLowerCase() === 'cancel') {
        anchor.addEventListener('click', function (e) {
          console.log('[attachForwardToolbarHandlers] Cancel anchor clicked.');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          container.remove();
        }, true);
      }
    });
  } catch (err) {
    console.error('[attachForwardToolbarHandlers] Error:', err);
  }
}

// --- Ticket History toolbar handler (for the single Close button) ---
function attachTicketHistoryToolbarHandler(container, iframe) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const btn = Array.from(doc.querySelectorAll('div.Button2.ButtonIcon2.NormalBackground'))
      .find(el => el.textContent.trim().toLowerCase() === 'close');
    console.log('[attachTicketHistoryToolbarHandler] Found Close button:', btn);
    if (btn) {
      btn.addEventListener('click', function (e) {
        console.log('[attachTicketHistoryToolbarHandler] Close clicked.');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        container.remove();
      }, true);
    }
  } catch (err) {
    console.error('[attachTicketHistoryToolbarHandler] Error:', err);
  }
}

// --- Extract ticket ID from page scripts ---
function extractTicketId() {
  const scripts = document.getElementsByTagName('script');
  const regex = /autotask\.bookmarkManagement\.__toggleBookmark\('TicketDetail',\s*(\d+)\)/;
  for (let script of scripts) {
    if (script.textContent) {
      const match = script.textContent.match(regex);
      if (match && match[1]) {
        console.log('[extractTicketId] Found ticketId:', match[1]);
        return match[1];
      }
    }
  }
  console.log('[extractTicketId] No ticketId found.');
  return null;
}

(function () {
  // --- Iframe open functions ---
  function openServiceCallIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('service-call-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/Autotask/views/ServiceDesk/ServiceDeskTicket/service_ticket_panel_edit.aspx?ticketRenderType=ServiceCall&action=3&ticketID=${ticketId}`;
    console.log('[openServiceCallIframe] Opening Service Call iframe with URL:', url);
    const container = document.createElement('div');
    container.id = 'service-call-iframe-container';
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
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close Service Call';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: '10000'
    });
    closeButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      container.remove();
      console.log('[openServiceCallIframe] Service Call iframe closed manually.');
    });
    container.appendChild(closeButton);
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
      console.log('[openServiceCallIframe] Iframe loaded.');
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (pendingClose) {
          container.remove();
          console.log('[openServiceCallIframe] Container removed due to pendingClose.');
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
              console.log('[openServiceCallIframe] Button', config.id, 'clicked.');
              if (config.immediate) {
                container.remove();
              } else {
                pendingClose = true;
              }
            }, true);
          }
        });
        attachToolbarButtonHandlers(container, iframe);
      } catch (err) {
        console.error('[openServiceCallIframe] Error:', err);
      }
    });
    iframe.src = url;
  }

  function openNewAttachmentIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('new-attachment-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/Mvc/File/Attachment.mvc/TicketAttachment?enablePublishing=True&ticketId=${ticketId}`;
    console.log('[openNewAttachmentIframe] Opening New Attachment iframe with URL:', url);
    const container = document.createElement('div');
    container.id = 'new-attachment-iframe-container';
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
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close Attachment';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: '10000'
    });
    closeButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      container.remove();
      console.log('[openNewAttachmentIframe] Attachment iframe closed manually.');
    });
    container.appendChild(closeButton);
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    iframe.addEventListener('load', function () {
      console.log('[openNewAttachmentIframe] Iframe loaded.');
      attachToolbarButtonHandlers(container, iframe);
    });
    iframe.src = url;
  }

  function openForwardIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('forward-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/ServiceDesk/Popups/Forward/svcForward.asp?forward=1&taskIDs=${ticketId}`;
    console.log('[openForwardIframe] Opening Forward iframe with URL:', url);
    const container = document.createElement('div');
    container.id = 'forward-iframe-container';
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
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close Forward';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: '10000'
    });
    closeButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      container.remove();
      console.log('[openForwardIframe] Forward iframe closed manually.');
    });
    container.appendChild(closeButton);
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    iframe.addEventListener('load', function () {
      console.log('[openForwardIframe] Iframe loaded.');
      attachForwardToolbarHandlers(container, iframe);
    });
    iframe.src = url;
  }

  function openTicketHistoryIframe(ticketId) {
    if (!openServiceCallIframeEnabled) return;
    if (document.getElementById('ticket-history-iframe-container')) return;
    const host = window.location.host;
    const url = `https://${host}/Mvc/ServiceDesk/TicketHistory.mvc/ServiceTicketHistory?ticketId=${ticketId}`;
    console.log('[openTicketHistoryIframe] Opening Ticket History iframe with URL:', url);
    const container = document.createElement('div');
    container.id = 'ticket-history-iframe-container';
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
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close History';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: '10000'
    });
    closeButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      container.remove();
      console.log('[openTicketHistoryIframe] Ticket History iframe closed manually.');
    });
    container.appendChild(closeButton);
    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none'
    });
    container.appendChild(iframe);
    document.body.appendChild(container);
    iframe.addEventListener('load', function () {
      console.log('[openTicketHistoryIframe] Iframe loaded.');
      attachTicketHistoryToolbarHandler(container, iframe);
    });
    iframe.src = url;
  }

  function replaceServiceCallButtons() {
    if (!openServiceCallIframeEnabled) return;
    const buttons = document.querySelectorAll('.QuickLaunchButton.ServiceCall');
    buttons.forEach((originalBtn) => {
      if (originalBtn.dataset.replacedByExtension) return;
      originalBtn.dataset.replacedByExtension = "true";
      const newBtn = originalBtn.cloneNode(true);
      newBtn.removeAttribute('onclick');
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const ticketId = extractTicketId();
        console.log('[replaceServiceCallButtons] TicketId:', ticketId);
        if (ticketId) {
          openServiceCallIframe(ticketId);
        }
      });
      originalBtn.parentNode.replaceChild(newBtn, originalBtn);
      console.log('[replaceServiceCallButtons] Replaced a Service Call button.');
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
        const newBtn = btn.cloneNode(true);
        newBtn.removeAttribute('onclick');
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          let ticketId = currentTicketId || new URLSearchParams(window.location.search).get("ticketId");
          console.log('[replaceNewAttachmentButtons] TicketId:', ticketId);
          if (ticketId) {
            openNewAttachmentIframe(ticketId);
          }
        });
        btn.parentNode.replaceChild(newBtn, btn);
        console.log('[replaceNewAttachmentButtons] Replaced a New Attachment button.');
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
          const newBtn = btn.cloneNode(true);
          newBtn.removeAttribute('onclick');
          newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('[replaceForwardButton] Forward button clicked.');
            if (currentTicketId) {
              openForwardIframe(currentTicketId);
            } else {
              console.log('[replaceForwardButton] No currentTicketId.');
            }
          });
          btn.parentNode.replaceChild(newBtn, btn);
          console.log('[replaceForwardButton] Replaced a Forward button.');
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
      const newBtn = btn.cloneNode(true);
      newBtn.removeAttribute('onclick');
      newBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('[replaceTicketHistoryButton] Ticket History button clicked.');
        if (currentTicketId) {
          openTicketHistoryIframe(currentTicketId);
        } else {
          console.log('[replaceTicketHistoryButton] No currentTicketId.');
        }
      });
      btn.parentNode.replaceChild(newBtn, btn);
      console.log('[replaceTicketHistoryButton] Replaced a Ticket History button.');
    }
  }

  const observer = new MutationObserver(() => {
    replaceServiceCallButtons();
    replaceNewAttachmentButtons();
    replaceForwardButton();
    replaceTicketHistoryButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  replaceServiceCallButtons();
  replaceNewAttachmentButtons();
  replaceForwardButton();
  replaceTicketHistoryButton();

  // --- Capturing event listeners as backup ---
  document.addEventListener('click', function (e) {
    if (!openServiceCallIframeEnabled) return;
    const forwardEl = e.target.closest('div.Button2.ButtonIcon2.NormalBackground');
    if (forwardEl && forwardEl.querySelector('.StandardButtonIcon.Forward')) {
      const txt = forwardEl.querySelector('.Text2');
      if (txt && txt.textContent.trim().toLowerCase().includes('forward')) {
        console.log('[Capturing] Forward element clicked:', forwardEl);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (!currentTicketId) {
          currentTicketId = extractTicketId();
        }
        if (currentTicketId) {
          openForwardIframe(currentTicketId);
        } else {
          console.log('[Capturing] Still no currentTicketId for Forward.');
        }
      }
    }
  }, true);

  document.addEventListener('click', function (e) {
    if (!openServiceCallIframeEnabled) return;
    const historyEl = e.target.closest('a.Button.ButtonIcon.ViewHistory.Navigation.NormalState');
    if (historyEl && historyEl.textContent.trim().toLowerCase().includes('ticket history')) {
      console.log('[Capturing] Ticket History element clicked:', historyEl);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!currentTicketId) {
        currentTicketId = extractTicketId();
      }
      if (currentTicketId) {
        openTicketHistoryIframe(currentTicketId);
      } else {
        console.log('[Capturing] Still no currentTicketId for Ticket History.');
      }
    }
  }, true);

  function keydownHandler(e) {
    if (!openServiceCallIframeEnabled) return;
    if (e.altKey && e.key === '6') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const ticketId = extractTicketId();
      console.log('[keydownHandler] ALT+6 pressed, ticketId:', ticketId);
      if (ticketId) {
        openServiceCallIframe(ticketId);
      }
      return false;
    }
    if (e.altKey && e.key === '3') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      let ticketId = currentTicketId || new URLSearchParams(window.location.search).get("ticketId");
      console.log('[keydownHandler] ALT+3 pressed, ticketId:', ticketId);
      if (ticketId) {
        openNewAttachmentIframe(ticketId);
      }
      return false;
    }
  }

  document.addEventListener('keydown', keydownHandler, true);
})();
