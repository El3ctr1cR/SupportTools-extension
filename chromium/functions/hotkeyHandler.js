(function () {
  'use strict';

  function eventToCombo(e) {
    const parts = [];
    if (e.ctrlKey)  parts.push('Ctrl');
    if (e.altKey)   parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey)  parts.push('Meta');

    const modifierKeys = new Set(['Control', 'Alt', 'Shift', 'Meta']);
    if (!modifierKeys.has(e.key)) {
      parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
    }

    return parts.length >= 2 ? parts.join('+') : '';
  }

  document.addEventListener('keydown', (e) => {
    const combo = eventToCombo(e);
    if (!combo) return;

    chrome.storage.sync.get(['templates'], (res) => {
      const templates = res.templates || {};

      const matchedName = Object.keys(templates).find((name) => {
        const tpl = templates[name];
        return tpl && typeof tpl === 'object' && tpl.hotkey === combo;
      });

      if (!matchedName) return;

      e.preventDefault();
      e.stopPropagation();

      showToast(`⌨ Inserting: ${matchedName}`);

      document.dispatchEvent(
        new CustomEvent('__supportTools_hotkeyInsert', {
          detail: { template: matchedName }
        })
      );
    });
  }, true);

  function showToast(message) {
    const existing = document.getElementById('__supportToolsToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = '__supportToolsToast';
    toast.textContent = message;

    Object.assign(toast.style, {
      position:       'fixed',
      bottom:         '24px',
      right:          '24px',
      zIndex:         '2147483647',
      padding:        '10px 18px',
      borderRadius:   '8px',
      background:     'rgba(17, 17, 27, 0.92)',
      color:          '#a5b4fc',
      fontSize:       '13px',
      fontFamily:     '-apple-system, BlinkMacSystemFont, Inter, Segoe UI, sans-serif',
      fontWeight:     '500',
      border:         '1px solid rgba(99, 102, 241, 0.4)',
      backdropFilter: 'blur(10px)',
      boxShadow:      '0 4px 20px rgba(0,0,0,0.4)',
      opacity:        '0',
      transition:     'opacity 0.2s ease',
      pointerEvents:  'none',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 2000);
  }
})();