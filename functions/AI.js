async function getTicketSummary(formattedDetails) {
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
                model: 'gpt-4o-mini',
                messages: [{
                    "role": "user",
                    "content": `Wij zijn een IT support afdeling en we hebben het volgende ticket binnen gekregen. Maak een samenvatting en beschrijf de actiepunten die zijn ondernomen en die nog ondernomen moeten worden:\n\n${formattedDetails}`
                }],
                max_tokens: 700,
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
        ticketDescription: formattedDetails
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTicketDetails') {
        const ticketDetails = getTicketDetails();
        sendResponse(ticketDetails);
    }
    if (request.action === 'summarizeTicket') {
        const ticketDetails = getTicketDetails();
        const ticketDescription = ticketDetails.ticketDescription;
        if (ticketDescription) {
            getTicketSummary(ticketDescription).then(summaryAndSolution => {
                sendResponse({ summary: summaryAndSolution });
            });
        } else {
            sendResponse({ summary: 'Ticket description not found.' });
        }
        return true;
    }
});