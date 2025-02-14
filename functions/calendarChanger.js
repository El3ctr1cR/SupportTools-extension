if (!window.location.href.includes('autotask.net/Mvc/ServiceDesk/')) {
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
        calendarItems.forEach((item) => {
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
        document.querySelectorAll('.quick-ticket-btn').forEach((button) => button.remove());
    }

    function initializeForWorkshopView() {
        addTicketButtons();
        const observer = new MutationObserver(() => {
            addTicketButtons();
        });
        const calendarContainer = document.querySelector('#Calendar, #CalendarSection');
        if (calendarContainer) {
            observer.observe(calendarContainer, { childList: true, subtree: true });
        } else {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    chrome.storage.sync.get(['openTicketButtonEnabled'], (result) => {
        if (result.openTicketButtonEnabled) {
            initializeForWorkshopView();
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

    if (window.location.href.includes('DispatcherWorkshop')) {
        const calendarCheck = setInterval(() => {
            const calendarItems = document.querySelectorAll('div[id^="Event_"][class*="SERVICECALL"]');
            if (calendarItems.length > 0) {
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
        }, 30000);
    }

    function addTimeIndicator() {
        const containers = [
            document.querySelector('#Grid1_Container_Body_LockedColumns_Div'),
            document.querySelector('#Grid1_Container_Body_FloatColumns_Div')
        ];
        
        containers.forEach(container => {
            if (!container) return;
            
            const computedStyle = window.getComputedStyle(container);
            if (computedStyle.position === 'static') {
                container.style.position = 'relative';
            }
            
            let indicator = container.querySelector('#time-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.style.backgroundColor = 'red';
                indicator.style.setProperty('background-color', 'red', 'important');
                indicator.id = 'time-indicator';
                indicator.style.position = 'absolute';
                indicator.style.height = '2px';
                indicator.style.zIndex = '10000';
                indicator.style.left = '0';
                indicator.style.width = '100%';
                container.appendChild(indicator);
            }
            
            function updateIndicator() {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                const hourDiv = document.getElementById(`Grid1_Container_Body_Data_LockedColumns_Div_Hour_${currentHour}`);
                if (hourDiv) {
                    const hourDivRect = hourDiv.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const hourDivTop = hourDivRect.top - containerRect.top + container.scrollTop;
                    const minutePosition = (currentMinute / 60) * hourDivRect.height;
                    indicator.style.top = `${hourDivTop + minutePosition}px`;
                } else {
                    const currentMinutes = currentHour * 60 + currentMinute;
                    const fractionOfDay = currentMinutes / 1440;
                    const totalHeight = container.scrollHeight;
                    indicator.style.top = `${fractionOfDay * totalHeight}px`;
                }
            }
            
            updateIndicator();
            setInterval(updateIndicator, 60000);
            container.addEventListener('scroll', updateIndicator);
        });
    }

    let timeIndicatorInterval = setInterval(() => {
        const containers = [
            document.querySelector('#Grid1_Container_Body_LockedColumns_Div'),
            document.querySelector('#Grid1_Container_Body_FloatColumns_Div')
        ];
        
        if (containers.every(container => container)) {
            clearInterval(timeIndicatorInterval);
            addTimeIndicator();
        }
    }, 1000);
    
    setTimeout(() => {
        clearInterval(timeIndicatorInterval);
    }, 30000);
    
}
