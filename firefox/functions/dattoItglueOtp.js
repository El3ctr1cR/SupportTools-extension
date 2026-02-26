/**
 * dattoItglueOtp.js
 *
 * Runs in the default ISOLATED content-script world on Datto RMM pages.
 * Relies on dattoItglueOtpInterceptor.js (MAIN world) for token + password data.
 */

(function () {
  'use strict';

  let itglueToken   = null;
  let itglueBaseUrl = null;
  const passwordMap = {};
  let featureEnabled = false;

  window.addEventListener('message', (event) => {
    if (!event.data || !event.data.__itglueOtp || event.source !== window) return;

    if (event.data.type === 'TOKEN') {
      itglueToken   = event.data.token;
      itglueBaseUrl = event.data.baseUrl;
    }

    if (event.data.type === 'PASSWORDS') {
      event.data.passwords.forEach(pw => {
        const attrs = pw.attributes || {};
        const name  = (attrs.name || '').trim();
        if (!name) return;
        passwordMap[name] = {
          id:         pw.id,
          otpEnabled: attrs['otp-enabled'] === true
        };
      });
      if (featureEnabled) addOtpButtons();
    }
  });

  const OTP_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="width:22px;height:22px;display:block;pointer-events:none;stroke:currentColor">
    <circle cx="12" cy="12" r="6.375" stroke-width="1.25"></circle>
    <path d="M10.4351 12.1396V12.3081C10.4351 12.5783 10.3984 12.8208 10.3252 13.0356C10.252 13.2505 10.1486 13.4336 10.0151 13.585C9.88167 13.7347 9.72217 13.8494 9.53662 13.9292C9.3527 14.009 9.14844 14.0488 8.92383 14.0488C8.70085 14.0488 8.49658 14.009 8.31104 13.9292C8.12712 13.8494 7.96761 13.7347 7.83252 13.585C7.69743 13.4336 7.59245 13.2505 7.51758 13.0356C7.44434 12.8208 7.40771 12.5783 7.40771 12.3081V12.1396C7.40771 11.8678 7.44434 11.6253 7.51758 11.4121C7.59082 11.1973 7.69417 11.0142 7.82764 10.8628C7.96273 10.7114 8.12223 10.5959 8.30615 10.5161C8.4917 10.4364 8.69596 10.3965 8.91895 10.3965C9.14355 10.3965 9.34782 10.4364 9.53174 10.5161C9.71729 10.5959 9.87679 10.7114 10.0103 10.8628C10.1453 11.0142 10.2495 11.1973 10.3228 11.4121C10.3976 11.6253 10.4351 11.8678 10.4351 12.1396ZM9.69531 12.3081V12.1348C9.69531 11.946 9.67822 11.7799 9.64404 11.6367C9.60986 11.4935 9.55941 11.373 9.49268 11.2754C9.42594 11.1777 9.34456 11.1045 9.24854 11.0557C9.15251 11.0052 9.04264 10.98 8.91895 10.98C8.79525 10.98 8.68538 11.0052 8.58936 11.0557C8.49495 11.1045 8.41439 11.1777 8.34766 11.2754C8.28255 11.373 8.23291 11.4935 8.19873 11.6367C8.16455 11.7799 8.14746 11.946 8.14746 12.1348V12.3081C8.14746 12.4953 8.16455 12.6613 8.19873 12.8062C8.23291 12.9494 8.28337 13.0706 8.3501 13.1699C8.41683 13.2676 8.49821 13.3416 8.59424 13.3921C8.69027 13.4425 8.80013 13.4678 8.92383 13.4678C9.04753 13.4678 9.15739 13.4425 9.25342 13.3921C9.34945 13.3416 9.43001 13.2676 9.49512 13.1699C9.56022 13.0706 9.60986 12.9494 9.64404 12.8062C9.67822 12.6613 9.69531 12.4953 9.69531 12.3081ZM12.3857 10.4453V14H11.6558V10.4453H12.3857ZM13.4795 10.4453V11.019H10.5791V10.4453H13.4795ZM15.2812 12.7329H14.3755V12.1616H15.2812C15.4212 12.1616 15.5352 12.1388 15.623 12.0933C15.7109 12.0461 15.7752 11.981 15.8159 11.8979C15.8566 11.8149 15.877 11.7214 15.877 11.6172C15.877 11.5114 15.8566 11.4129 15.8159 11.3218C15.7752 11.2306 15.7109 11.1574 15.623 11.1021C15.5352 11.0467 15.4212 11.019 15.2812 11.019H14.6294V14H13.897V10.4453H15.2812C15.5596 10.4453 15.798 10.4958 15.9966 10.5967C16.1968 10.696 16.3498 10.8335 16.4556 11.0093C16.5614 11.1851 16.6143 11.3861 16.6143 11.6123C16.6143 11.8418 16.5614 12.0404 16.4556 12.208C16.3498 12.3757 16.1968 12.505 15.9966 12.5962C15.798 12.6873 15.5596 12.7329 15.2812 12.7329Z" fill="currentColor"></path>
  </svg>`;

  function addOtpButtons() {

    document.querySelectorAll('.itglue-otp-btn').forEach(btn => {
      const td   = btn.closest('td.click-column');
      const tr   = btn.closest('tr');
      const nameSpan = tr ? tr.querySelector('span.name') : null;
      const name     = nameSpan ? nameSpan.textContent.trim() : null;
      const entry    = name ? passwordMap[name] : null;

      if (!entry || !entry.otpEnabled || btn.dataset.otpForId !== entry.id) {
        btn.remove();
        if (td) delete td.dataset.itglueOtpId;
      }
    });

    document.querySelectorAll('span.name').forEach(span => {
      const name  = span.textContent.trim();
      const entry = passwordMap[name];
      if (!entry || !entry.otpEnabled) return;

      const row     = span.closest('tr');
      if (!row) return;
      const clickTd = row.querySelector('td.click-column');
      if (!clickTd) return;

      if (clickTd.dataset.itglueOtpId === entry.id) return;

      clickTd.dataset.itglueOtpId = entry.id;

      clickTd.querySelector('.itglue-otp-btn')?.remove();

      const btn = document.createElement('span');
      btn.className       = 'itglue-otp-btn';
      btn.dataset.otpForId = entry.id;
      btn.title           = 'Type OTP into remote session';
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.setAttribute('aria-label', `Type OTP for ${name}`);
      btn.innerHTML = OTP_ICON_SVG;

      Object.assign(btn.style, {
        display:       'inline-flex',
        alignItems:    'center',
        verticalAlign: 'middle',
        cursor:        'pointer',
        opacity:       '0.6',
        color:         'inherit',
        flexShrink:    '0',
        marginRight:   '4px',
        borderRadius:  '3px',
        padding:       '1px',
        transition:    'opacity .15s, transform .15s',
        lineHeight:    '1'
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.opacity   = '1';
        btn.style.transform = 'scale(1.15)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.opacity   = '0.6';
        btn.style.transform = 'scale(1)';
      });

      btn.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        handleOtpClick(entry.id, name, btn);
      });

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOtpClick(entry.id, name, btn);
        }
      });

      clickTd.prepend(btn);
    });
  }

  async function handleOtpClick(passwordId, passwordName, btn) {
    if (!itglueToken || !itglueBaseUrl) {
      showToast('ITGlue session not detected yet.\nOpen the passwords panel on the device page first.', true);
      return;
    }

    btn.style.opacity       = '0.25';
    btn.style.pointerEvents = 'none';

    try {
      const response = await fetch(
        `${itglueBaseUrl}/api/passwords/${passwordId}/otp`,
        {
          method:  'GET',
          headers: { 'Authorization': itglueToken, 'Accept': '*/*' }
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);

      const body    = await response.json();
      const attrs   = body?.data?.attributes || {};
      const otpCode = attrs['otp-value'];
      const expiresAt = attrs['otp-expires-at'];

      if (!otpCode) {
        throw new Error('otp-value not found in response:\n' + JSON.stringify(body, null, 2));
      }

      typeString(String(otpCode));

    } catch (err) {
      console.error('[ITGlue OTP]', err);
      showToast(`Failed to get OTP:\n${err.message}`, true);
    } finally {
      btn.style.opacity       = '0.6';
      btn.style.pointerEvents = '';
    }
  }

  function typeString(str) {
    for (const char of str) {
      const shared = {
        key:        char,
        code:       `Digit${char}`,
        keyCode:    char.charCodeAt(0),
        charCode:   char.charCodeAt(0),
        which:      char.charCodeAt(0),
        bubbles:    true,
        cancelable: true
      };
      document.dispatchEvent(new KeyboardEvent('keydown',  { ...shared }));
      document.dispatchEvent(new KeyboardEvent('keypress', { ...shared }));
      document.dispatchEvent(new InputEvent('input', {
        data: char, bubbles: true, cancelable: true, inputType: 'insertText'
      }));
      document.dispatchEvent(new KeyboardEvent('keyup', { ...shared }));
    }
  }

  function showToast(message, isError = false) {
    const TOAST_ID = 'itglue-otp-toast';
    document.getElementById(TOAST_ID)?.remove();
    const toast = document.createElement('div');
    toast.id = TOAST_ID;
    Object.assign(toast.style, {
      position:     'fixed',
      top:          '18px',
      right:        '18px',
      zIndex:       '2147483647',
      padding:      '10px 18px',
      borderRadius: '10px',
      fontSize:     '13px',
      fontWeight:   '600',
      whiteSpace:   'pre-line',
      fontFamily:   '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background:   isError ? '#dc2626' : '#16a34a',
      color:        '#fff',
      boxShadow:    '0 4px 16px rgba(0,0,0,.4)',
      cursor:       'pointer',
      lineHeight:   '1.55',
      transition:   'opacity .3s ease'
    });
    toast.textContent = message;
    toast.addEventListener('click', () => toast.remove());
    document.body.appendChild(toast);
    const duration = isError ? 6000 : 4500;
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  const observer = new MutationObserver(() => {
    if (featureEnabled && Object.keys(passwordMap).length > 0) addOtpButtons();
  });

  chrome.storage.sync.get(['itglueOtpEnabled'], (result) => {
    featureEnabled = result.itglueOtpEnabled !== false;
    if (featureEnabled) {
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  });

  function removeAllOtpButtons() {
    document.querySelectorAll('.itglue-otp-btn').forEach(btn => btn.remove());
    document.querySelectorAll('td.click-column[data-itglue-otp-id]').forEach(td => {
      delete td.dataset.itglueOtpId;
    });
  }

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action !== 'toggleItglueOtp') return;
    featureEnabled = request.enabled;
    if (featureEnabled) {
      observer.observe(document.documentElement, { childList: true, subtree: true });
      if (Object.keys(passwordMap).length > 0) addOtpButtons();
    } else {
      observer.disconnect();
      removeAllOtpButtons();
    }
  });

})();