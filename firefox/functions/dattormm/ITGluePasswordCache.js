const LOG = (...a) => console.debug('[ITGlue Cache Bridge]', ...a);
const TTL_PW = 7 * 24 * 60 * 60 * 1000;

function getSiteUid() {
  return document.querySelector('#app')?.dataset?.siteUid ?? '';
}

async function cacheGet(key, ttlMs) {
  const result = await chrome.storage.local.get(key);
  const entry  = result[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) return null;
  return entry.value;
}

async function cacheSet(key, value) {
  await chrome.storage.local.set({ [key]: { value, timestamp: Date.now() } });
}

function orgStorageKey() {
  const uid = getSiteUid();
  return uid ? `itglue_org_${uid}` : null;
}

async function getStoredOrg() {
  const key = orgStorageKey();
  if (!key) return null;
  const stored = (await chrome.storage.local.get(key))[key];
  if (!stored?.orgId) return null;
  if (Date.now() - stored.timestamp > 30 * 24 * 60 * 60 * 1000) return null;
  return stored;
}

async function storeOrg(orgId) {
  const key = orgStorageKey();
  if (!key) return;
  await chrome.storage.local.set({ [key]: { orgId, timestamp: Date.now() } });
  LOG(`Stored org for site ${getSiteUid()}: ${orgId}`);
}

async function broadcastSettings() {
  const { itgluePasswordCache_enabled: enabled = false } =
    await chrome.storage.local.get('itgluePasswordCache_enabled');
  window.postMessage({ type: '__ITGLUE_SETTINGS_SYNC__', enabled }, '*');
}

broadcastSettings();

const PLACEHOLDER_TITLE = 'Datto RMM';

const titleReady = new Promise((resolve) => {
  const check = () => {
    const t = document.title.trim();
    if (t && t !== PLACEHOLDER_TITLE) {
      LOG(`Title resolved: "${t}"`);
      resolve(t);
      return true;
    }
    return false;
  };

  if (check()) return;

  const observer = new MutationObserver(() => {
    if (check()) observer.disconnect();
  });
  observer.observe(document.documentElement, {
    subtree: true, characterData: true, childList: true,
  });

  setTimeout(() => {
    observer.disconnect();
    const t = document.title.trim();
    LOG(`Title fallback: "${t}"`);
    resolve(t);
  }, 30_000);
});

window.addEventListener('message', async (event) => {
  if (event.source !== window) return;
  const msg = event.data;
  if (!msg?.type) return;

  if (msg.type === '__ITGLUE_GET_SETTINGS__') {
    await broadcastSettings();
    return;
  }

  if (msg.type === '__ITGLUE_CACHE_GET__') {
    const value = await cacheGet(msg.key, msg.ttl ?? 3_600_000);
    window.postMessage({ type: '__ITGLUE_BRIDGE_REPLY__', msgId: msg.msgId, value }, '*');
    return;
  }

  if (msg.type === '__ITGLUE_CACHE_SET__') {
    await cacheSet(msg.key, msg.value);
    return;
  }

  if (msg.type === '__ITGLUE_LAST_ORG_GET__') {
    const stored = await getStoredOrg();
    window.postMessage({ type: '__ITGLUE_BRIDGE_REPLY__', msgId: msg.msgId, value: stored ?? null }, '*');
    return;
  }

  if (msg.type === '__ITGLUE_TOKEN_CAPTURED__') {
    await chrome.storage.local.set({
      itglue_token: {
        accessToken:   msg.accessToken,
        apiServiceURL: msg.apiServiceURL,
        timestamp:     Date.now(),
      },
    });
    LOG('Token stored, waiting for real device title…');
    tryEarlyPrefetch();
    return;
  }

  if (msg.type === '__ITGLUE_CONFIG_CAPTURED__') {
    const orgId = String(msg.configData?.data?.[0]?.attributes?.['organization-id'] ?? '');
    if (!orgId) { LOG('Could not extract orgId from config'); return; }

    await storeOrg(orgId);

    const resourceName = await titleReady;
    fireDirectPrefetch(orgId, resourceName);
    return;
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'toggleItgluePasswordCache') {
    broadcastSettings();
  }
});

async function tryEarlyPrefetch() {
  const { itgluePasswordCache_enabled: enabled = false } =
    await chrome.storage.local.get('itgluePasswordCache_enabled');
  if (!enabled) return;

  const stored = await getStoredOrg();
  if (!stored?.orgId) {
    LOG('No stored orgId for this site yet — will pre-fetch after config on first visit');
    return;
  }

  const resourceName = await titleReady;
  LOG(`Early pre-fetch: org=${stored.orgId}, device=${resourceName}`);
  fireDirectPrefetch(stored.orgId, resourceName);
}

async function fireDirectPrefetch(orgId, resourceName) {
  if (!orgId || !resourceName) return;

  const { itgluePasswordCache_enabled: enabled = false } =
    await chrome.storage.local.get('itgluePasswordCache_enabled');
  if (!enabled) return;

  const tokenEntry = (await chrome.storage.local.get('itglue_token')).itglue_token;
  if (!tokenEntry) { LOG('No token for pre-fetch'); return; }
  if (Date.now() - tokenEntry.timestamp > 20 * 60 * 1000) { LOG('Token too old'); return; }

  const base       = tokenEntry.apiServiceURL.replace(/\/+$/, '');
  const pathSuffix = `/organizations/${orgId}/relationships/passwords`;
  const headers    = { Authorization: `Bearer ${tokenEntry.accessToken}`, Accept: '*/*' };

  LOG(`Background revalidating: org=${orgId}, device=${resourceName}`);

  Promise.all([
    fetch(`${base}${pathSuffix}?sort=name&filter[cached_resource_name]=${encodeURIComponent(resourceName)}`, { headers })
      .then(r => r.json())
      .then(data => cacheSet(`pw_device_${orgId}_${resourceName}`, data))
      .then(() => LOG(`Revalidated pw_device_${orgId}_${resourceName}`)),
    fetch(`${base}${pathSuffix}?sort=name`, { headers })
      .then(r => r.json())
      .then(data => cacheSet(`pw_org_${orgId}`, data))
      .then(() => LOG(`Revalidated pw_org_${orgId}`)),
  ]).catch(err => LOG('Pre-fetch error:', err));
}

LOG('Password cache bridge loaded');