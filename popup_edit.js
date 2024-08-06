document.addEventListener('DOMContentLoaded', () => {
    const templatesContainer = document.getElementById('templatesContainer');
    const saveTemplatesButton = document.getElementById('saveTemplates');
  
    // Load existing templates from storage
    chrome.storage.sync.get(['templates'], (result) => {
      const templates = result.templates || {};
  
      // Populate only existing templates
      Object.keys(templates).forEach((key, index) => {
        const templateName = key; // Using key as the default name
        const templateContent = templates[key];
        addTemplateGroup(templateName, templateContent);
      });
  
      // If no templates exist, create one empty template for the user to start with
      if (Object.keys(templates).length === 0) {
        addTemplateGroup('Template 1', '');
      }
  
      renumberTemplates(); // Ensure numbering is correct and "+" is in place
    });
  
    // Function to add a new template group with name and content
    function addTemplateGroup(name, content) {
      const templateCount = templatesContainer.children.length + 1;
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
  
      // Attach event listener to remove button
      const removeButton = templateGroup.querySelector('.remove-template-btn');
      removeButton.addEventListener('click', () => {
        templateGroup.remove();
        renumberTemplates();
      });
  
      // If this is the last template, add the "+" button
      renumberTemplates();
    }
  
    // Function to renumber templates and ensure only the last one has the add button
    function renumberTemplates() {
      const templateGroups = templatesContainer.querySelectorAll('.template-group');
      templateGroups.forEach((group, index) => {
        // Remove any existing add buttons
        const existingAddButton = group.querySelector('.add-template-btn');
        if (existingAddButton) existingAddButton.remove();
  
        // If this is the last template, add the "+" button
        if (index === templateGroups.length - 1) {
          const addButton = document.createElement('button');
          addButton.className = 'add-template-btn';
          addButton.textContent = '+';
          addButton.addEventListener('click', () => {
            const newTemplateId = `Template ${templatesContainer.children.length + 1}`;
            addTemplateGroup(newTemplateId, '');
            renumberTemplates(); // Reapply renumbering to ensure the new last template has the "+" button
          });
          group.appendChild(addButton);
        }
      });
    }
  
    // Save all templates
    saveTemplatesButton.addEventListener('click', () => {
      const templates = {};
      const templateGroups = templatesContainer.querySelectorAll('.template-group');
      templateGroups.forEach((group, index) => {
        const templateName = group.querySelector('.template-name').value.trim();
        const templateContent = group.querySelector('textarea').value.trim();
        if (templateName !== '' && templateContent !== '') { // Only save non-empty templates
          templates[templateName] = templateContent;
        }
      });
  
      chrome.storage.sync.set({ templates }, () => {
        alert('Templates saved successfully!');
        updateDropdown(templates); // Update the dropdown with new templates
        window.close(); // Close the popup after saving
      });
    });
  
    // Update dropdown in the main popup with the new templates
    function updateDropdown(templates) {
      chrome.runtime.sendMessage({ action: 'updateDropdown' });
    }
  });
  