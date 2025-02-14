chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.sync.get(['incognitoRedirection', 'urlMappings'], (result) => {
    const incognitoRedirection = result.incognitoRedirection || false;
    const urlMappings = result.urlMappings || {};

    if (!incognitoRedirection) return;

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
          // If sourceValue isn't a valid URL, leave it as-is.
        }
        sourceHost = sourceHost.replace(/^www\./i, '');

        if (currentHost === sourceHost) {
          const finalUrl = (targetValue?.trim() || details.url);

          // Helper to create a private window using the proper API.
          const createPrivateWindow = (options) => {
            return new Promise((resolve, reject) => {
              if (typeof browser !== 'undefined' && browser.windows && browser.windows.create) {
                // Firefox (and other browsers that support the Promise API)
                browser.windows.create(options).then(resolve, reject);
              } else {
                // Chrome: callback-based API
                chrome.windows.create(options, resolve);
              }
            });
          };

          createPrivateWindow({ url: finalUrl, incognito: true })
            .then((newWindow) => {
              chrome.tabs.remove(details.tabId);
            })
            .catch((error) => {
              console.error('Failed to create private window:', error);
            });
          break;
        }
      }
    });
  });
});
