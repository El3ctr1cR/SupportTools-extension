(function () {
  var scaleX = 1, scaleY = 1, active = false, elLeft = 0, elTop = 0;

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'dattoStretchScale') return;
    scaleX = e.data.scaleX  || 1;
    scaleY = e.data.scaleY  || 1;
    active = !!e.data.enabled;
    elLeft = e.data.elLeft  || 0;
    elTop  = e.data.elTop   || 0;
  });

  function correctEvent(e) {
    if (!active || (scaleX === 1 && scaleY === 1)) return;

    var newClientX = elLeft + (e.clientX - elLeft) / scaleX;
    var newClientY = elTop  + (e.clientY - elTop)  / scaleY;

    try {
      Object.defineProperty(e, 'clientX', { get: function () { return newClientX; }, configurable: true });
      Object.defineProperty(e, 'clientY', { get: function () { return newClientY; }, configurable: true });
    } catch (_) {}
  }

  function correctMoveEvent(e) {
    if (!active || (scaleX === 1 && scaleY === 1)) return;

    var newMovX    = (e.movementX || 0) / scaleX;
    var newMovY    = (e.movementY || 0) / scaleY;
    var newClientX = elLeft + (e.clientX - elLeft) / scaleX;
    var newClientY = elTop  + (e.clientY - elTop)  / scaleY;

    try {
      Object.defineProperty(e, 'movementX', { get: function () { return newMovX;    }, configurable: true });
      Object.defineProperty(e, 'movementY', { get: function () { return newMovY;    }, configurable: true });
      Object.defineProperty(e, 'clientX',   { get: function () { return newClientX; }, configurable: true });
      Object.defineProperty(e, 'clientY',   { get: function () { return newClientY; }, configurable: true });
    } catch (_) {}
  }

  document.addEventListener('mousemove',  correctMoveEvent, true);
  document.addEventListener('mousedown',  correctEvent,     true);
  document.addEventListener('mouseup',    correctEvent,     true);
  document.addEventListener('click',      correctEvent,     true);
  document.addEventListener('dblclick',   correctEvent,     true);
})();