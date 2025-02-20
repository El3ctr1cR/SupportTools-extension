(function() {
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener("load", function() {
        try {
          if (this.responseURL && this.responseURL.includes("/Common/Widgets/Grid")) {
            const data = JSON.parse(this.responseText);
            window.postMessage({ type: "GRID_PAYLOAD", payload: data }, "*");
          }
        } catch (e) {
          console.error("Injected XHR interceptor error:", e);
        }
      });
      origSend.apply(this, args);
    };
  
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
      return origFetch(input, init).then(response => {
        const clone = response.clone();
        clone.text().then(text => {
          try {
            let url = "";
            if (typeof input === "string") {
              url = input;
            } else if (input && input.url) {
              url = input.url;
            }
            if (url && url.includes("/Common/Widgets/Grid")) {
              const data = JSON.parse(text);
              window.postMessage({ type: "GRID_PAYLOAD", payload: data }, "*");
            }
          } catch (e) {
            // ignore errors
          }
        });
        return response;
      });
    };
  })();
  