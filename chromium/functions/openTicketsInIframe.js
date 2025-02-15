let currentTicketId = null;
let openTicketsInIframeEnabled = false;

chrome.storage.sync.get(['openTicketsInIframeEnabled'], (result) => {
    openTicketsInIframeEnabled = result.openTicketsInIframeEnabled || false;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleOpenTicketsInIframe') {
        openTicketsInIframeEnabled = message.enabled;
    }
});

function injectNavBarHighZIndexStyle() {
    let styleEl = document.getElementById("highZIndexNavBarStyle");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "highZIndexNavBarStyle";
        styleEl.textContent = `
      #SiteNavigationBar,
      #SiteNavigationBar * {
        z-index: 100000 !important;
        overflow: visible !important;
      }
    `;
        document.head.appendChild(styleEl);
    }
}

function removeNavBarHighZIndexStyle() {
    const styleEl = document.getElementById("highZIndexNavBarStyle");
    if (styleEl) styleEl.remove();
}

function removeTicketIframe() {
    const iframe = document.getElementById("ticketDetailIframe");
    if (iframe) iframe.remove();
    const loadingOverlay = document.getElementById("ticketLoadingOverlay");
    if (loadingOverlay) loadingOverlay.remove();
    removeNavBarHighZIndexStyle();
}

document.addEventListener(
    "click",
    (e) => {
        const navBar = document.getElementById("SiteNavigationBar");
        if (navBar && navBar.contains(e.target)) {
            if (e.target.closest(".AutotaskLogoImage")) {
                removeTicketIframe();
                return;
            }
            let inException = false;
            if (e.target.closest("#NewSiteNavigationButton")) {
                inException = true;
            } else if (e.target.closest(".SearchBoxContainer")) {
                if (!e.target.closest(".SearchButton")) {
                    inException = true;
                }
            } else {
                const anchor = e.target.closest("a");
                if (anchor && anchor.textContent.trim().toLowerCase().includes("dispatch calendar")) {
                    inException = true;
                }
            }
            const interactive = e.target.closest("a, button, .SiteNavigationButton, .Button, .SearchButton");
            if (inException || !interactive) {
                return;
            }
            removeTicketIframe();
            return;
        }

        if (!openTicketsInIframeEnabled) {
            return;
        }

        const ticketRow = e.target.closest('tr.Display[data-interactive="true"]');
        if (ticketRow) {
            e.preventDefault();
            e.stopImmediatePropagation();
            currentTicketId = ticketRow.getAttribute("data-row-key");
            if (!currentTicketId) return;
            const host = window.location.host;
            const ticketUrl = `https://${host}/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&mode=0&ticketId=${currentTicketId}`;

            const textEl = ticketRow.querySelector('.TextPartCell');
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
            const navBg = navBar ? window.getComputedStyle(navBar).backgroundColor : "#f3f3f3";
            injectNavBarHighZIndexStyle();
            const loadingOverlay = document.createElement("div");
            loadingOverlay.id = "ticketLoadingOverlay";
            Object.assign(loadingOverlay.style, {
                position: "fixed",
                top: navHeight + "px",
                left: "0",
                width: "100%",
                height: `calc(100% - ${navHeight}px)`,
                background: navBg,
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
                background: navBg
            });
            document.body.appendChild(iframe);
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
    },
    true
);

document.addEventListener("keydown", (e) => {
    const searchInput = document.querySelector(".SearchInput");
    if (searchInput && document.activeElement === searchInput && e.key === "Enter") {
        removeTicketIframe();
    }
});