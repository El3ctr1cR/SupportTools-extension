function animateTabContent(contentEl) {
  const topLevel = Array.from(contentEl.children).filter(function (el) {
    return el.classList.contains('category-header') || el.classList.contains('category-content');
  });

  topLevel.forEach(function (el, i) {
    el.classList.remove('tab-animate');
    void el.offsetWidth;
    el.classList.add('tab-animate');
    el.style.animationDelay = (i * 0.04 + 0.03) + 's';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var initialContent = document.querySelector('.content:not([style*="display: none"])');
  if (initialContent) animateTabContent(initialContent);

  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var targetId = tab.dataset.target;
          if (!targetId) {
            targetId = tab.id.replace('tab', 'content');
          }
          var targetEl = document.getElementById(targetId);
          if (targetEl) animateTabContent(targetEl);
        });
      });
    });
  });
});