(function () {
  'use strict';

  const form = document.getElementById('subscribe-form');
  if (!form) return;

  const status = document.getElementById('subscribe-status');
  const button = form.querySelector('.subscribe__button');
  const buttonLabel = form.querySelector('.subscribe__button-label');
  const input = form.querySelector('.subscribe__input');
  const defaultLabel = buttonLabel ? buttonLabel.textContent : 'Notify Me';

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message;
    if (state) {
      status.setAttribute('data-state', state);
    } else {
      status.removeAttribute('data-state');
    }
  }

  function setBusy(isBusy) {
    if (!button) return;
    button.disabled = isBusy;
    if (buttonLabel) {
      buttonLabel.textContent = isBusy ? 'Sending…' : defaultLabel;
    }
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!input || !input.value.trim()) {
      setStatus('Please enter your email address.', 'error');
      input && input.focus();
      return;
    }

    if (typeof input.checkValidity === 'function' && !input.checkValidity()) {
      setStatus('Please enter a valid email address.', 'error');
      input.focus();
      return;
    }

    setStatus('', null);
    setBusy(true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        setStatus('Thanks! We’ll let you know as soon as we launch.', 'success');
      } else {
        let message = 'Something went wrong. Please try again.';
        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length) {
            message = data.errors.map(function (e) { return e.message; }).join(' ');
          }
        } catch (_) { /* ignore parse errors */ }
        setStatus(message, 'error');
      }
    } catch (_) {
      setStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
      setBusy(false);
    }
  });
})();
