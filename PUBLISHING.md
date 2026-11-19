# Publishing checklist (publisher actions)

The source, build, documentation and QA evidence are ready locally. The steps below require your own GitHub, hosting and Google Drive accounts; no remote action has been taken.

## 1. Private GitHub repository with reviewer access

From PowerShell, inside `aarti-pandey-landing/`:

A local Git repository with one clean commit is already included. Confirm its status and add any last edits:

```powershell
git status
git add .
git commit -m "Add publication links and final documentation"
```

If the `.git` directory was removed, recreate it with `git init -b main` before committing. Create an **empty private** repository on GitHub (web UI or `gh repo create <name> --private`), then:

```powershell
git remote add origin https://github.com/<your-account>/<repo-name>.git
git push -u origin main
```

In repository **Settings → Collaborators**, add the authorized reviewer with **Read** access. Confirm the README, `dist/` exclusions (see `.gitignore`), source and QA evidence are present on the main branch.

## 2. Live HTTPS preview

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
