# Community Issue Reporter

Simple no-backend static site to let community members report issues with optional geolocation capture. It's designed to post to a Google Form (or show the JSON payload when no backend is configured).

Quick start

1. Install Python (for local static preview) or use any static server.
2. From the project root run in PowerShell:

```powershell
cd d:/community-issue-reporter
python -m http.server 8000; Start-Process "http://localhost:8000"
```

3. Open `http://localhost:8000` in your browser.

Configuration

- Edit `js/config.js` and set `googleFormAction` to your Google Form's `formResponse` URL, and provide the `entry.*` field names in `fieldMap` if you want submissions to go to Google Forms.
- If `googleFormAction` is blank the app will show the JSON payload on submit (useful for testing or building a different backend).

Notes

- Google Forms doesn't accept file uploads from static sites; the `photo` field is only included as filename metadata.
- Geolocation requires user permission and a secure context (HTTPS) in production. Local `http://localhost` is allowed by browsers for testing.

License: MIT

Publishing to GitHub Pages

This repository includes a GitHub Actions workflow that automatically publishes the repository root to the `gh-pages` branch when you push to `main`.

How it works

- A workflow file is included at `.github/workflows/gh-pages.yml` which runs on `push` to `main`.
- It uses `peaceiris/actions-gh-pages` to push the contents of the repository root to the `gh-pages` branch using the automatically provided `GITHUB_TOKEN`.
- A `.nojekyll` file is included to prevent GitHub Pages from processing the site with Jekyll.

To deploy

1. Push your changes to the `main` branch:

```powershell
git add -A; git commit -m "chore: prepare site for GitHub Pages"; git push origin main
```

2. GitHub Actions will run the `Deploy to GitHub Pages` workflow. After it completes, enable GitHub Pages in the repository settings and set it to serve from the `gh-pages` branch (root).

3. The site will be available at `https://<your-github-username>.github.io/<repo-name>/` (or your custom domain if configured).

Notes

- If you want the action to publish only the `build` directory (for example if you add a build step later), change `publish_dir` in the workflow to `./build`.
- You can test locally using `python -m http.server` as documented above before pushing.

Using npm build (recommended)

This repository includes a minimal `npm` build that copies the repository contents into a `build/` directory which the GitHub Actions workflow publishes.

Locally:

```powershell
# install Node.js (if not installed)
npm install
npm run build
# serve the build folder locally
cd build
python -m http.server 8000
Start-Process "http://localhost:8000"
```

When you push to `main` the workflow will run `npm ci` and `npm run build` automatically and publish `build/` to the `gh-pages` branch.
# community-issue-reporter
A React-based web app for reporting community issues (potholes, broken lights, etc.) with Google Forms/Sheets as the backend. Frontend-only, deployable on GitHub Pages

Local-only storage (no Google Sheets, no OAuth)

This repository now uses only browser `localStorage` to persist submitted issues. There is no OAuth, no Google Sheets integration, and no secret injection in CI. This keeps the project simple and self-contained.

Where data lives
- Issues: stored in the browser's `localStorage` under the key `cir_issues`.
- Users (demo auth): `cir_users` and current user in `cir_current`.

To make site production-ready with a server-backed store, consider adding a server or serverless function to accept submissions and persist them in a database or spreadsheet. I can scaffold that if you want.

Troubleshooting — no updates visible on the web
- Ensure GitHub Pages is configured to serve from the `gh-pages` branch (Settings → Pages → Branch: `gh-pages`, Folder: `/`).
- Check Actions → your latest `Deploy to GitHub Pages` run and ensure it completed successfully. If it failed, open the run and copy the step errors here and I will help debug.
- If you prefer Pages to serve from `main`/root instead, I can update the workflow, but we'll need to add loop prevention to avoid the action publishing causing itself to re-run.

Using Google Sign-In and writing to a private Google Sheet (advanced)

If you want sign-in with Google accounts (OAuth) and to write submissions directly into the Google Sheet you provided without making it public, follow these steps:

1) Create a Google Cloud project and OAuth client:
	- Go to https://console.cloud.google.com/apis/credentials
	- Create a new project or use an existing one.
	- Enable the "Google Sheets API" for the project (APIs & Services → Library → Search "Google Sheets API" → Enable).
	- Create OAuth 2.0 Client ID credentials: Application type: "Web application". Add `https://<your-github-username>.github.io/<repo>/` or `http://localhost:8000` to the Authorized JavaScript origins. Copy the Client ID.

2) Update `js/config.js` in the repo:

```js
window.ISSUE_CONFIG.oauthClientId = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
window.ISSUE_CONFIG.sheetId = '19PNvmXPxgtDNvG5puMWGDITfvfbnRo0XRc-gETd8UBU';
window.ISSUE_CONFIG.sheetRange = 'Sheet1!A:K';
window.ISSUE_CONFIG.storage = 'sheet';
```

3) Deploy the site (build & push) so that the published site matches the OAuth allowed origins. The app will offer a "Sign in with Google" flow and request permission to append to your sheet. When a user signs in and grants permission their client will be used to append rows via the Sheets API.

Security notes
- The sheet remains private. The app uses the signed-in user's OAuth token to call the Sheets API; you must ensure the OAuth client is configured to accept requests from your published domain.
- This requires users to grant the Sheets scope; only signed-in users can write to the sheet.
