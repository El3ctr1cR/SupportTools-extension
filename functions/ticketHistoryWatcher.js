console.log('[TicketHistoryWatcher] Script loaded:', window.location.href);

if (
  window.location.href.includes('TicketDetail.mvc') &&
  window.location.href.includes('ticketId=')
) {
  setTimeout(() => {
    console.log('[TicketHistoryWatcher] Checking ticket info after delay...');

    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('ticketId');
    if (!ticketId) {
      console.warn('[TicketHistoryWatcher] Could not find ticketId param.');
      return;
    }

    console.log('[TicketHistoryWatcher] Found ticketId:', ticketId);

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
      console.warn('[TicketHistoryWatcher] Could not auto-detect a distinct title, trying direct child...');
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
    console.log('[TicketHistoryWatcher] New ticket data:', newEntry);

    chrome.storage.sync.get(['ticketHistory'], (res) => {
      const oldHistory = res.ticketHistory || [];
      oldHistory.unshift(newEntry);
      const trimmed = oldHistory.slice(0, 30);

      chrome.storage.sync.set({ ticketHistory: trimmed }, () => {
        console.log(
          '[TicketHistoryWatcher] Updated ticketHistory with new entry:',
          newEntry
        );
      });
    });
  }, 500);
} else {
  console.log(
    '[TicketHistoryWatcher] Not a TicketDetail page with ticketId, skipping.'
  );
}
