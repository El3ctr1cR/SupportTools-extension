document.addEventListener('DOMContentLoaded', () => {
  // ── Dark mode toggle ──────────────────────────────────────────────────────
  (function () {
    const btn  = document.getElementById('darkModeBtn');
    const body = document.body;
    const KEY  = 'supportToolsDarkMode';

    function applyDark(isDark) {
      body.classList.toggle('dark', isDark);
      if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([KEY], (result) => { applyDark(result[KEY] === 'dark'); });
    } else {
      try { applyDark(localStorage.getItem(KEY) === 'dark'); } catch (e) {}
    }

    if (btn) {
      btn.addEventListener('click', function () {
        const isDark = body.classList.toggle('dark');
        btn.textContent = isDark ? '☀️' : '🌙';
        const val = isDark ? 'dark' : 'light';
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ [KEY]: val });
        } else {
          try { localStorage.setItem(KEY, val); } catch (e) {}
        }
      });
    }
  })();
  // ─────────────────────────────────────────────────────────────────────────

  function showMsg(elementId, text, isError = true, duration = 3000) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = (isError ? '\u2715 ' : '\u2713 ') + text;
    el.className = 'inline-msg ' + (isError ? 'error' : 'success');
    el.style.display = 'block';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => { el.style.display = 'none'; }, duration);
  }

  let _openDropdown = null;

  function toggleFixedDropdown(btn, content) {
    if (_openDropdown && _openDropdown !== content) {
      closeFixedDropdown(_openDropdown);
    }
    if (content.classList.contains('show')) {
      closeFixedDropdown(content);
    } else {
      openFixedDropdown(btn, content);
    }
  }

  function openFixedDropdown(btn, content) {
    const rect = btn.getBoundingClientRect();
    content.style.position = 'fixed';
    content.style.top = (rect.bottom + 4) + 'px';
    content.style.left = rect.left + 'px';
    content.style.width = rect.width + 'px';
    content.style.zIndex = '99999';
    document.body.appendChild(content);
    content.classList.add('show');
    _openDropdown = content;
  }

  function closeFixedDropdown(content) {
    content.classList.remove('show');
    _openDropdown = null;
  }

  document.addEventListener('click', (e) => {
    if (_openDropdown && !_openDropdown.contains(e.target) && !e.target.closest('.dropdown-btn')) {
      closeFixedDropdown(_openDropdown);
    }
  }, true);

  const tabs = document.querySelectorAll('.tab');
  const contentSections = document.querySelectorAll('.content');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      contentSections.forEach(section => (section.style.display = 'none'));
      contentSections[index].style.display = 'block';
    });
  });

  const radioPassword = document.getElementById('typePassword');
  const radioPassphrase = document.getElementById('typePassphrase');
  const lowercaseRow = document.getElementById('lowercaseRow');
  const uppercaseRow = document.getElementById('uppercaseRow');
  const numbersRow = document.getElementById('numbersRow');
  const symbolsRow = document.getElementById('symbolsRow');

  chrome.storage.sync.get(['passwordGeneratorSettings'], (res) => {
    const settings = res.passwordGeneratorSettings || {};

    if (settings.passwordType === 'passphrase') {
      radioPassphrase.checked = true;
    } else {
      radioPassword.checked = true;
    }

    updateToggleVisibility();
  });

  radioPassword.addEventListener('change', () => {
    storePasswordType('password');
  });
  radioPassphrase.addEventListener('change', () => {
    storePasswordType('passphrase');
  });

  function storePasswordType(newType) {
    chrome.storage.sync.get(['passwordGeneratorSettings'], (res) => {
      const existing = res.passwordGeneratorSettings || {};
      existing.passwordType = newType;

      chrome.storage.sync.set({ passwordGeneratorSettings: existing }, () => {
        updateToggleVisibility();
      });
    });
  }

  function updateToggleVisibility() {
    const passphraseOptions = document.getElementById('passphraseOptions');
    if (radioPassphrase.checked) {
      lowercaseRow.style.display = 'none';
      uppercaseRow.style.display = 'none';
      numbersRow.style.display = 'none';
      symbolsRow.style.display = 'none';
      document.getElementById('passwordLengthContainer').style.display = 'none';
      if (passphraseOptions) passphraseOptions.style.display = 'block';
    } else {
      lowercaseRow.style.display = 'flex';
      uppercaseRow.style.display = 'flex';
      numbersRow.style.display = 'flex';
      symbolsRow.style.display = 'flex';
      document.getElementById('passwordLengthContainer').style.display = 'block';
      if (passphraseOptions) passphraseOptions.style.display = 'none';
    }
  }

  const makeTextNeaterButton = document.getElementById('makeTextNeater');
  const providerRadios = document.querySelectorAll('input[name="aiProvider"]');
  const aiModelDropdownButton = document.getElementById('aiModelDropdownButton');
  const aiModelDropdownContent = document.getElementById('aiModelDropdownContent');
  const selectedModelText = document.getElementById('selectedModelText');
  const aiApiKeyInput = document.getElementById('aiApiKeyInput');
  const aiApiKeyLabel = document.getElementById('aiApiKeyLabel');
  const saveAiSettingsButton = document.getElementById('saveAiSettings');
  const versionText = document.getElementById('versionText');
  const openTicketButtonToggle = document.getElementById('openTicketButtonToggle');
  const showTimeIndicatorToggle = document.getElementById('showTimeIndicatorToggle');
  const incognitoToggle = document.getElementById('incognitoToggle');
  const itglueOtpToggle = document.getElementById('itglueOtpToggle');
  const dattoStretchToggle = document.getElementById('dattoStretchToggle');
  const itgluePasswordCacheToggle = document.getElementById('itgluePasswordCacheToggle');
  const itgluePasswordCacheClearBtn = document.getElementById('itgluePasswordCacheClearBtn');
  const inputMailButton = document.getElementById('inputMail');
  const copyMailButton = document.getElementById('copyMail');
  const clearConfigButton = document.getElementById('clearConfig');
  const exportConfigButton = document.getElementById('exportConfig');
  const importConfigButton = document.getElementById('importConfig');
  const importFileInput = document.getElementById('importFile');
  const dropdownButton = document.getElementById('dropdownButton');
  const dropdownContent = document.getElementById('dropdownContent');
  const selectedFlag = document.getElementById('selectedFlag');
  const selectedLanguageText = document.getElementById('selectedLanguageText');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const templateDropdownButton = document.getElementById('templateDropdownButton');
  const templateDropdownContent = document.getElementById('templateDropdownContent');
  const selectedTemplateText = document.getElementById('selectedTemplateText');
  const ticketHistoryList = document.getElementById('ticketHistoryList');

  // ── Generic slide panel helper ────────────────────────────────────────────
  function openPanel(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }
  function closePanel(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // ── Generator history panel ───────────────────────────────────────────────
  const historyPanel = document.getElementById('historyPanel');
  const openHistoryBtn = document.getElementById('openHistoryBtn');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const passwordHistory = document.getElementById('passwordHistory');

  if (openHistoryBtn) openHistoryBtn.addEventListener('click', () => openPanel('historyPanel'));
  if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', () => closePanel('historyPanel'));
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      chrome.storage.local.get(['passwordHistory'], (res) => {
        chrome.storage.local.set({ passwordHistory: [] }, () => {
          if (passwordHistory) passwordHistory.innerHTML = '';
        });
      });
    });
  }

  // ── Ticket history slide panel ────────────────────────────────────────────
  const ticketHistoryPanel = document.getElementById('ticketHistoryPanel');
  const openTicketHistoryBtn = document.getElementById('openTicketHistoryBtn');
  const closeTicketHistoryBtn = document.getElementById('closeTicketHistoryBtn');
  const clearTicketHistoryBtn = document.getElementById('clearTicketHistoryBtn');

  if (openTicketHistoryBtn) {
    openTicketHistoryBtn.addEventListener('click', () => {
      loadTicketHistory();
      ticketHistoryPanel.classList.add('open');
    });
  }

  if (closeTicketHistoryBtn) {
    closeTicketHistoryBtn.addEventListener('click', () => {
      ticketHistoryPanel.classList.remove('open');
    });
  }

  if (clearTicketHistoryBtn) {
    clearTicketHistoryBtn.addEventListener('click', () => {
      chrome.storage.sync.set({ ticketHistory: [] }, () => {
        loadTicketHistory();
      });
    });
  }

  // ── Hex/Base32 Generator panel ────────────────────────────────────────────
  const openHexBase32Panel = document.getElementById('openHexBase32Panel');
  const closeHexBase32Panel = document.getElementById('closeHexBase32Panel');
  const hexKeyInput = document.getElementById('hexKey');
  const base32KeyInput = document.getElementById('base32Key');
  const copyHexKeyBtn = document.getElementById('copyHexKey');
  const copyBase32KeyBtn = document.getElementById('copyBase32Key');
  const refreshKeysBtn = document.getElementById('refreshKeys');

  function generateHexKey(len = 32) {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function hexToBase32(hex) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '', result = '';
    for (let i = 0; i < hex.length; i += 2) {
      bits += parseInt(hex.substr(i, 2), 16).toString(2).padStart(8, '0');
    }
    while (bits.length % 5 !== 0) bits += '0';
    for (let i = 0; i < bits.length; i += 5) {
      result += chars[parseInt(bits.substr(i, 5), 2)];
    }
    while (result.length % 8 !== 0) result += '=';
    return result;
  }

  function generateKeys() {
    const hex = generateHexKey(20);
    if (hexKeyInput) hexKeyInput.value = hex;
    if (base32KeyInput) base32KeyInput.value = hexToBase32(hex);
  }

  if (openHexBase32Panel) {
    openHexBase32Panel.addEventListener('click', () => {
      generateKeys();
      openPanel('hexBase32Panel');
    });
  }
  if (closeHexBase32Panel) closeHexBase32Panel.addEventListener('click', () => closePanel('hexBase32Panel'));
  if (refreshKeysBtn) refreshKeysBtn.addEventListener('click', generateKeys);
  if (copyHexKeyBtn) copyHexKeyBtn.addEventListener('click', () => {
    if (hexKeyInput) navigator.clipboard.writeText(hexKeyInput.value);
  });
  if (copyBase32KeyBtn) copyBase32KeyBtn.addEventListener('click', () => {
    if (base32KeyInput) navigator.clipboard.writeText(base32KeyInput.value);
  });

  // ── URL Mapping Editor panel ──────────────────────────────────────────────
  // Exact port of urlMappingEditor.js logic, adapted to run inside a slide panel
  {
    const urlMappingsButton    = document.getElementById('urlMappingsButton');
    const closeUrlMappingPanel = document.getElementById('closeUrlMappingPanel');
    const mappingsContainer    = document.getElementById('mappingsContainer');
    const saveMappingsBtn      = document.getElementById('saveMappings');

    function umStandardizeUrl(original) {
      if (!original) return '';
      const hasHttp = original.startsWith('http://') || original.startsWith('https://');
      const urlToParse = hasHttp ? original : 'https://' + original;
      try { return new URL(urlToParse).toString(); } catch (e) { return ''; }
    }

    function umRenumberMappings() {
      const groups = mappingsContainer.querySelectorAll('.mapping-group');
      groups.forEach((g) => {
        const existing = g.querySelector('.add-mapping-btn');
        if (existing) existing.remove();
      });
      if (groups.length > 0) {
        const lastGroup = groups[groups.length - 1];
        const addBtn = document.createElement('button');
        addBtn.className = 'add-mapping-btn';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
          umAddMappingGroup('', '');
        });
        lastGroup.appendChild(addBtn);
      }
    }

    function umAddMappingGroup(source, target) {
      const mappingGroup = document.createElement('div');
      mappingGroup.className = 'mapping-group';
      mappingGroup.innerHTML = `
        <div class="inputs-container">
          <input type="text" class="source-input" value="${source}" placeholder="Enter source URL...">
          <input type="text" class="target-input" value="${target}" placeholder="Enter redirect URL (optional)...">
        </div>
        <button class="remove-mapping-btn">-</button>
      `;
      mappingsContainer.appendChild(mappingGroup);
      mappingGroup.querySelector('.remove-mapping-btn').addEventListener('click', () => {
        mappingGroup.remove();
        umRenumberMappings();
      });
      umRenumberMappings();
    }

    function umLoadAndOpen() {
      mappingsContainer.innerHTML = '';
      chrome.storage.sync.get(['urlMappings'], (result) => {
        const urlMappings = result.urlMappings || {};
        Object.keys(urlMappings).forEach((sourceUrl) => {
          umAddMappingGroup(sourceUrl, urlMappings[sourceUrl]);
        });
        if (Object.keys(urlMappings).length === 0) {
          umAddMappingGroup('', '');
        }
        umRenumberMappings();
        openPanel('urlMappingPanel');
      });
    }

    if (urlMappingsButton)    urlMappingsButton.addEventListener('click', umLoadAndOpen);
    if (closeUrlMappingPanel) closeUrlMappingPanel.addEventListener('click', () => closePanel('urlMappingPanel'));

    if (saveMappingsBtn) {
      saveMappingsBtn.addEventListener('click', () => {
        const groups = mappingsContainer.querySelectorAll('.mapping-group');
        const newMappings = {};
        groups.forEach((g) => {
          let src = g.querySelector('.source-input').value.trim();
          let tgt = g.querySelector('.target-input').value.trim();
          src = umStandardizeUrl(src);
          tgt = umStandardizeUrl(tgt);
          if (src) newMappings[src] = tgt;
        });
        chrome.storage.sync.set({ urlMappings: newMappings }, () => {
          closePanel('urlMappingPanel');
        });
      });
    }
  }

  // ── Template Editor panel ─────────────────────────────────────────────────
  // Exact port of templateEditor.js logic, adapted to run inside a slide panel
  {
    const editTemplatesButton      = document.getElementById('openTemplateEditorPanel');
    const closeTemplateEditorPanel = document.getElementById('closeTemplateEditorPanel');
    const templatesContainer       = document.getElementById('templatesContainer');
    const saveTemplatesBtn         = document.getElementById('saveTemplates');
    const toggleVariablesPanel     = document.getElementById('toggleVariablesPanel');
    const variableListPanel        = document.getElementById('variableListPanel');
    const getAllStatusesPanelBtn    = document.getElementById('getAllStatusesPanelBtn');

    let tplAvailableStatuses = [];

    // Toggle variables list
    if (toggleVariablesPanel) {
      toggleVariablesPanel.addEventListener('click', () => {
        const hidden = variableListPanel.style.display === 'none' || variableListPanel.style.display === '';
        variableListPanel.style.display = hidden ? 'block' : 'none';
        toggleVariablesPanel.textContent = hidden ? 'Hide usable variables' : 'Show usable variables';
      });
    }

    // Get all statuses from Autotask tab
    if (getAllStatusesPanelBtn) {
      getAllStatusesPanelBtn.addEventListener('click', () => {
        chrome.storage.local.get(['autotaskTabId'], (result) => {
          const autoTaskTabId = result.autotaskTabId;
          if (!autoTaskTabId) {
            alert('No Autotask tab ID found. Please open the extension from the Autotask ticket page.');
            return;
          }
          chrome.scripting.executeScript(
            { target: { tabId: autoTaskTabId }, files: ['functions/templateManager.js'] },
            () => {
              chrome.tabs.sendMessage(autoTaskTabId, { action: 'getAllStatuses' }, (response) => {
                if (chrome.runtime.lastError) {
                  alert('Error: Could not retrieve statuses. Are you on an Autotask ticket page?');
                  return;
                }
                if (response && response.statuses && response.statuses.length > 0) {
                  const unique = Array.from(new Set(response.statuses));
                  const statuses = ['Select ticket status', ...unique];
                  tplAvailableStatuses = statuses;
                  chrome.storage.sync.set({ autotaskStatuses: statuses }, () => {
                    tplRefreshAllStatusDropdowns(statuses);
                  });
                } else {
                  alert('No ticket statuses found. Make sure to open a time entry or note before clicking this button.');
                }
              });
            }
          );
        });
      });
    }

    function tplRefreshAllStatusDropdowns(statuses) {
      templatesContainer.querySelectorAll('.template-group').forEach((group) => {
        const sel = group.querySelector('select');
        if (!sel) return;
        const oldValue = sel.value;
        sel.innerHTML = '';
        statuses.forEach((st) => {
          const opt = document.createElement('option');
          opt.value = st;
          opt.textContent = st;
          sel.appendChild(opt);
        });
        if (statuses.includes(oldValue)) sel.value = oldValue;
      });
    }

    function tplFormatHotkey(e) {
      const parts = [];
      if (e.ctrlKey)  parts.push('Ctrl');
      if (e.altKey)   parts.push('Alt');
      if (e.shiftKey) parts.push('Shift');
      if (e.metaKey)  parts.push('Meta');
      const modifierKeys = new Set(['Control', 'Alt', 'Shift', 'Meta']);
      if (!modifierKeys.has(e.key)) {
        parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
      }
      return parts.length >= 2 ? parts.join('+') : '';
    }

    function tplAttachHotkeyRecorder(input) {
      input.addEventListener('focus', () => {
        input.classList.add('recording');
        input.dataset.originalValue = input.value;
        input.value = 'Press keys...';
      });
      input.addEventListener('keydown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'Escape') {
          input.value = input.dataset.originalValue || '';
          input.classList.remove('recording');
          input.blur();
          return;
        }
        const combo = tplFormatHotkey(e);
        if (combo) {
          input.value = combo;
          input.classList.remove('recording');
          input.blur();
        }
      });
      input.addEventListener('blur', () => {
        input.classList.remove('recording');
        if (input.value === 'Press keys...') {
          input.value = input.dataset.originalValue || '';
        }
      });
    }

    function tplAddTemplateGroup(templateName, templateContent, templateStatus, templateHotkey) {
      const templateGroup = document.createElement('div');
      templateGroup.className = 'template-group';

      const templateBox = document.createElement('div');
      templateBox.className = 'template-box';

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = templateName;
      nameInput.className = 'template-name';
      nameInput.placeholder = 'Enter template name...';

      const statusSelect = document.createElement('select');
      tplAvailableStatuses.forEach((st) => {
        const option = document.createElement('option');
        option.value = st;
        option.textContent = st;
        statusSelect.appendChild(option);
      });
      statusSelect.value = templateStatus;

      const textArea = document.createElement('textarea');
      textArea.placeholder = 'Enter template content...';
      textArea.value = templateContent;

      const hotkeyRow = document.createElement('div');
      hotkeyRow.className = 'hotkey-row';

      const hotkeyInput = document.createElement('input');
      hotkeyInput.type = 'text';
      hotkeyInput.className = 'hotkey-input';
      hotkeyInput.readOnly = true;
      hotkeyInput.value = templateHotkey || '';
      hotkeyInput.placeholder = 'Click to record hotkey...';
      hotkeyInput.title = 'Click, then press a key combo (must include a modifier: Ctrl, Alt, Shift). Escape to cancel.';
      tplAttachHotkeyRecorder(hotkeyInput);

      const hotkeyClear = document.createElement('button');
      hotkeyClear.className = 'hotkey-clear';
      hotkeyClear.textContent = '-';
      hotkeyClear.title = 'Clear hotkey';
      hotkeyClear.addEventListener('click', () => { hotkeyInput.value = ''; });

      const hotkeyRowInputs = document.createElement('div');
      hotkeyRowInputs.className = 'hotkey-row-inputs';
      hotkeyRowInputs.appendChild(hotkeyInput);
      hotkeyRowInputs.appendChild(hotkeyClear);
      hotkeyRow.appendChild(hotkeyRowInputs);

      templateBox.appendChild(nameInput);
      templateBox.appendChild(statusSelect);
      templateBox.appendChild(textArea);
      templateBox.appendChild(hotkeyRow);

      const templateActions = document.createElement('div');
      templateActions.className = 'template-actions';

      const removeButton = document.createElement('button');
      removeButton.className = 'remove-template-btn';
      removeButton.textContent = '-';
      removeButton.addEventListener('click', () => {
        templateGroup.remove();
        tplRenumberTemplates();
      });
      templateActions.appendChild(removeButton);

      templateGroup.appendChild(templateBox);
      templateGroup.appendChild(templateActions);
      templatesContainer.appendChild(templateGroup);
    }

    function tplRenumberTemplates() {
      const groups = templatesContainer.querySelectorAll('.template-group');
      groups.forEach((group, index) => {
        const actions = group.querySelector('.template-actions');
        const existingAdd = actions.querySelector('.add-template-btn');
        if (existingAdd) existingAdd.remove();
        if (index === groups.length - 1) {
          const newAddBtn = document.createElement('button');
          newAddBtn.className = 'add-template-btn';
          newAddBtn.textContent = '+';
          newAddBtn.addEventListener('click', () => {
            tplAddTemplateGroup(`Template ${groups.length + 1}`, '', 'Select ticket status', '');
            tplRenumberTemplates();
          });
          actions.appendChild(newAddBtn);
        }
      });
    }

    function tplLoadAndOpen() {
      templatesContainer.innerHTML = '';
      // Reset variable list to hidden each time panel opens
      if (variableListPanel) variableListPanel.style.display = 'none';
      if (toggleVariablesPanel) toggleVariablesPanel.textContent = 'Show usable variables';

      chrome.storage.sync.get(['autotaskStatuses', 'templates'], (res) => {
        tplAvailableStatuses = res.autotaskStatuses || ['Select ticket status'];
        const templates = res.templates || {};
        const keys = Object.keys(templates);
        if (keys.length === 0) {
          tplAddTemplateGroup('Template 1', '', 'Select ticket status', '');
        } else {
          keys.forEach((key) => {
            const value = templates[key];
            if (typeof value === 'string') {
              tplAddTemplateGroup(key, value, 'Select ticket status', '');
            } else if (value && typeof value === 'object') {
              tplAddTemplateGroup(key, value.content || '', value.status || 'Select ticket status', value.hotkey || '');
            }
          });
        }
        tplRenumberTemplates();
        openPanel('templateEditorPanel');
      });
    }

    if (editTemplatesButton)      editTemplatesButton.addEventListener('click', tplLoadAndOpen);
    if (closeTemplateEditorPanel) closeTemplateEditorPanel.addEventListener('click', () => closePanel('templateEditorPanel'));

    if (saveTemplatesBtn) {
      saveTemplatesBtn.addEventListener('click', () => {
        const groups = templatesContainer.querySelectorAll('.template-group');
        const newTemplates = {};
        const usedHotkeys = {};
        let duplicateFound = false;

        groups.forEach((group) => {
          const hotkey = group.querySelector('.hotkey-input').value.trim();
          const name   = group.querySelector('.template-name').value.trim();
          if (hotkey) {
            if (usedHotkeys[hotkey]) {
              alert(`Duplicate hotkey "${hotkey}" on "${usedHotkeys[hotkey]}" and "${name}". Each hotkey must be unique.`);
              duplicateFound = true;
            }
            usedHotkeys[hotkey] = name;
          }
        });

        if (duplicateFound) return;

        groups.forEach((group) => {
          const templateName    = group.querySelector('.template-name').value.trim();
          const templateContent = group.querySelector('textarea').value.trim();
          const statusSelect    = group.querySelector('select');
          const chosenStatus    = statusSelect ? statusSelect.value : 'Select ticket status';
          const hotkey          = group.querySelector('.hotkey-input').value.trim();
          if (templateName && templateContent) {
            newTemplates[templateName] = { content: templateContent, status: chosenStatus, hotkey };
          }
        });

        chrome.storage.sync.set({ templates: newTemplates }, () => {
          populateTemplateDropdown(newTemplates);
          chrome.runtime.sendMessage({ action: 'updateDropdown' });
          closePanel('templateEditorPanel');
        });
      });
    }
  }

  function loadTicketHistory() {
    chrome.storage.sync.get(['ticketHistory'], (res) => {
      const history = res.ticketHistory || [];
      history.sort((a, b) => b.timestamp - a.timestamp);
      ticketHistoryList.innerHTML = '';
      history.slice(0, 30).forEach((entry) => {
        const li = document.createElement('li');
        li.style.marginBottom = '4px';
        li.style.fontSize = '12px';
        li.style.wordBreak = 'break-all';
        li.style.display = 'flex';
        li.style.flexDirection = 'column';
        const historyItemContainer = document.createElement('div');
        historyItemContainer.className = 'history-password-container';
        const link = document.createElement('a');
        link.textContent = entry.displayText || '(Unknown)';
        link.href = '#';
        link.style.color = 'var(--bw-blue)';
        link.style.textDecoration = 'none';
        link.addEventListener('click', (evt) => {
          evt.preventDefault();
          const host = entry.host || window.location.host;
          const ticketUrl = `https://${host}/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&mode=0&ticketId=${entry.ticketId}`;
          window.open(ticketUrl, '_blank');
        });
        historyItemContainer.appendChild(link);
        li.appendChild(historyItemContainer);
        const dateSpan = document.createElement('div');
        dateSpan.className = 'timestamp';
        const date = new Date(entry.timestamp);
        dateSpan.textContent = date.toLocaleString();
        li.appendChild(dateSpan);
        ticketHistoryList.appendChild(li);
      });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.id === 'tabAutotask') {
        loadTicketHistory();
      }
    });
  });

  makeTextNeaterButton.addEventListener('click', () => {
    loadingOverlay.style.display = 'flex';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['functions/aiTaskHandler.js']
        },
        () => {
          chrome.tabs.sendMessage(activeTab.id, { action: 'makeTextNeater' }, (response) => {
            loadingOverlay.style.display = 'none';
            if (response && response.success) {
              console.log('makeTextNeater completed successfully');
            } else {
              showMsg('aiActionMsg', 'Failed to perform makeTextNeater' + (response && response.error ? ': ' + response.error : ''));
            }
          });
        }
      );
    });
  });

  chrome.storage.sync.get(['lastSelectedTemplate'], (result) => {
    const lastSelectedTemplate = result.lastSelectedTemplate;
    if (lastSelectedTemplate) {
      selectedTemplateText.textContent = lastSelectedTemplate;
    }
  });

  chrome.storage.sync.get(['openTicketButtonEnabled'], (result) => {
    openTicketButtonToggle.checked = result.openTicketButtonEnabled || false;
  });

  chrome.storage.sync.get(['showTimeIndicatorEnabled'], (result) => {
    showTimeIndicatorToggle.checked = result.showTimeIndicatorEnabled || false;
  });

  chrome.storage.sync.get(['selectedLanguage'], (result) => {
    const language = result.selectedLanguage || 'nl';
    updateDropdownSelection(language);
  });

  dropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFixedDropdown(dropdownButton, dropdownContent);
  });

  dropdownContent.addEventListener('click', (event) => {
    const selectedItem = event.target.closest('.dropdown-item');
    if (selectedItem) {
      const selectedValue = selectedItem.getAttribute('data-value');
      updateDropdownSelection(selectedValue);
      chrome.storage.sync.set({ selectedLanguage: selectedValue }, () => {
        console.log(`Language preference saved: ${selectedValue}`);
      });
      closeFixedDropdown(dropdownContent);
    }
  });

  function updateDropdownSelection(language) {
    const flagMap = {
      nl: '../icons/flags/nl.png',
      en: '../icons/flags/us.png',
      de: '../icons/flags/de.png'
    };
    const languageTextMap = {
      nl: 'Dutch',
      en: 'English',
      de: 'German'
    };

    selectedFlag.src = flagMap[language] || flagMap.nl;
    selectedLanguageText.textContent = languageTextMap[language] || languageTextMap.nl;
  }

  const headers = document.querySelectorAll('.category-header');

  headers.forEach(header => {
    if (header.textContent.trim().toLowerCase().includes("improvements")) {
      const icon = document.createElement('img');

      icon.src = chrome.runtime.getURL('icons/warning.png');
      icon.alt = 'Warning';
      icon.title = 'These are experimental features so if something breaks please turn them off.';

      icon.style.width = '16px';
      icon.style.height = '16px';
      icon.style.marginLeft = '5px';
      icon.style.cursor = 'pointer';
      icon.style.filter = "invert(68%) sepia(100%) saturate(5000%) hue-rotate(2deg) brightness(105%) contrast(101%)";

      header.appendChild(icon);
    }
  });

  openTicketButtonToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ openTicketButtonEnabled: openTicketButtonToggle.checked }, () => {
      console.log('Open Ticket Button setting updated:', openTicketButtonToggle.checked);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleOpenTicketButton',
        enabled: openTicketButtonToggle.checked,
      });
    });
  });

  showTimeIndicatorToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ showTimeIndicatorEnabled: showTimeIndicatorToggle.checked }, () => {
      console.log('Open Ticket Button setting updated:', showTimeIndicatorToggle.checked);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleTimeIndicator',
        enabled: showTimeIndicatorToggle.checked,
      });
    });
  });

  const providerKeyMap = {
    openai: 'openAiApiKey',
    google: 'googleApiKey',
    anthropic: 'anthropicApiKey'
  };
  const providerLabelMap = {
    openai: 'OpenAI API Key',
    google: 'Google API Key',
    anthropic: 'Anthropic API Key'
  };
  const providerModels = {
    openai: [
      { value: 'gpt-5.2',        label: 'GPT-5.2' },
      { value: 'gpt-5.2-pro',    label: 'GPT-5.2 Pro' },
      { value: 'gpt-5.3-codex',  label: 'GPT-5.3 Codex' },
      { value: 'gpt-5-mini',     label: 'GPT-5 Mini' },
      { value: 'gpt-5-nano',     label: 'GPT-5 Nano' }
    ],
    google: [
      { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview' },
      { value: 'gemini-3-pro-preview',   label: 'Gemini 3 Pro Preview' },
      { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' }
    ],
    anthropic: [
      { value: 'claude-opus-4-6',   label: 'Claude Opus 4.6' },
      { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
      { value: 'claude-haiku-4-5',  label: 'Claude Haiku 4.5' }
    ]
  };

  let currentAiModel = '';

  function populateModelDropdown(provider, savedModel) {
    aiModelDropdownContent.innerHTML = '';
    const models = providerModels[provider] || [];
    let firstModel = '';

    models.forEach((m, i) => {
      const item = document.createElement('div');
      item.classList.add('dropdown-item');
      item.setAttribute('data-value', m.value);
      item.textContent = m.label;
      item.addEventListener('click', () => {
        currentAiModel = m.value;
        selectedModelText.textContent = m.label;
        closeFixedDropdown(aiModelDropdownContent);
      });
      aiModelDropdownContent.appendChild(item);
      if (i === 0) firstModel = m.value;
    });

    const modelToSelect = (savedModel && models.find(m => m.value === savedModel))
      ? savedModel
      : firstModel;

    currentAiModel = modelToSelect;
    const match = models.find(m => m.value === modelToSelect);
    selectedModelText.textContent = match ? match.label : 'Select a model';
  }

  aiModelDropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFixedDropdown(aiModelDropdownButton, aiModelDropdownContent);
  });

  function loadAiSettingsFromStorage() {
    chrome.storage.sync.get(['aiProvider', 'aiModel', 'openAiApiKey', 'googleApiKey', 'anthropicApiKey'], (result) => {
      const provider = result.aiProvider || 'openai';
      const radio = document.querySelector(`input[name="aiProvider"][value="${provider}"]`);
      if (radio) radio.checked = true;
      aiApiKeyLabel.textContent = providerLabelMap[provider] || 'API Key';
      populateModelDropdown(provider, result.aiModel);
      aiApiKeyInput.value = result[providerKeyMap[provider]] || '';
    });
  }

  loadAiSettingsFromStorage();

  providerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const provider = radio.value;
      aiApiKeyLabel.textContent = providerLabelMap[provider] || 'API Key';
      populateModelDropdown(provider, null);
      chrome.storage.sync.get([providerKeyMap[provider]], (result) => {
        aiApiKeyInput.value = result[providerKeyMap[provider]] || '';
      });
    });
  });

  saveAiSettingsButton.addEventListener('click', () => {
    const selectedProvider = document.querySelector('input[name="aiProvider"]:checked')?.value || 'openai';
    const apiKey = aiApiKeyInput.value.trim();
    const keyStorageKey = providerKeyMap[selectedProvider];

    const toSave = {
      aiProvider: selectedProvider,
      aiModel: currentAiModel,
      [keyStorageKey]: apiKey
    };

    chrome.storage.sync.set(toSave, () => {
      showMsg('aiSettingsUpdatedMsg', 'Settings saved.', false);
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'aiSettingsUpdated' }).catch(() => {});
        });
      });
    });
  });

  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => response.json())
    .then(manifest => {
      const currentVersion = manifest.version;
      versionText.textContent = `Version ${currentVersion}`;
    });

  chrome.storage.sync.get(['incognitoRedirection', 'templates', 'itglueOtpEnabled'], (result) => {
    incognitoToggle.checked = result.incognitoRedirection || false;
    itglueOtpToggle.checked = result.itglueOtpEnabled !== false;

    const templates = result.templates || {};
    populateTemplateDropdown(templates);
  });

  function populateTemplateDropdown(templates) {
    templateDropdownContent.innerHTML = '';

    Object.keys(templates).forEach((key) => {
      let templateContent = '';
      const templateValue = templates[key];

      if (typeof templateValue === 'string') {
        templateContent = templateValue.trim();
      } else if (typeof templateValue === 'object' && templateValue !== null) {
        templateContent = (templateValue.content || '').trim();
      }

      if (templateContent !== '') {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.setAttribute('data-value', key);
        dropdownItem.textContent = key;

        dropdownItem.addEventListener('click', () => {
          selectedTemplateText.textContent = key;
          closeFixedDropdown(templateDropdownContent);

          chrome.storage.sync.set({ lastSelectedTemplate: key }, () => {
            console.log(`Last selected template saved: ${key}`);
          });
        });

        templateDropdownContent.appendChild(dropdownItem);
      }
    });
  }

  templateDropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFixedDropdown(templateDropdownButton, templateDropdownContent);
  });

  chrome.storage.sync.get(['templates'], (result) => {
    const templates = result.templates || {};
    populateTemplateDropdown(templates);
  });

  incognitoToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ incognitoRedirection: incognitoToggle.checked });
  });

  itglueOtpToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ itglueOtpEnabled: itglueOtpToggle.checked }, () => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action:  'toggleItglueOtp',
            enabled: itglueOtpToggle.checked
          }).catch(() => {});
        });
      });
    });
  });

  chrome.storage.local.get(['dattoTrueStretch_enabled'], (result) => {
    dattoStretchToggle.checked = result.dattoTrueStretch_enabled || false;
  });

  dattoStretchToggle.addEventListener('change', () => {
    chrome.storage.local.set({ dattoTrueStretch_enabled: dattoStretchToggle.checked }, () => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action:  'toggleDattoStretch',
            enabled: dattoStretchToggle.checked
          }).catch(() => {});
        });
      });
    });
  });

  chrome.storage.local.get(['itgluePasswordCache_enabled'], (result) => {
    itgluePasswordCacheToggle.checked = result.itgluePasswordCache_enabled ?? false;
  });

  itgluePasswordCacheToggle.addEventListener('change', () => {
    const enabled = itgluePasswordCacheToggle.checked;
    chrome.storage.local.set({ itgluePasswordCache_enabled: enabled }, () => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'toggleItgluePasswordCache',
            enabled
          }).catch(() => {});
        });
      });
    });
  });

  itgluePasswordCacheClearBtn.addEventListener('click', () => {
    chrome.storage.local.get(null, (all) => {
      const keys = Object.keys(all).filter(k =>
        k.startsWith('pw_org_') ||
        k.startsWith('pw_device_') ||
        k.startsWith('config_') ||
        k.startsWith('itglue_org_') ||
        k.startsWith('itglue_pending_config_')
      );
      chrome.storage.local.remove(keys, () => {
        showMsg('itgluePasswordCacheMsg', `Cache cleared (${keys.length} entries)`, false, 3000);
      });
    });
  });

  inputMailButton.addEventListener('click', () => {
    const selectedTemplate = document.getElementById('selectedTemplateText').textContent;
    if (!selectedTemplate || selectedTemplate === 'Select a Template') {
      showMsg('templateMsg', 'Please select a template before proceeding.');
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.tabs.sendMessage(activeTab.id, { action: 'getEmailText', template: selectedTemplate }, (response) => {
        if (response && response.success) {
          console.log('Email text inserted successfully');
        } else {
          showMsg('templateMsg', response && response.message ? response.message : 'Failed to insert email text');
        }
      });
    });
  });

  copyMailButton.addEventListener('click', () => {
    const selectedTemplateName = document.getElementById('selectedTemplateText').textContent;
    if (!selectedTemplateName || selectedTemplateName === 'Select a Template') {
      showMsg('templateMsg', 'Please select a template before proceeding.');
      return;
    }

    chrome.storage.sync.get(['templates'], (result) => {
      const templates = result.templates || {};
      const rawTemplateObj = templates[selectedTemplateName];
      if (!rawTemplateObj) {
        showMsg('templateMsg', 'Template not found!');
        return;
      }
      let finalTemplateString = '';
      if (typeof rawTemplateObj === 'string') {
        finalTemplateString = rawTemplateObj;
      } else if (typeof rawTemplateObj === 'object') {
        finalTemplateString = rawTemplateObj.content || '';
      }
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript(
          { target: { tabId: activeTab.id }, files: ['functions/templateManager.js'] },
          () => {
            chrome.tabs.sendMessage(activeTab.id, { action: 'getTicketDetails' }, (response) => {
              if (!response) {
                showMsg('templateMsg', 'Failed to retrieve ticket details.');
                return;
              }
              chrome.tabs.sendMessage(
                activeTab.id,
                {
                  action: 'processTemplate',
                  template: finalTemplateString,
                  ticketDetails: response
                },
                (res2) => {
                  if (res2 && res2.processedText) {
                    navigator.clipboard.writeText(res2.processedText)
                      .then(() => {
                        console.log('Email text copied to clipboard');
                      })
                      .catch((err) => {
                        console.error('Failed to copy text: ', err);
                      });
                  } else {
                    showMsg('templateMsg', 'Failed to process the template.');
                  }
                }
              );
            });
          }
        );
      });
    });
  });

  clearConfigButton.addEventListener('click', () => {
    const confirmUI = document.getElementById('clearConfirmUI');
    confirmUI.style.display = 'flex';
  });

  document.getElementById('clearConfirmNo').addEventListener('click', () => {
    document.getElementById('clearConfirmUI').style.display = 'none';
  });

  document.getElementById('clearConfirmYes').addEventListener('click', () => {
    document.getElementById('clearConfirmUI').style.display = 'none';
    chrome.storage.sync.clear(() => {
      showMsg('configMsg', 'Configuration cleared!', false);
      populateTemplateDropdown({});
    });
  });

  exportConfigButton.addEventListener('click', () => {
    chrome.storage.sync.get(null, (data) => {
      const configBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(configBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'support-tools-config.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  importConfigButton.addEventListener('click', () => {
    if (navigator.userAgent.toLowerCase().includes('firefox')) {
      chrome.windows.create({
        url: chrome.runtime.getURL('../popups/importConfig.html'),
        type: 'popup',
        width: 500,
        height: 300
      });
    } else {
      importFileInput.click();
    }
  });

  importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          chrome.storage.sync.set(importedConfig, () => {
            showMsg('configMsg', 'Configuration imported successfully!', false);
            populateTemplateDropdown(importedConfig.templates || {});
          });
        } catch (error) {
          showMsg('configMsg', 'Failed to import configuration. Invalid JSON format.');
        }
      };
      reader.readAsText(file);
    }
  });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateDropdown') {
      chrome.storage.sync.get(['templates'], (result) => {
        const templates = result.templates || {};
        populateTemplateDropdown(templates);
      });
    }
  });

  (function initChangelog() {
    const overlay   = document.getElementById('changelogOverlay');
    const closeBtn  = document.getElementById('changelogClose');
    const dismissBtn = document.getElementById('changelogDismiss');
    const versionEl = document.getElementById('changelogVersion');
    const bodyEl    = document.getElementById('changelogBody');

    const currentVersion = chrome.runtime.getManifest().version;
    const storageKey     = 'changelogDismissedVersion';

    function parseMarkdown(md) {
      return marked.parse(md || '');
    }

    function showChangelog(releaseBody) {
      versionEl.textContent = 'v' + currentVersion;
      bodyEl.innerHTML = parseMarkdown(releaseBody || '_No release notes available._');
      overlay.style.display = 'flex';
    }

    function hideChangelog() {
      overlay.style.display = 'none';
    }

    closeBtn.addEventListener('click', hideChangelog);

    dismissBtn.addEventListener('click', () => {
      chrome.storage.local.set({ [storageKey]: currentVersion }, hideChangelog);
    });

    chrome.storage.local.get([storageKey], (res) => {
      if (res[storageKey] === currentVersion) return;

      bodyEl.innerHTML = '<div id="changelogLoading"><div class="cl-spinner"></div>Loading changelog…</div>';
      overlay.style.display = 'flex';
      versionEl.textContent = 'v' + currentVersion;

      fetch('https://api.github.com/repos/El3ctr1cR/SupportTools-extension/releases', {
        headers: { 'Accept': 'application/vnd.github+json' }
      })
        .then(r => r.json())
        .then(releases => {
          const match = releases.find(r => {
            const tag = (r.tag_name || '').replace(/^v/, '');
            return tag === currentVersion;
          });

          if (!match) {
            // No matching release - hide
            hideChangelog();
            return;
          }

          showChangelog(match.body);
        })
        .catch(() => {
          // Network error - hide
          hideChangelog();
        });
    });
  })();
});
