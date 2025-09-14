(function(){
  // Simple client-side auth and issue tracker using localStorage.
  // Note: This is only for demo purposes. Do not use localStorage auth in production.

  // Elements
  const form = document.getElementById('issue-form');
  const captureBtn = document.getElementById('capture-location');
  const locationStatus = document.getElementById('location-status');
  const result = document.getElementById('result');
  const issuesList = document.getElementById('issues-list');
  const snackbar = document.getElementById('snackbar');

  const btnSignin = document.getElementById('btn-signin');
  const btnSignup = document.getElementById('btn-signup');
  // Add Google Sign-in button container
  const googleSignInContainer = document.createElement('div');
  googleSignInContainer.id = 'gsi-button-container';
  googleSignInContainer.style.display = 'inline-block';
  document.querySelector('.auth-actions').insertBefore(googleSignInContainer, btnSignin);
  const btnSignout = document.getElementById('btn-signout');
  const currentUserEl = document.getElementById('current-user');

  const authModal = document.getElementById('auth-modal');
  const authTitle = document.getElementById('auth-title');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authSubmit = document.getElementById('auth-submit');
  const authCancel = document.getElementById('auth-cancel');
  const authMessage = document.getElementById('auth-message');

  const category = document.getElementById('category');
  const otherLabel = document.getElementById('other-label');
  const categoryOther = document.getElementById('category-other');

  let location = null;
  let currentUser = null; // {email, role}
  let googleAccessToken = null;

  // Utilities
  function showSnackbar(text) {
    snackbar.textContent = text;
    snackbar.style.display = 'block';
    setTimeout(()=> snackbar.style.display = 'none', 3000);
  }

  function saveUsers(users) { localStorage.setItem('cir_users', JSON.stringify(users || [])); }
  (function(){
    // Simplified local-only client-side issue reporter.

    const form = document.getElementById('issue-form');
    const captureBtn = document.getElementById('capture-location');
    const locationStatus = document.getElementById('location-status');
    const result = document.getElementById('result');
    const issuesList = document.getElementById('issues-list');
    const snackbar = document.getElementById('snackbar');

    const category = document.getElementById('category');
    const otherLabel = document.getElementById('other-label');
    const categoryOther = document.getElementById('category-other');

    // Title dropdown + other
    const titleSelectWrapper = document.createElement('div');
    titleSelectWrapper.innerHTML = `
      <label>
        Suggested title
        <select id="suggested-title">
          <option value="Pothole">Pothole</option>
          <option value="Broken street light">Broken street light</option>
          <option value="Overflowing drain">Overflowing drain</option>
          <option value="Noise complaint">Noise complaint</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label id="title-other-label" style="display:none">
        Other title
        <input type="text" id="title-other" />
      </label>
    `;
    const titleField = document.getElementById('title');
    titleField.parentNode.insertBefore(titleSelectWrapper, titleField);

    const titleSelect = document.getElementById('suggested-title');
    const titleOtherLabel = document.getElementById('title-other-label');
    const titleOther = document.getElementById('title-other');

    function showSnackbar(text) {
      snackbar.textContent = text; snackbar.style.display = 'block';
      setTimeout(()=> snackbar.style.display = 'none', 3000);
    }

    function saveIssues(issues){ localStorage.setItem('cir_issues', JSON.stringify(issues||[])); }
    function loadIssues(){ return JSON.parse(localStorage.getItem('cir_issues')||'[]'); }

    function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

    function renderIssues(){
      const issues = loadIssues().slice().reverse();
      issuesList.innerHTML = '';
      if (issues.length===0) { issuesList.innerHTML = '<div class="muted">No issues reported yet.</div>'; return; }
      for (const issue of issues) {
        const el = document.createElement('div'); el.className='issue-card';
        el.innerHTML = `
          <div class="issue-meta"><strong>${escapeHtml(issue.title)}</strong> — <span class="muted">${escapeHtml(issue.category)}</span></div>
          <div>${escapeHtml(issue.description)}</div>
          <div class="issue-meta">By ${escapeHtml(issue.name||'Anonymous')} • ${new Date(issue.createdAt).toLocaleString()}</div>
          <div class="issue-status muted">Status: ${escapeHtml(issue.status||'New')}</div>
        `;
        issuesList.appendChild(el);
      }
    }

    // Category 'Other' toggle
    category.addEventListener('change', ()=>{
      if (category.value==='other') { otherLabel.style.display='block'; } else { otherLabel.style.display='none'; }
    });

    // Title dropdown behavior
    titleSelect.addEventListener('change', ()=>{
      if (titleSelect.value === 'Other') { titleOtherLabel.style.display='block'; titleField.style.display='none'; }
      else { titleOtherLabel.style.display='none'; titleField.style.display='block'; titleField.value = titleSelect.value; }
    });

    titleOther.addEventListener('input', ()=>{ titleField.value = titleOther.value; });

    // Location capture
    let location = null;
    captureBtn.addEventListener('click', () => {
      locationStatus.textContent = 'Capturing...';
      if (!navigator.geolocation) { locationStatus.textContent = 'Geolocation not supported'; return; }
      navigator.geolocation.getCurrentPosition(pos => {
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        locationStatus.textContent = `Captured: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
      }, err => { locationStatus.textContent = 'Unable to capture location'; }, { enableHighAccuracy: true, timeout: 10000 });
    });

    // Submit
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const title = titleField.value.trim();
      const desc = document.getElementById('description').value.trim();
      const name = document.getElementById('name').value.trim();
      let cat = category.value; if (cat==='other') cat = categoryOther.value.trim() || 'Other';
      if (!title || !desc) { result.textContent='Please provide title and description'; return; }
      const issues = loadIssues();
      const id = 'i_' + Date.now();
      const issue = { id, title, description: desc, name, category: cat, latitude: location?location.lat:null, longitude: location?location.lng:null, createdAt: new Date().toISOString(), status: 'New' };
      issues.push(issue); saveIssues(issues);
      form.reset(); location = null; locationStatus.textContent='Not captured'; otherLabel.style.display='none'; titleOtherLabel.style.display='none';
      renderIssues(); showSnackbar('Issue submitted');
    });

    // Init
    (function init(){ renderIssues(); })();

  })();
  authSubmit.addEventListener('click', ()=>{
