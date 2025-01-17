console.log('Autotask Calendar Enhancer: Script loaded in frame:', window.location.href);

function findTicketId(element) {
    console.log('Searching for ticket ID in element');

    const dragGroup = element.querySelector('dragdropgroup');
    if (dragGroup) {
        const ticketDiv = dragGroup.querySelector('div[id^="Ticket_"]');
        if (ticketDiv) {
            const match = ticketDiv.id.match(/Ticket_(\d+)/);
            if (match) {
                console.log('Found ticket ID from draggroup:', match[1]);
                return match[1];
            }
        }
    }

    if (element.id && element.id.startsWith('Event_')) {
        const serviceCallId = element.getAttribute('service_call_id');
        if (serviceCallId) {
            console.log('Found service call ID:', serviceCallId);
            const ticketDiv = element.querySelector('div[id^="Ticket_"]');
            if (ticketDiv) {
                const match = ticketDiv.id.match(/Ticket_(\d+)/);
                if (match) {
                    console.log('Found ticket ID from service call:', match[1]);
                    return match[1];
                }
            }
        }
    }

    const tooltip = element.getAttribute('onmouseover');
    if (tooltip) {
        const ticketMatch = tooltip.match(/Ticket Number:\s*T\d+\.(\d+)/);
        if (ticketMatch) {
            console.log('Found ticket ID from tooltip:', ticketMatch[1]);
            return ticketMatch[1];
        }
    }

    return null;
}

function addTicketButtons() {
    console.log('Attempting to add ticket buttons');

    const calendarItems = document.querySelectorAll('div[id^="Event_"][class*="SERVICECALL"]');
    console.log(`Found ${calendarItems.length} calendar items`);

    calendarItems.forEach((item, index) => {
        console.log(`Processing calendar item ${index + 1}`);

        if (item.querySelector('.quick-ticket-btn')) {
            console.log('Button already exists on this item');
            return;
        }

        const ticketId = findTicketId(item);
        if (!ticketId) {
            console.log('No ticket ID found for this item');
            return;
        }

        console.log(`Creating button for ticket ${ticketId}`);

        const button = document.createElement('div');
        button.className = 'quick-ticket-btn';
        button.textContent = 'Tkt';

        button.style.cssText = `
            padding-left: 3px;
            font-size: 10px;
            color: #376597;
            cursor: pointer;
            position: absolute;
            overflow: hidden;
            width: 25px;
            height: 12px;
            background-color: #FFFEC4;
            top: 1px;
            right: 28px;
            text-align: left;
        `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const ticketUrl = `https://ww19.autotask.net/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&mode=0&ticketId=${ticketId}`;
            console.log(`Opening ticket URL: ${ticketUrl}`);
            window.open(ticketUrl, '_blank');
        });

        item.appendChild(button);
        console.log('Button added successfully');
    });
}

function removeTicketButtons() {
    console.log('Removing ticket buttons');
    const buttons = document.querySelectorAll('.quick-ticket-btn');
    buttons.forEach((button) => button.remove());
}

function initializeForWorkshopView() {
    console.log('Initializing for Workshop View');

    addTicketButtons();

    const observer = new MutationObserver((mutations) => {
        console.log('Calendar mutation detected');
        addTicketButtons();
    });

    const calendarContainer = document.querySelector('#Calendar, #CalendarSection');
    if (calendarContainer) {
        console.log('Found calendar container, setting up observer');
        observer.observe(calendarContainer, {
            childList: true,
            subtree: true
        });
    } else {
        console.log('Calendar container not found, observing body');
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

chrome.storage.sync.get(['openTicketButtonEnabled'], (result) => {
    if (result.openTicketButtonEnabled) {
        console.log('Open Ticket Button feature is enabled');
        initializeForWorkshopView();
    } else {
        console.log('Open Ticket Button feature is disabled');
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggleOpenTicketButton') {
        if (message.enabled) {
            console.log('Enabling Open Ticket Button feature');
            initializeForWorkshopView();
        } else {
            console.log('Disabling Open Ticket Button feature');
            removeTicketButtons();
        }
    }
});

if (window.location.href.includes('DispatcherWorkshop')) {
    console.log('Found DispatcherWorkshop frame');

    const calendarCheck = setInterval(() => {
        const calendarItems = document.querySelectorAll('div[id^="Event_"][class*="SERVICECALL"]');
        if (calendarItems.length > 0) {
            console.log('Calendar items found, initializing');
            clearInterval(calendarCheck);
            chrome.storage.sync.get(['openTicketButtonEnabled'], (result) => {
                if (result.openTicketButtonEnabled) {
                    initializeForWorkshopView();
                }
            });
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(calendarCheck);
        console.log('Timeout reached for calendar check');
    }, 30000);
}
