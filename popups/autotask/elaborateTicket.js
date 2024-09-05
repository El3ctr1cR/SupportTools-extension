window.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
    const { loading, summary } = event.data;

    if (loading) {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('summary').style.display = 'none';
        document.querySelector('.buttons').style.display = 'none';
    } else {
        document.getElementById('loading').style.display = 'none';
        const summaryElement = document.getElementById('summary');
        summaryElement.innerHTML = marked.parse(summary);
        summaryElement.style.display = 'block';
        document.querySelector('.buttons').style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get('activeTabId', (result) => {
        const tabId = result.activeTabId;

        if (tabId) {
            document.getElementById('acceptButton').addEventListener('click', () => {
                const aiSummary = document.getElementById('summary').innerText;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: pasteToActiveTab,
                    args: ["div.ContentEditable2.Large[contenteditable='true']", aiSummary]
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Script injection failed: " + chrome.runtime.lastError.message);
                    } else {
                        console.log("AI response successfully pasted into autotask.net.");
                        window.close();
                    }
                });
            });

            document.getElementById('closeButton').addEventListener('click', () => {
                window.close();
            });
        } else {
            console.error("No saved tab ID found.");
        }
    });
});


function pasteToActiveTab(selector, summary) {
    const targetDiv = document.querySelector(selector);
    if (targetDiv) {
        targetDiv.innerHTML = summary;
    } else {
        console.error("Target element not found.");
    }
}
