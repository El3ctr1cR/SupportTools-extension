(function () {
  var scaleX = 1, scaleY = 1, active = false;

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'dattoStretchScale') return;
    scaleX  = e.data.scaleX  || 1;
    scaleY  = e.data.scaleY  || 1;
    active  = !!e.data.enabled;
  });

  document.addEventListener('mousemove', function (e) {
    if (!active || (scaleX === 1 && scaleY === 1)) return;

    var newMovX = (e.movementX || 0) / scaleX;
    var newMovY = (e.movementY || 0) / scaleY;

    var newClientX = e.clientX;
    var newClientY = e.clientY;

    var displayOuter = document.getElementById('display-outer');
    if (displayOuter) {
      var rect = displayOuter.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom) {
        newClientX = rect.left + (e.clientX - rect.left) / scaleX;
        newClientY = rect.top  + (e.clientY - rect.top)  / scaleY;
      }
    }

    try {
      Object.defineProperty(e, 'movementX', { get: function () { return newMovX; }, configurable: true });
      Object.defineProperty(e, 'movementY', { get: function () { return newMovY; }, configurable: true });
      Object.defineProperty(e, 'clientX',   { get: function () { return newClientX; }, configurable: true });
      Object.defineProperty(e, 'clientY',   { get: function () { return newClientY; }, configurable: true });
    } catch (_) {}
  }, true);
})();