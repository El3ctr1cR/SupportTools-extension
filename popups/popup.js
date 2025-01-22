document.addEventListener('DOMContentLoaded', () => {
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
    if (radioPassphrase.checked) {
      lowercaseRow.style.display = 'none';
      uppercaseRow.style.display = 'none';
      numbersRow.style.display = 'none';
      symbolsRow.style.display = 'none';
    } else {
      lowercaseRow.style.display = 'flex';
      uppercaseRow.style.display = 'flex';
      numbersRow.style.display = 'flex';
      symbolsRow.style.display = 'flex';
    }
  }

  const urlMappingsButton = document.getElementById('urlMappingsButton');
  const summarizeButton = document.getElementById('summarizeTicket');
  const grammarCheckButton = document.getElementById('grammarCheck');
  const setApiKeyButton = document.getElementById('setApiKey');
  const versionText = document.getElementById('versionText');
  const openTicketButtonToggle = document.getElementById('openTicketButtonToggle');
  const incognitoToggle = document.getElementById('incognitoToggle');
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
          const protocol = window.location.protocol;
          const host = 'ww19.autotask.net';
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
              alert('No ticket content found on the page.');
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
                    alert('Failed to handle AI action.');
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

  grammarCheckButton.addEventListener('click', () => {
    loadingOverlay.style.display = 'flex';
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['functions/aiTaskHandler.js']
        },
        () => {
          chrome.tabs.sendMessage(activeTab.id, { action: 'grammarCheck' }, (response) => {
            loadingOverlay.style.display = 'none';
            if (response && response.success) {
              console.log('Grammar check completed successfully');
            } else {
              alert('Failed to perform grammar check' + (response && response.error ? ': ' + response.error : ''));
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

  chrome.storage.sync.get(['selectedLanguage'], (result) => {
    const language = result.selectedLanguage || 'nl';
    updateDropdownSelection(language);
  });

  dropdownButton.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

  dropdownContent.addEventListener('click', (event) => {
    const selectedItem = event.target.closest('.dropdown-item');
    if (selectedItem) {
      const selectedValue = selectedItem.getAttribute('data-value');
      updateDropdownSelection(selectedValue);
      chrome.storage.sync.set({ selectedLanguage: selectedValue }, () => {
        console.log(`Language preference saved: ${selectedValue}`);
      });
      dropdownContent.classList.remove('show');
    }
  });

  window.addEventListener('click', (event) => {
    if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.classList.remove('show');
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

  hexBase32GenButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('../popups/misc/hexBase32Gen.html'),
      type: 'popup',
      width: 600,
      height: 320
    });
  });

  urlMappingsButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('../popups/misc/urlMappingEditor.html'),
      type: 'popup',
      width: 620,
      height: 1035
    });
  });

  setApiKeyButton.addEventListener('click', () => {
    const apiKey = prompt('Enter your OpenAI API key:');
    if (apiKey) {
      chrome.storage.sync.set({ openAiApiKey: apiKey }, () => {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'apiKeyUpdated' });
          });
        });
      });
    }
  });

  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => response.json())
    .then(manifest => {
      const currentVersion = manifest.version;
      versionText.textContent = `Version ${currentVersion}`;
    });

  chrome.storage.sync.get(['incognitoRedirection', 'templates'], (result) => {
    incognitoToggle.checked = result.incognitoRedirection || false;

    const templates = result.templates || {};
    populateTemplateDropdown(templates);
  });

  function populateTemplateDropdown(templates) {
    templateDropdownContent.innerHTML = '';
  
    Object.keys(templates).forEach((key) => {
      // Handle both old and new template formats
      let templateContent = '';
      const templateValue = templates[key];
  
      if (typeof templateValue === 'string') {
        // Old-style string template
        templateContent = templateValue.trim();
      } else if (typeof templateValue === 'object' && templateValue !== null) {
        // New-style object { content, status }
        templateContent = (templateValue.content || '').trim();
      }
  
      // If the content is NOT empty, display it in the dropdown
      if (templateContent !== '') {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.setAttribute('data-value', key);
        dropdownItem.textContent = key;
  
        dropdownItem.addEventListener('click', () => {
          selectedTemplateText.textContent = key;
          templateDropdownContent.classList.remove('show');
  
          chrome.storage.sync.set({ lastSelectedTemplate: key }, () => {
            console.log(`Last selected template saved: ${key}`);
          });
        });
  
        templateDropdownContent.appendChild(dropdownItem);
      }
    });
  }  

  templateDropdownButton.addEventListener('click', () => {
    templateDropdownContent.classList.toggle('show');
  });

  window.addEventListener('click', (event) => {
    if (!templateDropdownButton.contains(event.target) && !templateDropdownContent.contains(event.target)) {
      templateDropdownContent.classList.remove('show');
    }
  });

  chrome.storage.sync.get(['templates'], (result) => {
    const templates = result.templates || {};
    populateTemplateDropdown(templates);
  });

  incognitoToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ incognitoRedirection: incognitoToggle.checked });
  });

  inputMailButton.addEventListener('click', () => {
    const selectedTemplate = document.getElementById('selectedTemplateText').textContent;
    if (!selectedTemplate || selectedTemplate === 'Select a Template') {
      alert('Please select a template before proceeding.');
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.scripting.executeScript(
        { target: { tabId: activeTab.id }, files: ['functions/templateManager.js'] },
        () => {
          chrome.tabs.sendMessage(activeTab.id, { action: 'getEmailText', template: selectedTemplate }, (response) => {
            if (response && response.success) {
              console.log('Email text inserted successfully');
            } else {
              alert(response && response.message ? response.message : 'Failed to insert email text');
            }
          });
        }
      );
    });
  });

  copyMailButton.addEventListener('click', () => {
    const selectedTemplateName = document.getElementById('selectedTemplateText').textContent;
    if (!selectedTemplateName || selectedTemplateName === 'Select a Template') {
      alert('Please select a template before proceeding.');
      return;
    }

    chrome.storage.sync.get(['templates'], (result) => {
      const templates = result.templates || {};
      const selectedTemplateContent = templates[selectedTemplateName];
      if (selectedTemplateContent) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];

          chrome.scripting.executeScript(
            { target: { tabId: activeTab.id }, files: ['functions/templateManager.js'] },
            () => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'getTicketDetails' }, (response) => {
                if (response) {
                  chrome.tabs.sendMessage(
                    activeTab.id,
                    {
                      action: 'processTemplate',
                      template: selectedTemplateContent,
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
                        alert('Failed to process the template.');
                      }
                    }
                  );
                } else {
                  alert('Failed to retrieve ticket details.');
                }
              });
            }
          );
        });
      } else {
        alert('Template not found!');
      }
    });
  });

  editTemplatesButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs.length) {
        alert("No active tab found. Make sure you're on an Autotask ticket page.");
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
    const confirmed = confirm('Are you sure you want to reset the config? This action cannot be undone.');
    if (confirmed) {
      chrome.storage.sync.clear(() => {
        alert('Configuration cleared!');
        populateTemplateDropdown({});
      });
    }
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
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          chrome.storage.sync.set(importedConfig, () => {
            alert('Configuration imported successfully!');
            populateTemplateDropdown(importedConfig.templates || {});
          });
        } catch (error) {
          alert('Failed to import configuration. Invalid JSON format.');
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
});
