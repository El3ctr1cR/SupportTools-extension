function getTextFromSelector(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : '';
}

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

function splitName(fullName) {
  fullName = fullName.replace(/^(Dhr\.|Mevr\.)\s*/, '').trim();
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  return { firstName, lastName };
}

function getCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function getLastTicketActivityTime() {
  const conversationChunks = document.querySelectorAll('.ConversationChunk');
  for (let conversationChunk of conversationChunks) {
    const conversationItems = conversationChunk.querySelectorAll('.ConversationItem');
    for (let conversationItem of conversationItems) {
      const adminCheck = conversationItem.querySelector('.Text2');
      if (adminCheck && adminCheck.textContent.trim() === 'Autotask Administrator') {
        continue;
      }
      const timestampElement = conversationItem.querySelector('.Timestamp');
      if (timestampElement) {
        return timestampElement.textContent.trim();
      }
    }
  }
  return '';
}

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

function getTicketNewStatus() {
  const statusSection = document.querySelector('.Normal.Section .ContentContainer .Content .ReplaceableColumnContainer .Large.Column .SingleItemSelector2 .SelectionDisplay .Text span');
  if (statusSection) {
    return statusSection.textContent.trim();
  }
  return '';
}

function getTicketPrimaryResource() {
  const primaryResourceElement = document.querySelector('.PrimaryResource .Name');
  return primaryResourceElement ? primaryResourceElement.textContent.trim() : '';
}

function getLoggedinUser() {
  const scriptTags = document.querySelectorAll('script');
  for (let script of scriptTags) {
    const scriptContent = script.innerHTML;
    const match = scriptContent.match(/'([A-Za-z\s]+)','[A-Za-z\s]+','([A-Za-z\s]+ [A-Za-z\s]+)',\d{3,}/);
    if (match && match[2]) {
      return match[2];
    }
  }
  return 'Unknown User';
}

function getTicketDetails() {
  const fullName = getTextUnderLabel('Contact', '.ReadOnlyValueContainer .Text2').trim();
  const { firstName, lastName } = splitName(fullName);
  return {
    ticketContactFirstname: firstName,
    ticketContactLastname: lastName,
    ticketPrimaryResource: getTicketPrimaryResource(),
    ticketLastActivityTime: getLastTicketActivityTime(),
    ticketPriority: getTicketPriority(),
    ticketCurrentStatus: getTicketCurrentStatus(),
    ticketNewStatus: getTicketNewStatus(),
    loggedinUser: getLoggedinUser(),
    currentTime: getCurrentTime(),
    currentDate: getCurrentDate(),
  };
}

function processTemplate(template, ticketDetails) {
  return template
    .replace('${ticketContactFirstname}', ticketDetails.ticketContactFirstname)
    .replace('${ticketContactLastname}', ticketDetails.ticketContactLastname)
    .replace('${ticketPrimaryResource}', ticketDetails.ticketPrimaryResource)
    .replace('${ticketLastActivityTime}', ticketDetails.ticketLastActivityTime)
    .replace('${ticketPriority}', ticketDetails.ticketPriority)
    .replace('${ticketCurrentStatus}', ticketDetails.ticketCurrentStatus)
    .replace('${ticketNewStatus}', ticketDetails.ticketNewStatus)
    .replace('${loggedinUser}', ticketDetails.loggedinUser)
    .replace('${currentTime}', ticketDetails.currentTime)
    .replace('${currentDate}', ticketDetails.currentDate)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailText') {
    chrome.storage.sync.get(['templates'], async (result) => {
      const ticketDetails = getTicketDetails();
      const templates = result.templates || {};
      const selectedTemplate = templates[request.template];

      if (selectedTemplate) {
        const emailText = processTemplate(selectedTemplate, ticketDetails);
        let contentEditableDiv = document.querySelector('div.ContentEditable2.Small[contenteditable="true"]');

        if (!contentEditableDiv) {
          contentEditableDiv = document.querySelector('div.ContentEditable2.Large[contenteditable="true"]');
        }

        if (contentEditableDiv) {
          contentEditableDiv.innerHTML = emailText.replace(/\n/g, '<br>');
          sendResponse({ success: true });
        } else {
          const textAreaContainer = document.querySelector('div.TextArea2');
          if (textAreaContainer) {
            const textArea = textAreaContainer.querySelector('textarea.Normal');
            if (textArea) {
              textArea.value = emailText;
              sendResponse({ success: true });
            } else {
              sendResponse({ success: false, message: 'Textarea element not found' });
            }
          } else {
            sendResponse({ success: false, message: 'No suitable content area found to insert text' });
          }
        }
      } else {
        sendResponse({ success: false, message: 'Template not found' });
      }
    });

    return true;
  }

  if (request.action === 'getTicketDetails') {
    const ticketDetails = getTicketDetails();
    sendResponse(ticketDetails);
  }

  if (request.action === 'processTemplate') {
    const ticketDetails = request.ticketDetails;
    const selectedTemplate = request.template;
    const processedText = processTemplate(selectedTemplate, ticketDetails);
    sendResponse({ processedText });
  }
});
