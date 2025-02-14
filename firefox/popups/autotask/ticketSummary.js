window.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
    const { loading, summary } = event.data;

    if (loading) {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('summary').style.display = 'none';
    } else {
        document.getElementById('loading').style.display = 'none';
        const summaryElement = document.getElementById('summary');
        summaryElement.innerHTML = marked.parse(summary);
        summaryElement.style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const manifestData = chrome.runtime.getManifest();
    const versionText = document.getElementById('versionText');
    versionText.textContent = `Version ${manifestData.version}`;
});