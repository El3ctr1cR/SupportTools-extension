document.addEventListener('DOMContentLoaded', () => {
  const templatesContainer = document.getElementById('templatesContainer');
  const saveTemplatesButton = document.getElementById('saveTemplates');
  const toggleVariablesButton = document.getElementById('toggleVariables');
  const variableList = document.getElementById('variableList');

  toggleVariablesButton.addEventListener('click', () => {
    if (variableList.style.maxHeight === '0px' || variableList.style.maxHeight === '') {
      variableList.style.maxHeight = variableList.scrollHeight + 'px';
      toggleVariablesButton.textContent = 'Hide usable variables';
    } else {
      variableList.style.maxHeight = '0px';
      toggleVariablesButton.textContent = 'Show usable variables';
    }
  });

  chrome.storage.sync.get(['templates'], (result) => {
    const templates = result.templates || {};

    Object.keys(templates).forEach((key) => {
      const templateName = key;
      const templateContent = templates[key];
      addTemplateGroup(templateName, templateContent);
    });

    if (Object.keys(templates).length === 0) {
      addTemplateGroup('Template 1', '');
    }

    renumberTemplates();
  });

  function addTemplateGroup(name, content) {
    const templateGroup = document.createElement('div');
    templateGroup.className = 'template-group';
    templateGroup.innerHTML = `
      <div class="textarea-container">
        <input type="text" value="${name}" class="template-name" placeholder="Enter template name...">
        <textarea placeholder="Enter template content...">${content}</textarea>
      </div>
      <button class="remove-template-btn">-</button>
    `;

    templatesContainer.appendChild(templateGroup);

    const removeButton = templateGroup.querySelector('.remove-template-btn');
    removeButton.addEventListener('click', () => {
      templateGroup.remove();
      renumberTemplates();
    });

    renumberTemplates();
  }

  function renumberTemplates() {
    const templateGroups = templatesContainer.querySelectorAll('.template-group');
    templateGroups.forEach((group, index) => {
      const existingAddButton = group.querySelector('.add-template-btn');
      if (existingAddButton) existingAddButton.remove();

      if (index === templateGroups.length - 1) {
        const addButton = document.createElement('button');
        addButton.className = 'add-template-btn';
        addButton.textContent = '+';
        addButton.addEventListener('click', () => {
          const newTemplateId = `Template ${templatesContainer.children.length + 1}`;
          addTemplateGroup(newTemplateId, '');
          renumberTemplates();
        });
        group.appendChild(addButton);
      }
    });
  }

  saveTemplatesButton.addEventListener('click', () => {
    const templates = {};
    const templateGroups = templatesContainer.querySelectorAll('.template-group');
    templateGroups.forEach((group) => {
      const templateName = group.querySelector('.template-name').value.trim();
      const templateContent = group.querySelector('textarea').value.trim();
      if (templateName !== '' && templateContent !== '') {
        templates[templateName] = templateContent;
      }
    });

    chrome.storage.sync.set({ templates }, () => {
      alert('Templates saved successfully!');
      updateDropdown(templates);
      window.close();
    });
  });

  function updateDropdown(templates) {
    chrome.runtime.sendMessage({ action: 'updateDropdown' });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const manifestData = chrome.runtime.getManifest();
  const versionText = document.getElementById('versionText');
  versionText.textContent = `Version ${manifestData.version}`;
});