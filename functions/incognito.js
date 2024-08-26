let isTabHandled = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    if (isTabHandled[tabId]) return;

    chrome.windows.get(tab.windowId, (window) => {
      if (window.incognito) return;

      chrome.storage.sync.get(['bypassIncognito'], (result) => {
        const bypassIncognito = result.bypassIncognito || false;

        if (!bypassIncognito) {
          const url = new URL(tab.url);
          const hostname = url.hostname;

          if (hostname.includes('portal.office.com') || hostname.includes('microsoft365.com')) {
            const newUrl = tab.url.replace(hostname, 'admin.microsoft.com');
            chrome.tabs.update(tabId, { url: newUrl });
          } else if (hostname.includes('admin.microsoft.com') || hostname.includes('portal.azure.com')) {
            isTabHandled[tabId] = true;

            chrome.windows.create({
              url: tab.url,
              incognito: true
            }, () => {
              chrome.tabs.remove(tabId, () => {
                delete isTabHandled[tabId];
              });
            });
          }
        }
      });
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete isTabHandled[tabId];
});
