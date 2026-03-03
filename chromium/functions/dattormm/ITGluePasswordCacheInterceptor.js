(function () {
  const LOG = (...a) => console.debug('[ITGlue Cache]', ...a);
  const TTL_CONFIG = 7 * 24 * 60 * 60 * 1000;
  const TTL_PW     = 7 * 24 * 60 * 60 * 1000;

  let _enabled = false;

  window.postMessage({ type: '__ITGLUE_GET_SETTINGS__' }, '*');

  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data?.type === '__ITGLUE_SETTINGS_SYNC__') {
      _enabled = !!event.data.enabled;
      LOG(`enabled=${_enabled}`);
    }
  });

  function bridgeRequest(payload, timeoutMs = 300) {
    return new Promise((resolve) => {
      const msgId = `${Date.now()}-${Math.random()}`;
      const handler = (event) => {
        if (
          event.source === window &&
          event.data?.type === '__ITGLUE_BRIDGE_REPLY__' &&
          event.data.msgId === msgId
        ) {
          window.removeEventListener('message', handler);
          resolve(event.data.value ?? null);
        }
      };
      window.addEventListener('message', handler);
      window.postMessage({ ...payload, msgId }, '*');
      setTimeout(() => {
        window.removeEventListener('message', handler);
        resolve(null);
      }, timeoutMs);
    });
  }

  function buildSyntheticConfig(orgId, deviceName) {
    const orgName = document.querySelector('#app')?.dataset?.siteName ?? '';
    return {
      data: [{
        id: 'cached',
        type: 'configurations',
        attributes: {
          'organization-id':   Number(orgId),
          'organization-name': orgName,
          'name':              deviceName,
        },
        relationships: {},
      }],
      meta: { 'current-page': 1, 'next-page': null, 'prev-page': null,
              'total-pages': 1, 'total-count': 1, filters: {} },
    };
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (...args) {
    const url = getUrlString(args[0]);

    if (url.includes('/api/itglue/accessToken')) {
      const response = await originalFetch(...args);
      response.clone().json().then((data) => {
        if (Array.isArray(data) && data[1]?.AccessToken) {
          window.postMessage({
            type:          '__ITGLUE_TOKEN_CAPTURED__',
            accessToken:   data[1].AccessToken,
            apiServiceURL: data[1].APIServiceURL,
          }, '*');
          LOG('Access token captured');
        }
      }).catch(() => {});
      return response;
    }

    if (!_enabled) return originalFetch(...args);

    if (url.includes('/api/configurations') && url.includes('rmm_id')) {
      let rmmId;
      try { rmmId = new URL(url).searchParams.get('filter[rmm_id]'); } catch (_) {}

      if (rmmId) {
        const cacheKey = `config_${rmmId}`;

        const cached = await bridgeRequest({ type: '__ITGLUE_CACHE_GET__', key: cacheKey, ttl: TTL_CONFIG });
        if (cached) {
          LOG(`Config cache HIT rmmId=${rmmId}`);
          originalFetch(...args).then(r => r.clone().json()).then(fresh => {
            window.postMessage({ type: '__ITGLUE_CACHE_SET__', key: cacheKey, value: fresh }, '*');
            window.postMessage({ type: '__ITGLUE_CONFIG_CAPTURED__', rmmId, configData: fresh }, '*');
          }).catch(() => {});
          return new Response(JSON.stringify(cached), {
            status: 200, headers: { 'Content-Type': 'application/json' },
          });
        }

        const lastOrg = await bridgeRequest({ type: '__ITGLUE_LAST_ORG_GET__' });

        if (lastOrg?.orgId) {
          const deviceName = document.title.trim();
          LOG(`Config cache MISS but org known — returning synthetic config org=${lastOrg.orgId} device=${deviceName}`);

          const synthetic = buildSyntheticConfig(lastOrg.orgId, deviceName);

          window.postMessage({ type: '__ITGLUE_CONFIG_CAPTURED__', rmmId, configData: synthetic }, '*');

          originalFetch(...args).then(r => r.clone().json()).then(fresh => {
            window.postMessage({ type: '__ITGLUE_CACHE_SET__', key: cacheKey, value: fresh }, '*');
            window.postMessage({ type: '__ITGLUE_CONFIG_CAPTURED__', rmmId, configData: fresh }, '*');
          }).catch(() => {});

          return new Response(JSON.stringify(synthetic), {
            status: 200, headers: { 'Content-Type': 'application/json' },
          });
        }

        LOG(`Config cache MISS rmmId=${rmmId} (first visit)`);
        const response = await originalFetch(...args);
        response.clone().json().then((data) => {
          window.postMessage({ type: '__ITGLUE_CACHE_SET__', key: cacheKey, value: data }, '*');
          window.postMessage({ type: '__ITGLUE_CONFIG_CAPTURED__', rmmId, configData: data }, '*');
        }).catch(() => {});
        return response;
      }
    }

    if (url.includes('/relationships/passwords')) {
      let parsedUrl;
      try { parsedUrl = new URL(url); } catch (_) { return originalFetch(...args); }

      const orgIdMatch = parsedUrl.pathname.match(/\/organizations\/(\d+)\/relationships\/passwords/);
      if (!orgIdMatch) return originalFetch(...args);

      const orgId        = orgIdMatch[1];
      const isFiltered   = parsedUrl.searchParams.has('filter[cached_resource_name]');
      const resourceName = document.title.trim();

      const cacheKey = isFiltered
        ? `pw_device_${orgId}_${resourceName}`
        : `pw_org_${orgId}`;

      const cached = await bridgeRequest({ type: '__ITGLUE_CACHE_GET__', key: cacheKey, ttl: TTL_PW });
      if (cached) {
        LOG(`Password cache HIT ${cacheKey} — refreshing in background`);
        originalFetch(...args).then(r => r.clone().json()).then(data => {
          window.postMessage({ type: '__ITGLUE_CACHE_SET__', key: cacheKey, value: data }, '*');
        }).catch(() => {});
        return new Response(JSON.stringify(cached), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }

      LOG(`Password cache MISS ${cacheKey}`);
      const response = await originalFetch(...args);
      response.clone().json().then(data => {
        window.postMessage({ type: '__ITGLUE_CACHE_SET__', key: cacheKey, value: data }, '*');
      }).catch(() => {});
      return response;
    }

    return originalFetch(...args);
  };

  function getUrlString(input) {
    if (typeof input === 'string') return input;
    if (input instanceof Request) return input.url;
    if (input instanceof URL)     return input.toString();
    return '';
  }

  LOG('Fetch interceptor installed');
})();