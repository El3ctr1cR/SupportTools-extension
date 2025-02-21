const firefoxImportConfigButton = document.getElementById('firefoxImportConfigButton');
const firefoxImportFileInput = document.getElementById('firefoxImportFileInput');
const manifest = browser.runtime.getManifest();
document.getElementById('versionText').textContent = `Version ${manifest.version}`;

firefoxImportConfigButton.addEventListener('click', () => {
    firefoxImportFileInput.click();
});

firefoxImportFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedConfig = JSON.parse(e.target.result);
                chrome.storage.sync.set(importedConfig, () => {
                    alert('Configuration imported successfully!');
                    window.close();
                });
            } catch (error) {
                alert('Failed to import configuration. Invalid JSON format.');
            }
        };
        reader.readAsText(file);
    }
});
