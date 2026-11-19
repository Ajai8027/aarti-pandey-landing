# Publishing checklist (publisher actions)

The source, build, documentation and QA evidence are ready locally. A self-contained `standalone/index.html` is also included: double-click it for an instant offline preview (see `OPEN_ME.txt`). The steps below require your own GitHub and Google Drive accounts.

## 1. GitHub repository — DONE

Pushed to the public repository **https://github.com/Ajai8027/aarti-pandey-landing** on branch `main`. Verified with `git ls-remote` and by fetching `README.md` and `standalone/index.html` over HTTPS.

To pull future changes locally:

```powershell
git pull origin main
```

The repository contains the React source, source `index.html`, `standalone/index.html`, README, `OPEN_ME.txt`, QA evidence and all documentation. `dist/` and `node_modules/` are intentionally excluded by `.gitignore`.

## 2. Live HTTPS preview — DONE

Deployed to Vercel with the available token. Project: `ajaikarthicks-projects/aarti-pandey-landing`.
Production URL: **https://aarti-pandey-landing.vercel.app**
Verified at 375/768/1024px with no console errors and a working registration form.

**Vercel (repository import — recommended):**
1. Import the private repository in Vercel.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Deploy and copy the HTTPS preview/production URL.
4. Open the URL, test the form at a 375px viewport, and check all four navigation anchors.

**Alternative — Netlify CLI:**
```powershell
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

No environment variables are needed. Do not add analytics or form endpoints.

## 3. Update the deliverables with the live URLs

Replace `[INSERT URL]` in `COMPLETION_NOTE.txt`, and `[insert repository URL before submission]` / `[insert deployment URL before submission]` in `TECHNICAL_SUMMARY.html`. Regenerate the PDF after editing the HTML:

```powershell
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$proj = (Get-Location).Path
$url = 'file:///' + ($proj -replace '\\','/') + '/TECHNICAL_SUMMARY.html'
& $edge '--headless=new' '--disable-gpu' '--no-pdf-header-footer' "--print-to-pdf=$proj\TECHNICAL_SUMMARY.pdf" $url
```

Commit and push the updated files.

## 4. Google Drive submission folder

Create one folder containing:

- `TECHNICAL_SUMMARY.pdf`
- `COMPLETED_QA_MATRIX.csv`
- `COMPLETION_NOTE.txt`
- A short `LINKS.txt` with the GitHub URL and live HTTPS URL

Share the **folder** with the authorized reviewer as **Viewer** ("Anyone with the link can view" only if explicitly requested). Verify both links open while signed out, and that the reviewer can submit the form at 375px.

## 5. Final verification

- [ ] Repository is private and reviewer can open it
- [ ] Live URL uses HTTPS and loads all artwork
- [ ] All navigation anchors jump to the correct sections
- [ ] Empty, invalid and valid form submissions behave as documented
- [ ] PDF, CSV and note are present in the shared Drive folder
- [ ] No passwords or private contact details appear in public files
