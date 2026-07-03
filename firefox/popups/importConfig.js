document.addEventListener('DOMContentLoaded', () => {
  // ── Version display ───────────────────────────────────────────────────────
  const manifest = chrome.runtime.getManifest();
  document.getElementById('versionText').textContent = `Version ${manifest.version}`;

  // ── Import config functionality ───────────────────────────────────────────
  const importConfigButton = document.getElementById('importConfigButton');
  const importFileInput = document.getElementById('importFileInput');

  if (importConfigButton) {
    importConfigButton.addEventListener('click', () => {
      importFileInput.click();
    });
  }

  if (importFileInput) {
    importFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedConfig = JSON.parse(e.target.result);
            chrome.storage.sync.set(importedConfig, () => {
              showMsg('Configuration imported successfully!', false);
              setTimeout(() => window.close(), 1500);
            });
          } catch (error) {
            showMsg('Failed to import configuration. Invalid JSON format.', true);
          }
        };
        reader.readAsText(file);
        // Reset input so same file can be selected again
        importFileInput.value = '';
      }
    });
  }

  // ── Show message helper ───────────────────────────────────────────────────
  function showMsg(text, isError = false, duration = 3000) {
    // Create a temporary message element
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 12px 20px;
      background: ${isError ? 'var(--danger-bg)' : 'var(--success-bg)'};
      border: 1px solid ${isError ? 'var(--danger-border)' : 'var(--success-border)'};
      color: ${isError ? 'var(--danger)' : 'var(--text)'};
      border-radius: var(--radius);
      font-size: 13px;
      font-weight: 500;
      z-index: 9999;
      box-shadow: var(--shadow-md);
    `;
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), duration);
  }
});
