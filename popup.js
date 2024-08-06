document.addEventListener('DOMContentLoaded', () => {
  const bypassToggle = document.getElementById('bypassToggle');
  const backupCheckButton = document.getElementById('backupCheck');
  const inputMailButton = document.getElementById('inputMail');
  const copyMailButton = document.getElementById('copyMail');
  const editTemplatesButton = document.getElementById('editTemplates');
  const templateSelector = document.getElementById('templateSelector');
  const clearConfigButton = document.getElementById('clearConfig');
  const versionText = document.getElementById('versionText');

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

  // Fetch version from manifest.json and display it
  fetch(chrome.runtime.getURL('manifest.json'))
    .then(response => response.json())
    .then(manifest => {
      versionText.textContent += manifest.version;
    });

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
    chrome.storage.sync.get(['templates'], (result) => {
      const templates = result.templates || {};
      const emailText = templates[selectedTemplate];

      if (emailText) {
        navigator.clipboard.writeText(emailText).then(() => {
          alert('Email text copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      } else {
        alert('Template not found!');
      }
    });
  });

  editTemplatesButton.addEventListener('click', () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup_edit.html'),
      type: 'popup',
      width: 550,
      height: 640
    });
  });

  clearConfigButton.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to clear all configurations? This action cannot be undone.');
    if (confirmed) {
      chrome.storage.sync.clear(() => {
        alert('Configuration cleared!');
        populateTemplateDropdown({}); // Clear the dropdown
      });
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
