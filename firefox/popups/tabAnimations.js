function animateTabContent(contentEl) {
  const topLevel = Array.from(contentEl.children).filter(function (el) {
    return el.classList.contains('category-header') || el.classList.contains('category-content');
  });

  topLevel.forEach(function (el, i) {
    el.classList.remove('tab-animate');
    el.style.opacity = '';
    void el.offsetWidth;
    el.classList.add('tab-animate');
    el.style.animationDelay = (i * 0.04 + 0.03) + 's';
    el.addEventListener('animationend', function handler() {
      el.classList.remove('tab-animate');
      el.style.animationDelay = '';
      el.removeEventListener('animationend', handler);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var initialContent = document.querySelector('.content:not([style*="display: none"])');
  if (initialContent) animateTabContent(initialContent);

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetId = tab.dataset.target;
      if (!targetId) {
        targetId = tab.id.replace('tab', 'content');
      }
      var targetEl = document.getElementById(targetId);

      if (targetEl) {
        Array.from(targetEl.children)
          .filter(function (el) {
            return el.classList.contains('category-header') || el.classList.contains('category-content');
          })
          .forEach(function (el) {
            el.style.opacity = '0';
          });
      }

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (targetEl) animateTabContent(targetEl);
        });
      });
    });
  });
});