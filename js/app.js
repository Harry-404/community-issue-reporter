(function(){
  const form = document.getElementById('issue-form');
  const captureBtn = document.getElementById('capture-location');
  const locationStatus = document.getElementById('location-status');
  const payloadEl = document.getElementById('payload');
  const debug = document.getElementById('debug');
  const result = document.getElementById('result');

  let location = null;

  captureBtn.addEventListener('click', () => {
    locationStatus.textContent = 'Capturing...';
    if (!navigator.geolocation) {
      locationStatus.textContent = 'Geolocation not supported in this browser.';
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      locationStatus.textContent = `Captured: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    }, err => {
      locationStatus.textContent = 'Unable to capture location: ' + (err.message || err.code);
    }, { enableHighAccuracy: true, timeout: 10000 });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = 'Submitting...';

    const data = new FormData(form);
    const json = {
      name: data.get('name') || '',
      title: data.get('title') || '',
      description: data.get('description') || '',
      latitude: location ? location.lat : null,
      longitude: location ? location.lng : null,
      photoName: data.get('photo') && data.get('photo').name ? data.get('photo').name : null,
      createdAt: new Date().toISOString()
    };

    payloadEl.textContent = JSON.stringify(json, null, 2);
    debug.style.display = 'block';

    const cfg = window.ISSUE_CONFIG || {};
    if (cfg.googleFormAction && cfg.fieldMap) {
      // Build urlencoded payload matching Google Forms field names
      const payload = new URLSearchParams();
      const map = cfg.fieldMap;
      if (map.title) payload.append(map.title, json.title);
      if (map.description) payload.append(map.description, json.description);
      if (map.name) payload.append(map.name, json.name);
      if (map.latitude) payload.append(map.latitude, json.latitude || '');
      if (map.longitude) payload.append(map.longitude, json.longitude || '');
      // Note: Google Forms doesn't accept file uploads via simple POST from static sites.

      try {
        const resp = await fetch(cfg.googleFormAction, { method: 'POST', body: payload, mode: 'no-cors' });
        result.textContent = 'Submitted — thank you!';
      } catch (err) {
        result.textContent = 'Submission failed; see payload below.';
      }
    } else {
      result.textContent = 'No backend configured — payload shown below.';
    }
  });
})();
