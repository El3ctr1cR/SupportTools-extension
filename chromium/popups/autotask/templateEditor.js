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
      addTemplateGroup('Template 1', '', 'Select ticket status', '');
    } else {
      templateKeys.forEach((key) => {
        const value = templates[key];
        if (typeof value === 'string') {
          addTemplateGroup(key, value, 'Select ticket status', '');
        } else if (value && typeof value === 'object') {
          addTemplateGroup(key, value.content || '', value.status || 'Select ticket status', value.hotkey || '');
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
              availableStatuses = statuses;
              chrome.storage.sync.set({ autotaskStatuses: statuses }, () => {
                refreshAllStatusDropdowns(statuses);
              });
            } else {
              alert('No ticket statuses found. Make sure to open a time entry or note before clicking this button');
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
        if (statuses.includes(oldValue)) statusSelect.value = oldValue;
      }
    });
  }

  function formatHotkey(e) {
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

  function attachHotkeyRecorder(input) {
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

      const combo = formatHotkey(e);
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

  function addTemplateGroup(templateName, templateContent, templateStatus, templateHotkey) {
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

    // Hotkey row
    const hotkeyRow = document.createElement('div');
    hotkeyRow.className = 'hotkey-row';

    const hotkeyInput = document.createElement('input');
    hotkeyInput.type = 'text';
    hotkeyInput.className = 'hotkey-input';
    hotkeyInput.readOnly = true;
    hotkeyInput.value = templateHotkey || '';
    hotkeyInput.placeholder = 'Click to record hotkey...';
    hotkeyInput.title = 'Click, then press a key combo (must include a modifier: Ctrl, Alt, Shift). Escape to cancel.';
    attachHotkeyRecorder(hotkeyInput);

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
      if (addBtn) addBtn.remove();

      if (index === groups.length - 1) {
        const newAddBtn = document.createElement('button');
        newAddBtn.className = 'add-template-btn';
        newAddBtn.textContent = '+';
        newAddBtn.addEventListener('click', () => {
          addTemplateGroup(`Template ${groups.length + 1}`, '', 'Select ticket status', '');
          renumberTemplates();
        });
        templateActions.appendChild(newAddBtn);
      }
    });
  }

  saveTemplatesButton.addEventListener('click', () => {
    const templateGroups = templatesContainer.querySelectorAll('.template-group');
    const newTemplates = {};
    const usedHotkeys = {};
    let duplicateFound = false;

    templateGroups.forEach((group) => {
      const hotkey = group.querySelector('.hotkey-input').value.trim();
      const name = group.querySelector('.template-name').value.trim();
      if (hotkey) {
        if (usedHotkeys[hotkey]) {
          alert(`Duplicate hotkey "${hotkey}" on "${usedHotkeys[hotkey]}" and "${name}". Each hotkey must be unique.`);
          duplicateFound = true;
        }
        usedHotkeys[hotkey] = name;
      }
    });

    if (duplicateFound) return;

    templateGroups.forEach((group) => {
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
      alert('Templates saved successfully!');
      chrome.runtime.sendMessage({ action: 'updateDropdown' });
      window.close();
    });
  });
});