// Configuration: set to your Google Form `action` URL and the field entry IDs if using Google Forms as a backend.
// If left empty, the app will fall back to showing the JSON payload in the debug section.

window.ISSUE_CONFIG = {
  // Example: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse'
  googleFormAction: '',

  // Map of logical fields to Google Form 'entry.<id>' names. Example: { title: 'entry.123456789', description: 'entry.987654321' }
  fieldMap: {
    name: '',
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    photoUrl: ''
  }
};
