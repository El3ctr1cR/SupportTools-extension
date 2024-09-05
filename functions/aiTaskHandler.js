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
                temperature: options.temperature || 0.7
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

function getTicketDetails() {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const ticketDetails = getTicketDetails();

    if (request.action === 'summarizeTicket') {
        const prompt = `Give a precise summarization of the following ticket in Dutch. Use the format to make the summarization:\n1. Ticket in short\n2. Tasks that have been completed\n3. Tasks that still have to be done\n\nFull ticket:\n${ticketDetails}`;
        callOpenAiApi(prompt).then(summary => sendResponse({ summary }));
        return true;
    }

    if (request.action === 'elaborateTicket') {
        const prompt = `Please make a clear problem/request description out of it in Dutch. No headers and ticket numbers, just the description. Notes:\n${ticketDetails}`;
        callOpenAiApi(prompt).then(summary => sendResponse({ summary }));
        return true;
    }
});
