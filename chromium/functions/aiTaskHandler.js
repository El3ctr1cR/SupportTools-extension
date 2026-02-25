async function getAiSettings() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(
            ['aiProvider', 'aiModel', 'openAiApiKey', 'googleApiKey', 'anthropicApiKey'],
            (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve({
                        provider: result.aiProvider || 'openai',
                        model: result.aiModel || 'gpt-5-mini',
                        openAiApiKey: result.openAiApiKey || '',
                        googleApiKey: result.googleApiKey || '',
                        anthropicApiKey: result.anthropicApiKey || ''
                    });
                }
            }
        );
    });
}

async function callOpenAiApi(prompt, settings, options = {}) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.openAiApiKey}`
        },
        body: JSON.stringify({
            model: settings.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: options.max_tokens || 1500,
            temperature: options.temperature !== undefined ? options.temperature : 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
        return data.choices[0].message.content.trim();
    }
    throw new Error('No valid response from OpenAI.');
}

async function callGeminiApi(prompt, settings, options = {}) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.googleApiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: options.max_tokens || 1500,
                temperature: options.temperature !== undefined ? options.temperature : 0.7
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text.trim();
    throw new Error('No valid response from Gemini.');
}

async function callAnthropicApi(prompt, settings, options = {}) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': settings.anthropicApiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: settings.model,
            max_tokens: options.max_tokens || 1500,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (text) return text.trim();
    throw new Error('No valid response from Anthropic.');
}

async function callAiApi(prompt, options = {}) {
    try {
        const settings = await getAiSettings();

        switch (settings.provider) {
            case 'google':
                return await callGeminiApi(prompt, settings, options);
            case 'anthropic':
                return await callAnthropicApi(prompt, settings, options);
            case 'openai':
            default:
                return await callOpenAiApi(prompt, settings, options);
        }
    } catch (error) {
        console.error('AI API error:', error);
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
    commentElements.forEach((commentElement) => {
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
        return { element: editableElement, text: extractText(editableElement) };
    }

    editableElement = document.querySelector('div.ContentEditable2.Large[contenteditable="true"]');
    if (editableElement) {
        return { element: editableElement, text: extractText(editableElement) };
    }

    const textareaElement = document.querySelector('div.TextArea2 textarea.Normal');
    if (textareaElement) {
        return { element: textareaElement, text: textareaElement.value.trim() };
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
            element.innerHTML = text.replace(/\n/g, '<br>');
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
        const languageMap = { nl: 'Dutch', en: 'English', de: 'German' };
        chrome.storage.sync.get(['selectedLanguage'], (result) => {
            const lang = result.selectedLanguage || 'nl';
            callback(languageMap[lang] || 'Dutch');
        });
    };

    if (request.action === 'summarizeTicket') {
        const ticketDetails = getTicketDetailsAI();
        getLanguage((language) => {
            const prompt = `Summarize the following ticket in a clear and detailed manner in ${language}. Use the following format for the summary:\n\n1. Brief overview of the ticket (problem or request)\n2. Tasks that have been completed (if any)\n3. Tasks that still need to be completed (if any)\n\nEnsure that the summary is concise, well-structured, and captures the essential information. Avoid adding unnecessary details.\n\nFull ticket:\n${ticketDetails}`;
            callAiApi(prompt).then(summary => sendResponse({ summary }));
        });
        return true;
    }

    if (request.action === 'makeTextNeater') {
        getLanguage((_language) => {
            const contentData = getNotes();
            if (!contentData || !contentData.text) {
                sendResponse({ success: false, error: 'No text found to make neater.' });
                return;
            }
            const prompt = `Make the following text neater and more professional in the same language. Only output the fully new version of the text.\n\n${contentData.text}`;
            callAiApi(prompt, { temperature: 0 }).then(correctedText => {
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