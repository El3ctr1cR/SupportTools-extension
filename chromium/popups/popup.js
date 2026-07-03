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
    content.style.maxHeight = '280px';

    document.body.appendChild(content);
    content.classList.add('show');
    _openDropdown = content;

    const contentElements = document.querySelectorAll('.content');
    contentElements.forEach(el => el.style.pointerEvents = 'none');
  }

  function closeFixedDropdown(content) {
    content.classList.remove('show');
    _openDropdown = null;
    const contentElements = document.querySelectorAll('.content');
    contentElements.forEach(el => el.style.pointerEvents = 'auto');
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

  const summarizeNoteButton = document.getElementById('summarizeNote');
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
  const autotaskTabsToggle = document.getElementById('autotaskTabsToggle');
  const incognitoToggle = document.getElementById('incognitoToggle');
  const itglueOtpToggle = document.getElementById('itglueOtpToggle');
  const dattoStretchToggle = document.getElementById('dattoStretchToggle');
  const itgluePasswordCacheToggle = document.getElementById('itgluePasswordCacheToggle');
  const itgluePasswordCacheClearBtn = document.getElementById('itgluePasswordCacheClearBtn');
  const insertNoteButton = document.getElementById('insertNote');
  const copyNoteButton = document.getElementById('copyNote');
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
  const autotaskTabsSettingsBtn = document.getElementById('autotaskTabsSettingsBtn');
  const autotaskTabsSettingsPanel = document.getElementById('autotaskTabsSettingsPanel');
  const closeAutotaskTabsSettingsPanelBtn = document.getElementById('closeAutotaskTabsSettingsPanel');
  const autotaskTabsSettingsContent = document.getElementById('autotaskTabsSettingsContent');

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
      chrome.storage.local.set({ passwordHistory: [] }, () => {
        if (passwordHistory) passwordHistory.innerHTML = '';
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
            { target: { tabId: autoTaskTabId }, files: ['functions/autotask/templateManager.js'] },
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

  // ── Autotask Tabs Settings Panel ──────────────────────────────────────────
  const autotaskTabsSettingsKey = 'autotask-tabs-settings-v1';

  // Store references to all settings inputs
  let atSettingsInputs = null;

  function loadAutotaskTabsSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([autotaskTabsSettingsKey], (result) => {
        resolve(result[autotaskTabsSettingsKey] || {});
      });
    });
  }

  function saveAutotaskTabsSettings(settings) {
    chrome.storage.sync.set({ [autotaskTabsSettingsKey]: settings }, () => {
      console.log('Autotask Tabs settings saved:', settings);
    });
  }

  function saveCurrentSettings() {
    if (!atSettingsInputs) return;
    const { orientation, size,
            resize, hide, persist, peekConfirm, peekMoveResize, roundedFrames,
            improvedScrollbars, phoneLinks, ticketLinks } = atSettingsInputs;
    const settings = {
      barOrientation: orientation ? (orientation.dataset.value === 'vertical-left' ? 'vertical' : 'horizontal') : 'horizontal',
      horizontalCompactTabsEnabled: size ? (size.dataset.value === 'compact') : false,
      resizableTabBarEnabled: resize ? resize.checked : false,
      shellHidden: hide ? !hide.checked : false,
      rememberTabsAfterClose: persist ? persist.checked : false,
      skipPeekBackdropCloseWarning: peekConfirm ? !peekConfirm.checked : false,
      peekMoveResizeEnabled: peekMoveResize ? peekMoveResize.checked : false,
      roundedPageFramesEnabled: roundedFrames ? roundedFrames.checked : false,
      improvedScrollbarsEnabled: improvedScrollbars ? improvedScrollbars.checked : false,
      phoneLinksEnabled: phoneLinks ? phoneLinks.checked : false,
      ticketLinksEnabled: ticketLinks ? ticketLinks.checked : false,
    };
    saveAutotaskTabsSettings(settings);
  }

  function createAutotaskTabsSettingsUI() {
    autotaskTabsSettingsContent.innerHTML = '';

    const settingsContainer = document.createElement('div');
    settingsContainer.style.padding = '16px';
    settingsContainer.style.maxWidth = '600px';
    settingsContainer.style.margin = '0 auto';

    // Tab Bar Section
    const tabBarSection = document.createElement('div');
    tabBarSection.style.marginBottom = '24px';
    tabBarSection.style.borderBottom = '1px solid var(--border)';
    tabBarSection.innerHTML = '<h3 style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text-sec);text-transform:uppercase;letter-spacing:0.05em;">Tab Bar</h3>';

    const orientationRow = document.createElement('div');
    orientationRow.style.marginBottom = '12px';
    orientationRow.innerHTML = `
      <fieldset class="labeled-field">
        <legend>Tab bar location</legend>
        <div class="custom-dropdown">
          <button type="button" id="atOrientation" class="dropdown-btn">
            <span class="dropdown-text">Horizontal</span>
            <i class="arrow-down"></i>
          </button>
          <div class="dropdown-content">
            <div class="dropdown-item" data-value="horizontal">Horizontal</div>
            <div class="dropdown-item" data-value="vertical-left">Vertical (Left)</div>
          </div>
        </div>
      </fieldset>
      <p style="font-size:11px;color:var(--text-sec);margin-top:6px;">Choose whether tabs appear above Autotask or in a side bar.</p>
    `;
    const orientationBtn = orientationRow.querySelector('#atOrientation');
    const orientationContent = orientationRow.querySelector('.dropdown-content');
    orientationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFixedDropdown(orientationBtn, orientationContent);
    });
    orientationContent.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const value = item.getAttribute('data-value');
        orientationBtn.dataset.value = value;
        orientationBtn.querySelector('.dropdown-text').textContent = item.textContent;
        closeFixedDropdown(orientationContent);
        saveCurrentSettings();
      }
    });
    tabBarSection.appendChild(orientationRow);

    const sizeRow = document.createElement('div');
    sizeRow.style.marginBottom = '12px';
    sizeRow.innerHTML = `
      <fieldset class="labeled-field">
        <legend>Tab size</legend>
        <div class="custom-dropdown">
          <button type="button" id="atSize" class="dropdown-btn">
            <span class="dropdown-text">Enhanced tabs</span>
            <i class="arrow-down"></i>
          </button>
          <div class="dropdown-content">
            <div class="dropdown-item" data-value="default">Enhanced tabs</div>
            <div class="dropdown-item" data-value="compact">Browser-like</div>
          </div>
        </div>
      </fieldset>
      <p style="font-size:11px;color:var(--text-sec);margin-top:6px;">Use Enhanced tabs for more detailed information or Browser-like tabs for slim page-title tabs.</p>
    `;
    const sizeBtn = sizeRow.querySelector('#atSize');
    const sizeContent = sizeRow.querySelector('.dropdown-content');
    sizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFixedDropdown(sizeBtn, sizeContent);
    });
    sizeContent.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (item) {
        const value = item.getAttribute('data-value');
        sizeBtn.dataset.value = value;
        sizeBtn.querySelector('.dropdown-text').textContent = item.textContent;
        closeFixedDropdown(sizeContent);
        saveCurrentSettings();
      }
    });
    tabBarSection.appendChild(sizeRow);

    const resizeRow = document.createElement('div');
    resizeRow.className = 'toggle-row';
    resizeRow.style.marginBottom = '0px';
    resizeRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atResize">
        <span class="slider"></span>
      </label>
      <label for="atResize" style="margin:0;">Allow resizing of the vertical tab bar</label>
    `;
    const resize = resizeRow.querySelector('input');
    resize.addEventListener('change', saveCurrentSettings);
    tabBarSection.appendChild(resizeRow);

    const hideRow = document.createElement('div');
    hideRow.className = 'toggle-row';
    hideRow.style.marginBottom = '0px';
    hideRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atHide" checked>
        <span class="slider"></span>
      </label>
      <label for="atHide" style="margin:0;">Enable tab bar</label>
    `;
    const hide = hideRow.querySelector('input');
    hide.addEventListener('change', saveCurrentSettings);
    tabBarSection.appendChild(hideRow);

    const persistRow = document.createElement('div');
    persistRow.className = 'toggle-row';
    persistRow.style.marginBottom = '0px';
    persistRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atPersist">
        <span class="slider"></span>
      </label>
      <label for="atPersist" style="margin:0;">Remember tabs after closing browser</label>
    `;
    const persist = persistRow.querySelector('input');
    persist.addEventListener('change', saveCurrentSettings);
    tabBarSection.appendChild(persistRow);

    settingsContainer.appendChild(tabBarSection);

    // Peek Section
    const peekSection = document.createElement('div');
    peekSection.style.marginBottom = '24px';
    peekSection.style.borderBottom = '1px solid var(--border)';
    peekSection.innerHTML = '<h3 style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text-sec);text-transform:uppercase;letter-spacing:0.05em;">Peek</h3>';

    const peekConfirmRow = document.createElement('div');
    peekConfirmRow.className = 'toggle-row';
    peekConfirmRow.style.marginBottom = '0px';
    peekConfirmRow.innerHTML = `
      <label class="toggle-switch"">
        <input type="checkbox" id="atPeekConfirm">
        <span class="slider"></span>
      </label>
      <label for="atPeekConfirm" style="margin:0;">Confirm before closing Peek by outside click</label>
    `;
    const peekConfirm = peekConfirmRow.querySelector('input');
    peekConfirm.addEventListener('change', saveCurrentSettings);
    peekSection.appendChild(peekConfirmRow);

    const peekMoveResizeRow = document.createElement('div');
    peekMoveResizeRow.className = 'toggle-row';
    peekMoveResizeRow.style.marginBottom = '0px';
    peekMoveResizeRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atPeekMoveResize">
        <span class="slider"></span>
      </label>
      <label for="atPeekMoveResize" style="margin:0;">Allow resizing and moving of Peek windows</label>
    `;
    const peekMoveResize = peekMoveResizeRow.querySelector('input');
    peekMoveResize.addEventListener('change', saveCurrentSettings);
    peekSection.appendChild(peekMoveResizeRow);

    settingsContainer.appendChild(peekSection);

    // Enhanced Section
    const enhancedSection = document.createElement('div');
    enhancedSection.style.marginBottom = '24px';
    enhancedSection.style.borderBottom = '1px solid var(--border)';
    enhancedSection.innerHTML = '<h3 style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text-sec);text-transform:uppercase;letter-spacing:0.05em;">Enhancements</h3>';

    const roundedPageFramesRow = document.createElement('div');
    roundedPageFramesRow.className = 'toggle-row';
    roundedPageFramesRow.style.marginBottom = '0px';
    roundedPageFramesRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atRoundedFrames">
        <span class="slider"></span>
      </label>
      <label for="atRoundedFrames" style="margin:0;">Rounded page frames</label>
    `;
    const roundedFrames = roundedPageFramesRow.querySelector('input');
    roundedFrames.addEventListener('change', saveCurrentSettings);
    enhancedSection.appendChild(roundedPageFramesRow);

    const improvedScrollbarsRow = document.createElement('div');
    improvedScrollbarsRow.className = 'toggle-row';
    improvedScrollbarsRow.style.marginBottom = '0px';
    improvedScrollbarsRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atImprovedScrollbars">
        <span class="slider"></span>
      </label>
      <label for="atImprovedScrollbars" style="margin:0;">Improved scrollbars</label>
    `;
    const improvedScrollbars = improvedScrollbarsRow.querySelector('input');
    improvedScrollbars.addEventListener('change', saveCurrentSettings);
    enhancedSection.appendChild(improvedScrollbarsRow);

    const phoneLinksRow = document.createElement('div');
    phoneLinksRow.className = 'toggle-row';
    phoneLinksRow.style.marginBottom = '0px';
    phoneLinksRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atPhoneLinks">
        <span class="slider"></span>
      </label>
      <label for="atPhoneLinks" style="margin:0;">Clickable phone numbers</label>
    `;
    const phoneLinks = phoneLinksRow.querySelector('input');
    phoneLinks.addEventListener('change', saveCurrentSettings);
    enhancedSection.appendChild(phoneLinksRow);

    const ticketLinksRow = document.createElement('div');
    ticketLinksRow.className = 'toggle-row';
    ticketLinksRow.style.marginBottom = '0px';
    ticketLinksRow.innerHTML = `
      <label class="toggle-switch">
        <input type="checkbox" id="atTicketLinks">
        <span class="slider"></span>
      </label>
      <label for="atTicketLinks" style="margin:0;">Clickable ticket numbers</label>
    `;
    const ticketLinks = ticketLinksRow.querySelector('input');
    ticketLinks.addEventListener('change', saveCurrentSettings);
    enhancedSection.appendChild(ticketLinksRow);

    settingsContainer.appendChild(enhancedSection);

    autotaskTabsSettingsContent.appendChild(settingsContainer);

    // Store references for saving
    atSettingsInputs = {
      orientation: orientationBtn,
      size: sizeBtn,
      resize, hide, persist, peekConfirm, peekMoveResize, roundedFrames,
      improvedScrollbars, phoneLinks, ticketLinks
    };
  }

  function loadAutotaskTabsSettingsValues() {
    createAutotaskTabsSettingsUI();
    loadAutotaskTabsSettings().then((settings) => {
      if (!settings) return;

      // Tab Bar
      if (atSettingsInputs.orientation) {
        const orientationValue = settings.barOrientation === 'vertical' ? 'vertical-left' : 'horizontal';
        atSettingsInputs.orientation.dataset.value = orientationValue;
        atSettingsInputs.orientation.querySelector('.dropdown-text').textContent =
          orientationValue === 'vertical-left' ? 'Vertical (Left)' : 'Horizontal';
      }
      if (atSettingsInputs.size) {
        const sizeValue = settings.horizontalCompactTabsEnabled ? 'compact' : 'default';
        atSettingsInputs.size.dataset.value = sizeValue;
        atSettingsInputs.size.querySelector('.dropdown-text').textContent =
          sizeValue === 'compact' ? 'Browser-like' : 'Enhanced tabs';
      }
      if (atSettingsInputs.resize) atSettingsInputs.resize.checked = settings.resizableTabBarEnabled || false;
      if (atSettingsInputs.hide) atSettingsInputs.hide.checked = !settings.shellHidden;
      if (atSettingsInputs.persist) atSettingsInputs.persist.checked = settings.rememberTabsAfterClose || false;

      // Peek
      if (atSettingsInputs.peekConfirm) atSettingsInputs.peekConfirm.checked = !settings.skipPeekBackdropCloseWarning;
      if (atSettingsInputs.peekMoveResize) atSettingsInputs.peekMoveResize.checked = settings.peekMoveResizeEnabled || false;

      // Enhanced
      if (atSettingsInputs.roundedFrames) atSettingsInputs.roundedFrames.checked = settings.roundedPageFramesEnabled || false;
      if (atSettingsInputs.improvedScrollbars) atSettingsInputs.improvedScrollbars.checked = settings.improvedScrollbarsEnabled || false;
      if (atSettingsInputs.phoneLinks) atSettingsInputs.phoneLinks.checked = settings.phoneLinksEnabled || false;
      if (atSettingsInputs.ticketLinks) atSettingsInputs.ticketLinks.checked = settings.ticketLinksEnabled || false;
    });
  }

  summarizeNoteButton.addEventListener('click', () => {
    loadingOverlay.style.display = 'flex';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['functions/autotask/aiTaskHandler.js']
        },
        () => {
          chrome.tabs.sendMessage(activeTab.id, { action: 'summarizeNote' }, (response) => {
            loadingOverlay.style.display = 'none';
            if (response && response.success) {
              console.log('summarizeNote completed successfully');
            } else {
              showMsg('aiActionMsg', 'Failed to perform summarizeNote' + (response && response.error ? ': ' + response.error : ''));
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

  // Autotask Tabs Toggle - read from storage on startup
  chrome.storage.sync.get([autotaskTabsSettingsKey], (result) => {
    const settings = result[autotaskTabsSettingsKey] || {};
    autotaskTabsToggle.checked = settings.extensionEnabled !== false;
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

  autotaskTabsToggle.addEventListener('change', () => {
    const enabled = autotaskTabsToggle.checked;
    chrome.storage.sync.get([autotaskTabsSettingsKey], (result) => {
      const settings = Object.assign({}, result[autotaskTabsSettingsKey] || {}, { extensionEnabled: enabled });
      chrome.storage.sync.set({ [autotaskTabsSettingsKey]: settings }, () => {
        chrome.tabs.query({ url: ['*://*.autotask.net/*'] }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(
              tab.id,
              { __supportToolsAutotaskTabs: true, type: 'set-enabled', enabled },
              () => { void chrome.runtime.lastError; }
            );
          });
        });
      });
    });
  });

  // Autotask Tabs Settings Panel event listeners
  if (autotaskTabsSettingsBtn) {
    autotaskTabsSettingsBtn.addEventListener('click', () => {
      loadAutotaskTabsSettingsValues();
      openPanel('autotaskTabsSettingsPanel');
    });
  }

  if (closeAutotaskTabsSettingsPanelBtn) {
    closeAutotaskTabsSettingsPanelBtn.addEventListener('click', () => {
      closePanel('autotaskTabsSettingsPanel');
      if (_openDropdown) closeFixedDropdown(_openDropdown);
    });
  }

  // Save and reset buttons removed - settings now auto-save on change

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
  // No hardcoded models - fetched from API when key is provided
  const providerModels = {
    openai: [],
    google: [],
    anthropic: []
  };

  let currentAiModel = '';

  function populateModelDropdown(provider, savedModel, showPlaceholderIfEmpty = false) {
    aiModelDropdownContent.innerHTML = '';
    const models = providerModels[provider] || [];
    let firstModel = '';

    if (models.length === 0 && showPlaceholderIfEmpty) {
      const placeholder = document.createElement('div');
      placeholder.classList.add('dropdown-item');
      placeholder.style.color = '#9ca3af';
      placeholder.textContent = 'No models found. Please enter an API key to fetch models.';
      placeholder.style.pointerEvents = 'none';
      aiModelDropdownContent.appendChild(placeholder);
      currentAiModel = '';
      selectedModelText.textContent = 'No models available';
      return;
    }

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

  // Load models from storage for a provider
  function loadModelsFromStorage(provider) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([`${provider}Models`], (result) => {
        const models = result[`${provider}Models`] || [];
        resolve(models); // Always return the array (possibly empty)
      });
    });
  }

  // Fetch models for a provider from the API (popup context can use fetch directly)
  function fetchModelsForProvider(provider, apiKey) {
    return new Promise((resolve, reject) => {
      let url, headers = {};

      if (provider === 'openai') {
        url = 'https://api.openai.com/v1/models';
        headers = { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' };
      } else if (provider === 'google') {
        url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey + '&pageSize=1000';
        headers = { 'Content-Type': 'application/json' };
      } else if (provider === 'anthropic') {
        url = 'https://api.anthropic.com/v1/models';
        headers = { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' };
      }

      fetch(url, { method: 'GET', headers: headers })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw err.error?.message || response.statusText; });
          }
          return response.json();
        })
        .then(data => {
          let models = [];
          if (data.data && Array.isArray(data.data)) {
            models = data.data.map(m => ({ value: m.id, label: m.id }));
          } else if (data.models && Array.isArray(data.models)) {
            models = data.models.map(m => ({ value: m.name || m.id, label: m.name || m.id }));
          }
          resolve(models);
        })
        .catch(err => {
          reject(new Error(err.toString() || 'Failed to fetch models'));
        });
    });
  }

  // Update providerModels with fetched models and populate dropdown
  function updateModelDropdownWithFetched(provider, fetchedModels) {
    if (fetchedModels && fetchedModels.length > 0) {
      providerModels[provider] = fetchedModels;
    } else {
      // Clear the models array if no models available
      providerModels[provider] = [];
    }
  }

  function loadAiSettingsFromStorage() {
    chrome.storage.sync.get(['aiProvider', 'aiModel', 'openAiApiKey', 'googleApiKey', 'anthropicApiKey'], (result) => {
      const provider = result.aiProvider || 'openai';
      const radio = document.querySelector(`input[name="aiProvider"][value="${provider}"]`);
      if (radio) radio.checked = true;
      aiApiKeyLabel.textContent = providerLabelMap[provider] || 'API Key';

      const apiKey = result[providerKeyMap[provider]] || '';
      const savedModel = result.aiModel;

      // Load models from storage first
      loadModelsFromStorage(provider).then((storedModels) => {
        updateModelDropdownWithFetched(provider, storedModels);

        // If no models and no API key, show placeholder
        if (!apiKey && storedModels.length === 0) {
          populateModelDropdown(provider, null, true); // true = show placeholder
          return;
        }

        // If API key exists but no stored models, show placeholder while fetching
        if (apiKey && storedModels.length === 0) {
          populateModelDropdown(provider, null, true); // true = show placeholder
          fetchModelsForProvider(provider, apiKey)
            .then((fetchedModels) => {
              updateModelDropdownWithFetched(provider, fetchedModels);
              populateModelDropdown(provider, null, true); // true = show placeholder if still empty
              showMsg('aiSettingsUpdatedMsg', 'Models updated from API', false, 2000);
            })
            .catch((error) => {
              console.error('Failed to fetch models:', error);
              showMsg('aiSettingsUpdatedMsg', 'Models not updated: ' + error.message, true, 4000);
            });
          return;
        }

        populateModelDropdown(provider, savedModel);
      });
    });
  }

  loadAiSettingsFromStorage();

  providerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const provider = radio.value;
      aiApiKeyLabel.textContent = providerLabelMap[provider] || 'API Key';

      // Get API key for this provider
      chrome.storage.sync.get([providerKeyMap[provider]], (result) => {
        const apiKey = result[providerKeyMap[provider]] || '';

        // Load models from storage for this provider
        loadModelsFromStorage(provider).then((storedModels) => {
          updateModelDropdownWithFetched(provider, storedModels);

          // If no models and no API key, show placeholder
          if (!apiKey && storedModels.length === 0) {
            populateModelDropdown(provider, null, true); // true = show placeholder
            return;
          }

          // If models exist, show dropdown with placeholder if empty
          populateModelDropdown(provider, null, true); // true = show placeholder if empty

          // If API key exists but no stored models, fetch them
          if (apiKey && storedModels.length === 0) {
            fetchModelsForProvider(provider, apiKey)
              .then((fetchedModels) => {
                updateModelDropdownWithFetched(provider, fetchedModels);
                populateModelDropdown(provider, null);
              })
              .catch((error) => {
                console.error('Failed to fetch models:', error);
              });
          }
        });
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

      // Fetch latest models from the API if we have a key
      if (apiKey) {
        fetchModelsForProvider(selectedProvider, apiKey)
          .then((fetchedModels) => {
            updateModelDropdownWithFetched(selectedProvider, fetchedModels);
            populateModelDropdown(selectedProvider, currentAiModel);
            showMsg('aiSettingsUpdatedMsg', 'Models updated from API', false, 2000);
          })
          .catch((error) => {
            console.error('Failed to fetch models:', error);
            // Show error message but don't block - key was saved successfully
            showMsg('aiSettingsUpdatedMsg', 'Models not updated: ' + error.message, true, 4000);
          });
      }
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

  insertNoteButton.addEventListener('click', () => {
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

  copyNoteButton.addEventListener('click', () => {
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
          { target: { tabId: activeTab.id }, files: ['functions/autotask/templateManager.js'] },
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
