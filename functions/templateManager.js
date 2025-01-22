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
  const statusSection = document.querySelector(
    '.Normal.Section .ContentContainer .Content .ReplaceableColumnContainer .Large.Column .SingleItemSelector2 .SelectionDisplay .Text span'
  );
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
    .replace('${currentDate}', ticketDetails.currentDate);
}

function setTicketStatus(desiredStatus) {
  const selectionDisplay = document.querySelector('.SingleItemSelector2 .SelectionDisplay');
  if (!selectionDisplay) {
    console.warn("Cannot find the status dropdown button (SelectionDisplay).");
    return;
  }

  selectionDisplay.click();

  setTimeout(() => {
    const statusSpans = document.querySelectorAll('.SingleItemSelector2 .ItemList .Item .Text span');
    let foundStatus = false;

    for (const span of statusSpans) {
      if (span.textContent.trim() === desiredStatus) {
        const parentItem = span.closest('.Item');
        if (parentItem) {
          parentItem.click();
          console.log(`Status changed to "${desiredStatus}"`);
          foundStatus = true;
        }
        break;
      }
    }

    if (!foundStatus) {
      console.warn(`Could not find a dropdown item matching "${desiredStatus}".`);
    }
  }, 300);
}

function getAllStatuses() {
  console.log("getAllStatuses() called...");

  const statusLabel = Array.from(document.querySelectorAll('.LabelContainer1 .Text .PrimaryText'))
    .find(el => el.textContent.trim().toLowerCase() === 'status');
  if (!statusLabel) {
    console.warn("Could not find a label with text 'Status'.");
    return Promise.resolve([]);
  }
  console.log("Found label:", statusLabel);

  const allSelectors = document.querySelectorAll('.SingleItemSelector2');
  let statusSelector = null;

  for (const sel of allSelectors) {
    if (sel.querySelector('.TicketStatusIcon')) {
      statusSelector = sel;
      break;
    }
  }

  if (!statusSelector) {
    console.warn("Could not find any .SingleItemSelector2 containing a .TicketStatusIcon.");
    return Promise.resolve([]);
  }
  console.log("Found statusSelector:", statusSelector);

  const selectionDisplay = statusSelector.querySelector('.SelectionDisplay');
  if (!selectionDisplay) {
    console.warn("No .SelectionDisplay inside statusSelector");
    return Promise.resolve([]);
  }
  selectionDisplay.click();
  console.log("Clicked the status dropdown...");

  return new Promise((resolve) => {
    setTimeout(() => {
      const statusSpans = statusSelector.querySelectorAll('.ItemList .Item .Text span');
      const statuses = Array.from(statusSpans).map(span => span.textContent.trim());

      selectionDisplay.click();

      console.log("Scraped statuses:", statuses);
      resolve(statuses);
    }, 500);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailText') {
    chrome.storage.sync.get(['templates'], async (result) => {
      const ticketDetails = getTicketDetails();
      const templates = result.templates || {};

      let rawTemplateObj = templates[request.template];

      if (!rawTemplateObj) {
        sendResponse({ success: false, message: 'Template not found' });
        return;
      }

      let templateContent = '';
      let desiredStatus = 'Select ticket status';

      if (typeof rawTemplateObj === 'string') {
        templateContent = rawTemplateObj;
      } else if (typeof rawTemplateObj === 'object') {
        templateContent = rawTemplateObj.content || '';
        desiredStatus = rawTemplateObj.status || 'Select ticket status';
      }

      const emailText = processTemplate(templateContent, ticketDetails);

      let inserted = false;
      let contentEditableDiv = document.querySelector('div.ContentEditable2.Small[contenteditable="true"]')
        || document.querySelector('div.ContentEditable2.Large[contenteditable="true"]');

      if (contentEditableDiv) {
        contentEditableDiv.innerHTML = emailText.replace(/\n/g, '<br>');

        const inputEvent = new Event('input', { bubbles: true });
        contentEditableDiv.dispatchEvent(inputEvent);

        inserted = true;
      }

      if (!inserted) {
        const textArea = document.querySelector('div.TextArea2 textarea.Normal');
        if (textArea) {
          textArea.value = emailText;

          const inputEvent = new Event('input', { bubbles: true });
          textArea.dispatchEvent(inputEvent);

          inserted = true;
        }
      }

      if (inserted) {
        if (desiredStatus !== 'Select ticket status') {
          setTicketStatus(desiredStatus);
        }
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, message: 'No suitable content area found to insert text' });
      }
    });

    return true;
  }

  else if (request.action === 'getTicketDetails') {
    const ticketDetails = getTicketDetails();
    sendResponse(ticketDetails);
  }

  else if (request.action === 'processTemplate') {
    const ticketDetails = request.ticketDetails;
    const selectedTemplate = request.template;
    const processedText = processTemplate(selectedTemplate, ticketDetails);
    sendResponse({ processedText });
  }

  else if (request.action === 'getAllStatuses') {
    getAllStatuses().then((statuses) => {
      sendResponse({ statuses });
    });
    return true;
  }
});
