if (!window.location.href.includes('autotask.net/Mvc/ServiceDesk/')) {

    console.log('calendarChanger.js: Script loaded in frame:', window.location.href);

    function findTicketId(element) {

        const dragGroup = element.querySelector('dragdropgroup');
        if (dragGroup) {
            const ticketDiv = dragGroup.querySelector('div[id^="Ticket_"]');
            if (ticketDiv) {
                const match = ticketDiv.id.match(/Ticket_(\d+)/);
                if (match) {
                    return match[1];
                }
            }
        }

        if (element.id && element.id.startsWith('Event_')) {
            const serviceCallId = element.getAttribute('service_call_id');
            if (serviceCallId) {
                const ticketDiv = element.querySelector('div[id^="Ticket_"]');
                if (ticketDiv) {
                    const match = ticketDiv.id.match(/Ticket_(\d+)/);
                    if (match) {
                        return match[1];
                    }
                }
            }
        }

        const tooltip = element.getAttribute('onmouseover');
        if (tooltip) {
            const ticketMatch = tooltip.match(/Ticket Number:\s*T\d+\.(\d+)/);
            if (ticketMatch) {
                return ticketMatch[1];
            }
        }

        return null;
    }

    function addTicketButtons() {

        const calendarItems = document.querySelectorAll('div[id^="Event_"][class*="SERVICECALL"]');

        calendarItems.forEach((item, index) => {

            if (item.querySelector('.quick-ticket-btn')) {
                return;
            }

            const ticketId = findTicketId(item);
            if (!ticketId) {
                return;
            }

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

            const protocol = window.location.protocol;
            const host = window.location.host;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const ticketUrl = `${protocol}//${host}/Mvc/ServiceDesk/TicketDetail.mvc?workspace=False&mode=0&ticketId=${ticketId}`;
                window.open(ticketUrl, '_blank');
            });

            item.appendChild(button);
        });
    }

    function removeTicketButtons() {
        const buttons = document.querySelectorAll('.quick-ticket-btn');
        buttons.forEach((button) => button.remove());
    }

    function initializeForWorkshopView() {
        addTicketButtons();

        const observer = new MutationObserver((mutations) => {
            addTicketButtons();
        });

        const calendarContainer = document.querySelector('#Calendar, #CalendarSection');
        if (calendarContainer) {
            observer.observe(calendarContainer, {
                childList: true,
                subtree: true
            });
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    chrome.storage.sync.get(['openTicketButtonEnabled'], (result) => {
        if (result.openTicketButtonEnabled) {
            initializeForWorkshopView();
        } else {
        }
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'toggleOpenTicketButton') {
            if (message.enabled) {
                initializeForWorkshopView();
            } else {
                removeTicketButtons();
            }
        }
    });

    // If the URL includes "DispatcherWorkshop", run the "calendar check"
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
}
