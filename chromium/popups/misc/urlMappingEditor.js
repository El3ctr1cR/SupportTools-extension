document.addEventListener('DOMContentLoaded', () => {
  const mappingsContainer = document.getElementById('mappingsContainer');
  const saveMappingsButton = document.getElementById('saveMappings');
  const versionText = document.getElementById('versionText');

  const manifestData = chrome.runtime.getManifest();
  versionText.textContent = `Version ${manifestData.version}`;

  chrome.storage.sync.get(['urlMappings'], (result) => {
    const urlMappings = result.urlMappings || {};

    Object.keys(urlMappings).forEach((sourceUrl) => {
      addMappingGroup(sourceUrl, urlMappings[sourceUrl]);
    });

    if (Object.keys(urlMappings).length === 0) {
      addMappingGroup('', '');
    }

    renumberMappings();
    adjustMappingsContainerHeight();
  });

  function addMappingGroup(source, target) {
    const mappingGroup = document.createElement('div');
    mappingGroup.className = 'mapping-group';

    mappingGroup.innerHTML = `
      <div class="inputs-container">
        <input type="text" class="source-input" value="${source}" placeholder="Enter source URL...">
        <input type="text" class="target-input" value="${target}" placeholder="Enter redirect URL (optional)...">
      </div>
      <button class="remove-mapping-btn">-</button>
    `;

    mappingsContainer.appendChild(mappingGroup);

    const removeBtn = mappingGroup.querySelector('.remove-mapping-btn');
    removeBtn.addEventListener('click', () => {
      mappingGroup.remove();
      renumberMappings();
      adjustMappingsContainerHeight();
    });

    renumberMappings();
  }

  function renumberMappings() {
    const mappingGroups = mappingsContainer.querySelectorAll('.mapping-group');

    mappingGroups.forEach((group) => {
      const existingAddBtn = group.querySelector('.add-mapping-btn');
      if (existingAddBtn) {
        existingAddBtn.remove();
      }
    });

    if (mappingGroups.length > 0) {
      const lastGroup = mappingGroups[mappingGroups.length - 1];
      const addButton = document.createElement('button');
      addButton.className = 'add-mapping-btn';
      addButton.textContent = '+';
      addButton.addEventListener('click', () => {
        addMappingGroup('', '');
        renumberMappings();
        adjustMappingsContainerHeight();
      });
      lastGroup.appendChild(addButton);
    }
  }

  function adjustMappingsContainerHeight() {
    const windowHeight = window.innerHeight;
    const footerHeight = document.querySelector('.footer').offsetHeight;
    const remainingHeight = windowHeight - footerHeight - 60;
    mappingsContainer.style.height = `${remainingHeight}px`;
  }

  window.addEventListener('resize', adjustMappingsContainerHeight);

  saveMappingsButton.addEventListener('click', () => {
    const mappingGroups = mappingsContainer.querySelectorAll('.mapping-group');
    const newMappings = {};

    mappingGroups.forEach((group) => {
      let sourceValue = group.querySelector('.source-input').value.trim();
      let targetValue = group.querySelector('.target-input').value.trim();

      sourceValue = standardizeUrl(sourceValue);
      targetValue = standardizeUrl(targetValue);

      if (sourceValue) {
        newMappings[sourceValue] = targetValue;
      }
    });

    chrome.storage.sync.set({ urlMappings: newMappings }, () => {
      alert('URL mappings saved successfully!');
      window.close();
    });
  });

  function standardizeUrl(original) {
    if (!original) return '';

    const hasHttp = original.startsWith('http://') || original.startsWith('https://');
    const urlToParse = hasHttp ? original : 'https://' + original;

    try {
      return new URL(urlToParse).toString();
    } catch (e) {
      return '';
    }
  }
});
