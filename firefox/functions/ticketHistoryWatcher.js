if (
  window.location.href.includes('TicketDetail.mvc') &&
  window.location.href.includes('ticketId=')
) {
  setTimeout(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticketId');
    if (!ticketId) return;

    if (sessionStorage.getItem('lastTicketId') === ticketId) return;
    sessionStorage.setItem('lastTicketId', ticketId);

    const identificationText = document.querySelector(
      '.IdentificationContainer .IdentificationText'
    );
    const ticketNumber = identificationText
      ? identificationText.textContent.trim()
      : null;

    let ticketTitle = '';
    const mainTitleContainer = document.querySelector(
      '.EntityHeadingContainer .Title'
    );
    if (mainTitleContainer) {
      const textEls = mainTitleContainer.querySelectorAll('.Text');
      const skipWords = ['ticket', 'incident', 'service request'];

      for (const el of textEls) {
        const val = el.textContent.trim();
        if (val && !skipWords.includes(val.toLowerCase())) {
          ticketTitle = val;
          break;
        }
      }
    }

    if (!ticketTitle) {
      const directTextChild = mainTitleContainer
        ? Array.from(mainTitleContainer.children).find((child) =>
            child.classList.contains('Text')
          )
        : null;
      if (directTextChild) {
        ticketTitle = directTextChild.textContent.trim();
      }
    }

    const combinedDisplay =
      ticketNumber && ticketTitle
        ? `${ticketNumber} - ${ticketTitle}`
        : ticketNumber || 'Unknown Ticket';

    const newEntry = {
      ticketId,
      ticketNumber,
      ticketTitle,
      displayText: combinedDisplay,
      timestamp: Date.now(),
    };

    chrome.storage.sync.get(['ticketHistory'], (res) => {
      const oldHistory = res.ticketHistory || [];
      oldHistory.unshift(newEntry);
      const trimmed = oldHistory.slice(0, 30);
      chrome.storage.sync.set({ ticketHistory: trimmed });
    });
  }, 500);
}