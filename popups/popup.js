document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const contentSections = document.querySelectorAll('.content');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      contentSections.forEach(section => section.style.display = 'none');
      contentSections[index].style.display = 'block';
    });
  });

  const summarizeButton = document.getElementById('summarizeTicket');
  const setApiKeyButton = document.getElementById('setApiKey');
  const warningContainer = document.getElementById('warningContainer');
  const updateButton = document.getElementById('updateButton');
  const versionText = document.getElementById('versionText');
  const warningText = document.getElementById('warningText'); // Get the warning text element
  const bypassToggle = document.getElementById('bypassToggle');
  const inputMailButton = document.getElementById('inputMail');
  const copyMailButton = document.getElementById('copyMail');
  const editTemplatesButton = document.getElementById('editTemplates');
  const templateSelector = document.getElementById('templateSelector');
  const clearConfigButton = document.getElementById('clearConfig');
  const exportConfigButton = document.getElementById('exportConfig');
  const importConfigButton = document.getElementById('importConfig');
  const importFileInput = document.getElementById('importFile');
  const hexBase32GenButton = document.getElementById('hexBase32Gen');

  hexBase32GenButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popups/hexBase32Gen.html'),
      type: 'popup',
      width: 600,
      height: 320
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

  summarizeButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: () => !!document.querySelector('.Normal.Section .ContentContainer .Content'),
        },
        (results) => {
          if (chrome.runtime.lastError || !results || !results[0].result) {
            alert('No ticket content found on the page.');
            return;
          }
          const summaryPopup = window.open('ticketSummary.html', 'Summarize Ticket', 'width=1200,height=1200');
          summaryPopup.onload = function () {
            summaryPopup.postMessage({ loading: true }, '*');
          };
          chrome.scripting.executeScript(
            {
              target: { tabId: activeTab.id },
              files: ['functions/AI.js']
            },
            () => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'summarizeTicket' }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error('Error sending message:', chrome.runtime.lastError);
                  alert('Could not connect to the content script.');
                } else if (response && response.summary) {
                  summaryPopup.postMessage({ loading: false, summary: response.summary }, '*');
                } else {
                  alert('Failed to summarize the ticket.');
                }
              });
            }
          );
        }
      );
    });
  });

  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => response.json())
    .then(manifest => {
      const currentVersion = manifest.version;
      versionText.textContent = `Version ${currentVersion}`;

      fetch('https://api.github.com/repos/El3ctr1cR/SupportTools-extension/releases/latest')
        .then(response => response.json())
        .then(latestRelease => {
          const latestVersion = latestRelease.tag_name.replace('v', '');

          if (currentVersion !== latestVersion) {
            warningText.textContent = `Version ${latestVersion} is available for download`; // Set the dynamic version text
            warningContainer.style.display = 'flex';
          }
        });
    });

  updateButton.addEventListener('click', () => {
    window.open('https://github.com/El3ctr1cR/SupportTools-extension/releases/latest', '_blank');
  });

  chrome.storage.sync.get(['bypassIncognito', 'templates'], (result) => {
    bypassToggle.checked = result.bypassIncognito || false;

    const templates = result.templates || {};
    populateTemplateDropdown(templates);
  });

  function populateTemplateDropdown(templates) {
    templateSelector.innerHTML = '';
    Object.keys(templates).forEach((key) => {
      if (templates[key].trim() !== '') {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key;
        templateSelector.appendChild(option);
      }
    });
  }

  bypassToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ bypassIncognito: bypassToggle.checked });
  });

  inputMailButton.addEventListener('click', () => {
    const selectedTemplate = templateSelector.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['functions/templateManager.js']
        },
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
    const selectedTemplateName = templateSelector.value;
    chrome.storage.sync.get(['templates'], (result) => {
      const templates = result.templates || {};
      const selectedTemplateContent = templates[selectedTemplateName];

      if (selectedTemplateContent) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];

          chrome.scripting.executeScript(
            {
              target: { tabId: activeTab.id },
              files: ['functions/templateManager.js']
            },
            () => {
              chrome.tabs.sendMessage(activeTab.id, { action: 'getTicketDetails' }, (response) => {
                if (response) {
                  chrome.tabs.sendMessage(activeTab.id, {
                    action: 'processTemplate',
                    template: selectedTemplateContent,
                    ticketDetails: response
                  }, (response) => {
                    if (response && response.processedText) {
                      navigator.clipboard.writeText(response.processedText).then(() => {
                        console.log('Email text copied to clipboard');
                      }).catch(err => {
                        console.error('Failed to copy text: ', err);
                      });
                    } else {
                      alert('Failed to process the template.');
                    }
                  });
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
    chrome.windows.create({
      url: chrome.runtime.getURL('popups/templateEditor.html'),
      type: 'popup',
      width: 620,
      height: 1035
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
