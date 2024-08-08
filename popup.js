document.addEventListener('DOMContentLoaded', () => {
  const warningContainer = document.getElementById('warningContainer');
  const updateButton = document.getElementById('updateButton');
  const versionText = document.getElementById('versionText');
  const bypassToggle = document.getElementById('bypassToggle');
  const backupCheckButton = document.getElementById('backupCheck');
  const inputMailButton = document.getElementById('inputMail');
  const copyMailButton = document.getElementById('copyMail');
  const editTemplatesButton = document.getElementById('editTemplates');
  const templateSelector = document.getElementById('templateSelector');
  const clearConfigButton = document.getElementById('clearConfig');
  const exportConfigButton = document.getElementById('exportConfig');
  const importConfigButton = document.getElementById('importConfig');
  const importFileInput = document.getElementById('importFile');

  // Fetch the version from manifest.json
  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => response.json())
    .then(manifest => {
      const currentVersion = manifest.version;
      versionText.textContent = `Version ${currentVersion}`;
      
      // Fetch the latest version from GitHub
      fetch('https://api.github.com/repos/El3ctr1cR/SupportTools-extension/releases/latest')
        .then(response => response.json())
        .then(latestRelease => {
          const latestVersion = latestRelease.tag_name.replace('v', '');
          
          if (currentVersion !== latestVersion) {
            warningContainer.style.display = 'flex';
          }
        });
    });

  updateButton.addEventListener('click', () => {
    window.open('https://github.com/El3ctr1cR/SupportTools-extension/releases/latest', '_blank');
  });

  // Load settings and templates
  chrome.storage.sync.get(['bypassIncognito', 'templates'], (result) => {
    bypassToggle.checked = result.bypassIncognito || false;

    // Populate the dropdown with saved templates
    const templates = result.templates || {};
    populateTemplateDropdown(templates);
  });

  function populateTemplateDropdown(templates) {
    templateSelector.innerHTML = ''; // Clear existing options
    Object.keys(templates).forEach((key) => {
      if (templates[key].trim() !== '') { // Only add non-empty templates
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key; // Use the template name directly
        templateSelector.appendChild(option);
      }
    });
  }

  bypassToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ bypassIncognito: bypassToggle.checked });
  });

  backupCheckButton.addEventListener('click', () => {
    const urls = ['https://manage.altaro.com', 'https://backup.management', 'https://portal.dattobackup.com'];
    urls.forEach(url => chrome.tabs.create({ url }));
  });

  inputMailButton.addEventListener('click', () => {
    const selectedTemplate = templateSelector.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['content.js']
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
    const selectedTemplate = templateSelector.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ['content.js']
        },
        () => {
          chrome.tabs.sendMessage(activeTab.id, { action: 'getTicketDetails' }, (response) => {
            if (response) {
              const {
                loggedinUser,
                ticketContact,
                ticketPrimaryResource,
                ticketLastActivityTime,
                ticketPriority,
                ticketCurrentStatus,
                ticketNewStatus,
              } = response;

              chrome.storage.sync.get(['templates'], (result) => {
                const templates = result.templates || {};
                let emailText = templates[selectedTemplate];

                if (emailText) {
                  emailText = emailText
                    .replace('${loggedinUser}', loggedinUser)
                    .replace('${ticketContact}', ticketContact)
                    .replace('${ticketPrimaryResource}', ticketPrimaryResource)
                    .replace('${ticketLastActivityTime}', ticketLastActivityTime)
                    .replace('${ticketPriority}', ticketPriority)
                    .replace('${ticketCurrentStatus}', ticketCurrentStatus)
                    .replace('${ticketNewStatus}', ticketNewStatus);

                  navigator.clipboard.writeText(emailText).then(() => { }).catch(err => {
                    console.error('Failed to copy text: ', err);
                  });
                } else {
                  alert('Template not found!');
                }
              });
            } else {
              alert('Failed to retrieve ticket details.');
            }
          });
        }
      );
    });
  });

  editTemplatesButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup_edit.html'),
      type: 'popup',
      width: 550,
      height: 1000
    });
  });

  clearConfigButton.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to reset the config? This action cannot be undone.');
    if (confirmed) {
      chrome.storage.sync.clear(() => {
        alert('Configuration cleared!');
        populateTemplateDropdown({}); // Clear the dropdown
      });
    }
  });

  // Handle configuration export
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

  // Handle configuration import
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

  // Listen for messages to update the dropdown
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateDropdown') {
      chrome.storage.sync.get(['templates'], (result) => {
        const templates = result.templates || {};
        populateTemplateDropdown(templates);
      });
    }
  });
});