document.addEventListener('DOMContentLoaded', () => {
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

  const urlMappingsButton = document.getElementById('urlMappingsButton');
  const summarizeButton = document.getElementById('summarizeTicket');
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
  const inAppIframesOutsideTicketToggle = document.getElementById('inAppIframesOutsideTicketToggle');
  const inAppIframesInsideTicketToggle = document.getElementById('inAppIframesInsideTicketToggle');
  const incognitoToggle = document.getElementById('incognitoToggle');
  const itglueOtpToggle = document.getElementById('itglueOtpToggle');
  const dattoStretchToggle = document.getElementById('dattoStretchToggle');
  const itgluePasswordCacheToggle = document.getElementById('itgluePasswordCacheToggle');
  const itgluePasswordCacheClearBtn = document.getElementById('itgluePasswordCacheClearBtn');
  const inputMailButton = document.getElementById('inputMail');
  const copyMailButton = document.getElementById('copyMail');
  const editTemplatesButton = document.getElementById('editTemplates');
  const clearConfigButton = document.getElementById('clearConfig');
  const exportConfigButton = document.getElementById('exportConfig');
  const importConfigButton = document.getElementById('importConfig');
  const importFileInput = document.getElementById('importFile');
  const hexBase32GenButton = document.getElementById('hexBase32Gen');
  const dropdownButton = document.getElementById('dropdownButton');
  const dropdownContent = document.getElementById('dropdownContent');
  const selectedFlag = document.getElementById('selectedFlag');
  const selectedLanguageText = document.getElementById('selectedLanguageText');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const templateDropdownButton = document.getElementById('templateDropdownButton');
  const templateDropdownContent = document.getElementById('templateDropdownContent');
  const selectedTemplateText = document.getElementById('selectedTemplateText');
  const ticketHistoryList = document.getElementById('ticketHistoryList');

  function loadTicketHistory() {
    chrome.storage.sync.get(['ticketHistory'], (res) => {
      const history = res.ticketHistory || [];
      history.sort((a, b) => b.timestamp - a.timestamp);
      ticketHistoryList.innerHTML = '';
      history.slice(0, 30).forEach((entry) => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        li.style.fontSize = '12px';
        li.style.wordBreak = 'break-all';
        li.style.display = 'flex';
        li.style.flexDirection = 'column';
        const historyItemContainer = document.createElement('div');
        historyItemContainer.className = 'history-password-container';
        const link = document.createElement('a');
        link.textContent = entry.displayText || '(Unknown)';
        link.href = '#';
        link.style.color = '#5bc0de';
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
  loadTicketHistory();

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.id === 'tabAutotask') {
        loadTicketHistory();
      }
    });
  });

  function handleAiAction(action, popupHtml, contentSelector) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.storage.local.set({ activeTabId: activeTab.id }, () => {
        console.log('Tab ID saved:', activeTab.id);
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: (selector) => !!document.querySelector(selector),
            args: [contentSelector],
          },
          (results) => {
            if (chrome.runtime.lastError || !results || !results[0].result) {
              showMsg('aiActionMsg', 'No ticket content found on the page.');
              return;
            }
            const aiPopup = window.open(popupHtml, 'AI Task', 'width=1200,height=1200');
            aiPopup.onload = function () {
              aiPopup.postMessage({ loading: true }, '*');
            };
            chrome.scripting.executeScript(
              {
                target: { tabId: activeTab.id },
                files: ['functions/aiTaskHandler.js']
              },
              () => {
                chrome.tabs.sendMessage(activeTab.id, { action }, (response) => {
                  if (response && response.summary) {
                    aiPopup.postMessage({ loading: false, summary: response.summary }, '*');
                  } else {
                    showMsg('aiActionMsg', 'Failed to handle AI action.');
                  }
                });
              }
            );
          }
        );
      });
    });
  }

  summarizeButton.addEventListener('click', () =>
    handleAiAction('summarizeTicket', '../popups/autotask/ticketSummary.html', '.Normal.Section .ContentContainer .Content')
  );

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

  chrome.storage.sync.get(['inAppIframesOutsideTicket'], (result) => {
    inAppIframesOutsideTicketToggle.checked = result.inAppIframesOutsideTicket || false;
  });

  chrome.storage.sync.get(['inAppIframesInsideTicket'], (result) => {
    inAppIframesInsideTicketToggle.checked = result.inAppIframesInsideTicket || false;
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

  inAppIframesOutsideTicketToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ inAppIframesOutsideTicket: inAppIframesOutsideTicketToggle.checked }, () => {
      console.log('Open Tickets in Iframe setting updated:', inAppIframesOutsideTicketToggle.checked);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleInAppIframesOutsideTicket',
        enabled: inAppIframesOutsideTicketToggle.checked,
      });
    });
  });

  inAppIframesInsideTicketToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ inAppIframesInsideTicket: inAppIframesInsideTicketToggle.checked }, () => {
      console.log('Open Tickets in Iframe setting updated:', inAppIframesInsideTicketToggle.checked);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleInAppIframesInsideTicket',
        enabled: inAppIframesInsideTicketToggle.checked,
      });
    });
  });

  hexBase32GenButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('../popups/misc/hexBase32Gen.html'),
      type: 'popup',
      width: 470,
      height: 420
    });
  });

  urlMappingsButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('../popups/misc/urlMappingEditor.html'),
      type: 'popup',
      width: 580,
      height: 580
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

  editTemplatesButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs.length) {
        showMsg('templateMsg', "No active tab found. Make sure you're on an Autotask ticket page.");
        return;
      }
      const activeTabId = tabs[0].id;

      chrome.storage.local.set({ autotaskTabId: activeTabId }, () => {
        console.log("Stored Autotask tab ID:", activeTabId);
        chrome.windows.create({
          url: chrome.runtime.getURL('../popups/autotask/templateEditor.html'),
          type: 'popup',
          width: 620,
          height: 1035
        });
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
      return md
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]*?<\/li>)(\n(?!<li>)|$)/g, (m) => '<ul>' + m + '</ul>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/^(?!<[hup])(.+)$/gm, (line) => line.trim() ? line : '')
        .replace(/^([^<\n].+)$/gm, (line) => {
          if (!line.startsWith('<')) return '<p>' + line + '</p>';
          return line;
        })
        .trim();
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