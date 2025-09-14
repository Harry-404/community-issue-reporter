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
# community-issue-reporter
A React-based web app for reporting community issues (potholes, broken lights, etc.) with Google Forms/Sheets as the backend. Frontend-only, deployable on GitHub Pages
