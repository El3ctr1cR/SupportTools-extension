const openaiApiKey = '';

async function getOpenAISummaryAndSolution(formattedDetails) {
  try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{
                  "role": "user",
                  "content": `Wij zijn een IT support afdeling en we hebben het volgende ticket binnen gekregen. Dit ticket bevat zowel een beschrijving als reacties van technici en klanten. Maak een samenvatting. Als de klant problemen ervaart zet de oplossingen erbij en als de klant een verzoek heeft, zet erbij wat er moet gebeuren:\n\n${formattedDetails}`
              }],
              max_tokens: 450,
              temperature: 0.7
          })
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('OpenAI API Response:', data);

      if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
          return data.choices[0].message.content.trim();
      } else {
          throw new Error('No valid response text found in the AI response.');
      }
  } catch (error) {
      console.error('Error with OpenAI API:', error);
      return `Failed to generate a summary or solution. Error: ${error.message}`;
  }
}



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
    const match = scriptContent.match(/'*Solutions','(.*?)','(.*?)','(.*?)'/);
    if (match && match[3]) {
      return match[3];
    }
  }
  return 'Unknown User';
}

function getTicketDescription() {
  const descriptionElement = document.querySelector('.Normal.Section .ContentContainer .Content');
  
  if (descriptionElement) {
      let description = '';
      const childNodes = descriptionElement.childNodes;

      childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
              description += node.textContent.trim() + ' ';
          } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'IMG') {
              description += node.innerText.trim() + ' ';
          }
      });

      return description.trim();
  }

  console.error('Ticket description element not found');
  return '';
}

function getTicketComments() {
  const commentElements = document.querySelectorAll('.ConversationItem');
  let comments = [];
  commentElements.forEach((commentElement, index) => {
      let commentText = '';
      const messageElements = commentElement.querySelectorAll('.Message, .Message.Internal, .Searchable');
      messageElements.forEach(messageElement => {
          if (messageElement) {
              const textContent = messageElement.textContent.trim();
              if (textContent && !commentText.includes(textContent)) {
                  commentText += textContent + '\n';
              }
          }
      });

      if (commentText.trim()) {
          comments.push(commentText.trim());
      }
  });
  comments.reverse();
  return comments.map((comment, index) => `TICKET RESPONSE ${index + 1}:\n${comment}`);
}

function formatTicketDetails(description, comments) {
  let formattedText = `---\nORIGINAL TICKET DESCRIPTION:\n${description}\n---\n`;

  comments.forEach(comment => {
      formattedText += `${comment}\n---\n`;
  });

  return formattedText.trim();
}

function getTicketDetails() {
  const description = getTicketDescription();
  const comments = getTicketComments();
  const formattedDetails = formatTicketDetails(description, comments);

  return {
      ticketContact: getTextUnderLabel('Contact', '.ReadOnlyValueContainer .Text2').replace('Dhr. ', '').replace('Mevr. ', ''),
      ticketPrimaryResource: getTicketPrimaryResource(),
      ticketLastActivityTime: getLastTicketActivityTime(),
      ticketPriority: getTicketPriority(),
      ticketCurrentStatus: getTicketCurrentStatus(),
      ticketNewStatus: getTicketNewStatus(),
      ticketDescription: formattedDetails,
      loggedinUser: getLoggedinUser(),
      currentTime: getCurrentTime(),
      currentDate: getCurrentDate(),
  };
}

function processTemplate(template, ticketDetails) {
  return template
    .replace('${ticketContact}', ticketDetails.ticketContact)
    .replace('${ticketPrimaryResource}', ticketDetails.ticketPrimaryResource)
    .replace('${ticketLastActivityTime}', ticketDetails.ticketLastActivityTime)
    .replace('${ticketPriority}', ticketDetails.ticketPriority)
    .replace('${ticketCurrentStatus}', ticketDetails.ticketCurrentStatus)
    .replace('${ticketNewStatus}', ticketDetails.ticketNewStatus)
    .replace('${loggedinUser}', ticketDetails.loggedinUser)
    .replace('${currentTime}', ticketDetails.currentTime)
    .replace('${currentDate}', ticketDetails.currentDate)
    .replace('$ticketDesc}', ticketDetails.ticketDescription);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailText') {
      chrome.storage.sync.get(['templates'], async (result) => {
          const ticketDetails = getTicketDetails();
          const templates = result.templates || {};
          const selectedTemplate = templates[request.template];

          if (selectedTemplate) {
              const emailText = processTemplate(selectedTemplate, ticketDetails);
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

  if (request.action === 'summarizeTicket') {
      const ticketDetails = getTicketDetails();
      const ticketDescription = ticketDetails.ticketDescription;

      if (ticketDescription) {
          getOpenAISummaryAndSolution(ticketDescription).then(summaryAndSolution => {
              sendResponse({ summary: summaryAndSolution });
          });
      } else {
          sendResponse({ summary: 'Ticket description not found.' });
      }

      return true;
  }
});