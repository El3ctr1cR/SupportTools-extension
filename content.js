// Function to get text from a selector
function getTextFromSelector(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : '';
}

// Function to get text under a specific label
function getTextUnderLabel(labelText, valueSelector) {
  const labelElements = document.querySelectorAll('.ReadOnlyLabelContainer .PrimaryText');

  for (let labelElement of labelElements) {
    if (labelElement.textContent.trim() === labelText) {
      const valueContainer = labelElement.closest('.ReadOnlyData').querySelector(valueSelector);
      if (valueContainer) {
        return valueContainer.textContent.trim();
      }
    }
  }
  return '';
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailText') {

    chrome.storage.sync.get(['fullName', 'templates'], (result) => {

      const ticketContact = getTextUnderLabel('Contact', '.ReadOnlyValueContainer .Text2');
      const ticketPrimaryResource = result.fullName || 'Your Name';
      const templates = result.templates || {};

      const selectedTemplate = templates[request.template];

      if (selectedTemplate) {
        const emailText = selectedTemplate
          .replace('${ticketContact}', ticketContact)
          .replace('${ticketPrimaryResource}', ticketPrimaryResource);

        const contentEditableDiv = document.querySelector('div.ContentEditable2.Small[contenteditable="true"]');
        if (contentEditableDiv) {
          contentEditableDiv.innerHTML = emailText.replace(/\n/g, '<br>');
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, message: 'Content editable div not found' });
        }
      } else {
        sendResponse({ success: false, message: 'Template not found' });
      }
    });

    return true; // Asynchronous response
  }
});
