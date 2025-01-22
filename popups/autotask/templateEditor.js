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
    adjustTemplateContainerHeight();
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
    adjustTemplateContainerHeight();
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

    templateGroup.innerHTML = `
      <div class="textarea-container">
        <input type="text" value="${templateName}" class="template-name" placeholder="Enter template name...">
        <textarea placeholder="Enter template content...">${templateContent}</textarea>
      </div>
      <button class="remove-template-btn">-</button>
    `;

    const container = templateGroup.querySelector('.textarea-container');
    const statusSelect = document.createElement('select');
    availableStatuses.forEach((st) => {
      const option = document.createElement('option');
      option.value = st;
      option.textContent = st;
      statusSelect.appendChild(option);
    });
    statusSelect.value = templateStatus;
    container.appendChild(statusSelect);

    templatesContainer.appendChild(templateGroup);

    const removeButton = templateGroup.querySelector('.remove-template-btn');
    removeButton.addEventListener('click', () => {
      templateGroup.remove();
      renumberTemplates();
      adjustTemplateContainerHeight();
    });
  }

  function renumberTemplates() {
    const templateGroups = templatesContainer.querySelectorAll('.template-group');
    templateGroups.forEach((group, index) => {
      const existingAddBtn = group.querySelector('.add-template-btn');
      if (existingAddBtn) existingAddBtn.remove();

      if (index === templateGroups.length - 1) {
        const addBtn = document.createElement('button');
        addBtn.className = 'add-template-btn';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
          const newName = `Template ${templatesContainer.children.length + 1}`;
          addTemplateGroup(newName, '', 'None');
          renumberTemplates();
          adjustTemplateContainerHeight();
        });
        group.appendChild(addBtn);
      }
    });
  }

  function adjustTemplateContainerHeight() {
    const windowHeight = window.innerHeight;
    const variableListHeight = variableList.style.display !== 'none' ? variableList.scrollHeight : 0;
    const footerHeight = document.querySelector('.footer').offsetHeight;
    const remainingHeight = windowHeight - variableListHeight - footerHeight - 100;
    templatesContainer.style.height = `${remainingHeight}px`;
  }

  window.addEventListener('resize', adjustTemplateContainerHeight);

  // Save Templates
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
