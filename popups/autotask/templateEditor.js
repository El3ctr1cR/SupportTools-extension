document.addEventListener('DOMContentLoaded', () => {
  const templatesContainer = document.getElementById('templatesContainer');
  const saveTemplatesButton = document.getElementById('saveTemplates');
  const toggleVariablesButton = document.getElementById('toggleVariables');
  const variableList = document.getElementById('variableList');
  const getAllStatusesBtn = document.getElementById('getAllStatusesBtn');
  const manifestData = chrome.runtime.getManifest();
  const versionText = document.getElementById('versionText');

  versionText.textContent = `Version ${manifestData.version}`;

  variableList.style.display = 'none';
  toggleVariablesButton.textContent = 'Show usable variables';

  toggleVariablesButton.addEventListener('click', () => {
    if (variableList.style.display === 'none' || variableList.style.display === '') {
      variableList.style.display = 'block';
      toggleVariablesButton.textContent = 'Hide usable variables';
    } else {
      variableList.style.display = 'none';
      toggleVariablesButton.textContent = 'Show usable variables';
    }
  });

  let availableStatuses = [];

  chrome.storage.sync.get(['autotaskStatuses', 'templates'], (res) => {
    availableStatuses = res.autotaskStatuses || ['Select ticket status'];
    const templates = res.templates || {};

    const templateKeys = Object.keys(templates);
    if (templateKeys.length === 0) {
      addTemplateGroup('Template 1', '', 'Select ticket status');
    } else {
      templateKeys.forEach((key) => {
        const value = templates[key];
        if (typeof value === 'string') {
          addTemplateGroup(key, value, 'Select ticket status');
        } else if (value && typeof value === 'object') {
          addTemplateGroup(key, value.content || '', value.status || 'Select ticket status');
        }
      });
    }

    renumberTemplates();
  });

  getAllStatusesBtn.addEventListener('click', () => {
    chrome.storage.local.get(['autotaskTabId'], (result) => {
      const autoTaskTabId = result.autotaskTabId;
      if (!autoTaskTabId) {
        alert('No Autotask tab ID found. Please open Template Editor from the Autotask ticket page.');
        return;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: autoTaskTabId },
          files: ['functions/templateManager.js']
        },
        () => {
          chrome.tabs.sendMessage(autoTaskTabId, { action: 'getAllStatuses' }, (response) => {
            if (chrome.runtime.lastError) {
              alert('Error: Could not retrieve statuses. Are you on an Autotask ticket page?');
              return;
            }
            if (response && response.statuses) {
              const unique = Array.from(new Set(response.statuses));
              const statuses = ['Select ticket status', ...unique];
              availableStatuses = statuses;

              chrome.storage.sync.set({ autotaskStatuses: statuses }, () => {
                refreshAllStatusDropdowns(statuses);
              });
            } else {
              alert('No statuses found or unable to retrieve them.');
            }
          });
        }
      );
    });
  });

  function refreshAllStatusDropdowns(statuses) {
    const templateGroups = templatesContainer.querySelectorAll('.template-group');
    templateGroups.forEach((group) => {
      const statusSelect = group.querySelector('select');
      if (statusSelect) {
        const oldValue = statusSelect.value;
        statusSelect.innerHTML = '';
        statuses.forEach((st) => {
          const opt = document.createElement('option');
          opt.value = st;
          opt.textContent = st;
          statusSelect.appendChild(opt);
        });
        if (statuses.includes(oldValue)) {
          statusSelect.value = oldValue;
        }
      }
    });
  }

  function addTemplateGroup(templateName, templateContent, templateStatus) {
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
    availableStatuses.forEach((st) => {
      const option = document.createElement('option');
      option.value = st;
      option.textContent = st;
      statusSelect.appendChild(option);
    });
    statusSelect.value = templateStatus;

    const textArea = document.createElement('textarea');
    textArea.placeholder = 'Enter template content...';
    textArea.value = templateContent;

    templateBox.appendChild(nameInput);
    templateBox.appendChild(statusSelect);
    templateBox.appendChild(textArea);

    const templateActions = document.createElement('div');
    templateActions.className = 'template-actions';

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-template-btn';
    removeButton.textContent = '-';
    removeButton.addEventListener('click', () => {
      templateGroup.remove();
      renumberTemplates();
    });
    templateActions.appendChild(removeButton);

    templateGroup.appendChild(templateBox);
    templateGroup.appendChild(templateActions);

    templatesContainer.appendChild(templateGroup);
  }

  function renumberTemplates() {
    const groups = templatesContainer.querySelectorAll('.template-group');
    groups.forEach((group, index) => {
      const templateActions = group.querySelector('.template-actions');
      const addBtn = templateActions.querySelector('.add-template-btn');
      if (addBtn) {
        addBtn.remove();
      }

      if (index === groups.length - 1) {
        const newAddBtn = document.createElement('button');
        newAddBtn.className = 'add-template-btn';
        newAddBtn.textContent = '+';
        newAddBtn.addEventListener('click', () => {
          const newName = `Template ${groups.length + 1}`;
          addTemplateGroup(newName, '', 'Select ticket status');
          renumberTemplates();
        });
        templateActions.appendChild(newAddBtn);
      }
    });
  }

  saveTemplatesButton.addEventListener('click', () => {
    const templateGroups = templatesContainer.querySelectorAll('.template-group');
    const newTemplates = {};

    templateGroups.forEach((group) => {
      const templateName = group.querySelector('.template-name').value.trim();
      const templateContent = group.querySelector('textarea').value.trim();
      const statusSelect = group.querySelector('select');
      const chosenStatus = statusSelect ? statusSelect.value : 'Select ticket status';

      if (templateName && templateContent) {
        newTemplates[templateName] = {
          content: templateContent,
          status: chosenStatus
        };
      }
    });

    chrome.storage.sync.set({ templates: newTemplates }, () => {
      alert('Templates saved successfully!');
      chrome.runtime.sendMessage({ action: 'updateDropdown' });
      window.close();
    });
  });
});
