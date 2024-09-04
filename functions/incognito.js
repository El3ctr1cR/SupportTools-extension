const urlMappings = {
  "https://portal.office.com": "https://admin.microsoft.com",
  "https://admin.microsoft.com": "https://admin.microsoft.com",
  "https://portal.azure.com": "https://portal.azure.com",
  "https://admin.google.com": "https://admin.google.com"
};

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.sync.get(['bypassIncognito'], (result) => {
    const bypassIncognito = result.bypassIncognito || false;

    if (bypassIncognito) return;

    chrome.tabs.get(details.tabId, (tab) => {
      if (tab.incognito) return;

      const url = new URL(details.url);
      const targetUrl = urlMappings[url.origin];

      if (targetUrl) {
        chrome.windows.create({
          url: targetUrl,
          incognito: true
        }, () => {
          chrome.tabs.remove(details.tabId);
        });
      }
    });
  });
}, {
  url: Object.keys(urlMappings).map(origin => ({ urlMatches: `${origin}/*` }))
});
