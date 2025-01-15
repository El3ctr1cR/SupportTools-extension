chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.sync.get(['bypassIncognito', 'urlMappings'], (result) => {
    const bypassIncognito = result.bypassIncognito || false;
    const urlMappings = result.urlMappings || {};

    if (!bypassIncognito) return;

    chrome.tabs.get(details.tabId, (tab) => {
      if (tab.incognito) return;

      const currentUrl = new URL(details.url);
      const currentHost = currentUrl.hostname.replace(/^www\./i, '');

      for (const [sourceValue, targetValue] of Object.entries(urlMappings)) {
        let sourceHost = sourceValue;
        try {
          const parsed = new URL(sourceValue);
          sourceHost = parsed.hostname;
        } catch (err) {
        }
        sourceHost = sourceHost.replace(/^www\./i, '');

        if (currentHost === sourceHost) {
          const finalUrl = targetValue?.trim() || details.url;
          chrome.windows.create({ url: finalUrl, incognito: true }, () => {
            chrome.tabs.remove(details.tabId);
          });
          break;
        }
      }
    });
  });
});
