async function callOpenAiApi(prompt, options = {}) {
    try {
        const { openAiApiKey } = await new Promise((resolve, reject) => {
            chrome.storage.sync.get(['openAiApiKey'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`
            },
            body: JSON.stringify({
                model: options.model || 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: options.max_tokens || 1500,
                temperature: options.temperature !== undefined ? options.temperature : 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message.content) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error('No valid response text found in the AI response.');
        }
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return `Failed to generate a response. Error: ${error.message}`;
    }
}

function getTicketDetailsAI() {
    const descriptionElement = document.querySelector('.Normal.Section .ContentContainer .Content');
    let description = '';
    if (descriptionElement) {
        const childNodes = descriptionElement.childNodes;
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                description += node.textContent.trim() + ' ';
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'IMG') {
                description += node.innerText.trim() + ' ';
            }
        });
        description = description.trim();
    } else {
        console.error('Ticket description element not found');
        description = '';
    }

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

    let formattedText = `---\nORIGINAL TICKET DESCRIPTION:\n${description}\n---\n`;
    comments.forEach((comment, index) => {
        formattedText += `TICKET RESPONSE ${index + 1}:\n${comment}\n---\n`;
    });

    return formattedText.trim();
}

function getNewTicketDescription() {
    const editableDiv = document.querySelector('div.ContentEditable2.Large[contenteditable="true"]');

    if (editableDiv) {
        return editableDiv.textContent.trim();
    } else {
        console.error('Editable div not found.');
        return '';
    }
}

function getNotes() {
    let editableElement = document.querySelector('div.ContentEditable2.Small[contenteditable="true"]');
    if (editableElement) {
        return {
            element: editableElement,
            text: extractText(editableElement)
        };
    }

    editableElement = document.querySelector('div.ContentEditable2.Large[contenteditable="true"]');
    if (editableElement) {
        return {
            element: editableElement,
            text: extractText(editableElement)
        };
    }

    const textareaElement = document.querySelector('div.TextArea2 textarea.Normal');
    if (textareaElement) {
        return {
            element: textareaElement,
            text: textareaElement.value.trim()
        };
    }

    console.error('No editable content element found.');
    return null;
}

function extractText(element) {
    let text = element.innerHTML;
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<div>/gi, '\n').replace(/<\/div>/gi, '');
    const tempElement = document.createElement('div');
    tempElement.innerHTML = text;
    return tempElement.textContent.trim();
}

function setNotes(element, text) {
    if (element) {
        if (element.tagName.toLowerCase() === 'div') {
            const htmlContent = text.replace(/\n/g, '<br>');
            element.innerHTML = htmlContent;
        } else if (element.tagName.toLowerCase() === 'textarea') {
            element.value = text;
        } else {
            console.error('Unsupported element type.');
        }
    } else {
        console.error('No element to set content.');
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const getLanguage = (callback) => {
        const languageMap = {
            'nl': 'Dutch',
            'en': 'English',
            'de': 'German'
        };

        chrome.storage.sync.get(['selectedLanguage'], (result) => {
            const selectedLanguage = result.selectedLanguage || 'nl';
            const language = languageMap[selectedLanguage] || languageMap['nl'];
            callback(language);
        });
    };

    if (request.action === 'summarizeTicket') {
        const ticketDetails = getTicketDetailsAI();
        getLanguage((language) => {
            const prompt = `Summarize the following ticket in a clear and detailed manner in ${language}. Use the following format for the summary:\n\n1. Brief overview of the ticket (problem or request)\n2. Tasks that have been completed (if any)\n3. Tasks that still need to be completed (if any)\n\nEnsure that the summary is concise, well-structured, and captures the essential information. Avoid adding unnecessary details.\n\nFull ticket:\n${ticketDetails}`;
            callOpenAiApi(prompt).then(summary => sendResponse({ summary }));
        });
        return true;
    }

    if (request.action === 'makeTextNeater') {
        getLanguage((language) => {
            const contentData = getNotes();
            if (!contentData || !contentData.text) {
                sendResponse({ success: false, error: 'No text found to makeTextNeater.' });
                return;
            }
            const originalText = contentData.text;
            const prompt = `Make the following text neater and more professional in the same language. Only output the fully new version of the text.\n\n${originalText}`;

            callOpenAiApi(prompt, { temperature: 0 }).then(correctedText => {
                setNotes(contentData.element, correctedText);
                sendResponse({ success: true });
            }).catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        });
        return true;
    }
    return true;
});
