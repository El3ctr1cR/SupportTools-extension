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

// Function to get the last ticket comment date and time
function getLastTicketActivityTime() {
  const conversationChunks = document.querySelectorAll('.ConversationChunk');
  for (let conversationChunk of conversationChunks) {
    const conversationItems = conversationChunk.querySelectorAll('.ConversationItem');
    for (let conversationItem of conversationItems) {
      const adminCheck = conversationItem.querySelector('.Text2');
      if (adminCheck && adminCheck.textContent.trim() === 'Autotask Administrator') {
        continue; // Skip this item if it's from Autotask Administrator
      }
      const timestampElement = conversationItem.querySelector('.Timestamp');
      if (timestampElement) {
        return timestampElement.textContent.trim();
      }
    }
  }
  return '';
}

// Function to get ticket priority
function getTicketPriority() {
  const detailsSection = document.querySelector('.DetailsSection');
  if (detailsSection) {
    const priorityElement = detailsSection.querySelector('.ReadOnlyData.QuickEditEnabled:nth-child(4) .Text.ColorSample');
    if (priorityElement) {
      return priorityElement.textContent.trim();
    }
  }
  return '';
}

// Function to get ticket current status
function getTicketCurrentStatus() {
  const detailsSection = document.querySelector('.DetailsSection');
  if (detailsSection) {
    const statusElement = detailsSection.querySelector('.ReadOnlyData.QuickEditEnabled:nth-child(3) .Text.ColorSample');
    if (statusElement) {
      return statusElement.textContent.trim();
    }
  }
  return '';
}

// Function to get the new ticket status
function getTicketNewStatus() {
  const statusSection = document.querySelector('.Normal.Section .ContentContainer .Content .ReplaceableColumnContainer .Large.Column .SingleItemSelector2 .SelectionDisplay .Text span');
  if (statusSection) {
    return statusSection.textContent.trim();
  }
  return '';
}

// Function to get the primary resource
function getTicketPrimaryResource() {
  const primaryResourceElement = document.querySelector('.PrimaryResource .Name');
  return primaryResourceElement ? primaryResourceElement.textContent.trim() : '';
}

// Function to extract the full name of the logged-in user
function getLoggedinUser() {
  const scriptTags = document.querySelectorAll('script');
  for (let script of scriptTags) {
    const scriptContent = script.innerHTML;
    const match = scriptContent.match(/'VWC ICT Solutions','.*?','.*?','(.*?)'/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'Unknown User';
}

// Function to get all ticket details
function getTicketDetails() {
  return {
    ticketContact: getTextUnderLabel('Contact', '.ReadOnlyValueContainer .Text2').replace('Dhr. ', '').replace('Mevr. ', ''),
    ticketPrimaryResource: getTicketPrimaryResource(),
    ticketLastActivityTime: getLastTicketActivityTime(),
    ticketPriority: getTicketPriority(),
    ticketCurrentStatus: getTicketCurrentStatus(),
    ticketNewStatus: getTicketNewStatus(),
    loggedinUser: getLoggedinUser(),
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailText') {
    chrome.storage.sync.get(['fullName', 'templates'], (result) => {
      const ticketDetails = getTicketDetails();

      const templates = result.templates || {};
      const selectedTemplate = templates[request.template];

      if (selectedTemplate) {
        const emailText = selectedTemplate
          .replace('${ticketContact}', ticketDetails.ticketContact)
          .replace('${ticketPrimaryResource}', ticketDetails.ticketPrimaryResource)
          .replace('${ticketLastActivityTime}', ticketDetails.ticketLastActivityTime)
          .replace('${ticketPriority}', ticketDetails.ticketPriority)
          .replace('${ticketCurrentStatus}', ticketDetails.ticketCurrentStatus)
          .replace('${ticketNewStatus}', ticketDetails.ticketNewStatus)
          .replace('${loggedinUser}', ticketDetails.loggedinUser);

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

  if (request.action === 'getTicketDetails') {
    const ticketDetails = getTicketDetails();
    sendResponse(ticketDetails);
  }
});
