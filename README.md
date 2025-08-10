# Pulse (GitHub Pages Ready)

A calm, installable PWA to track health & habits — **no backend needed**.

## One-time setup (GitHub Pages)
1. Create a free GitHub account.
2. New repository → name it `pulse-tracker` (Public).
3. Click **Add file → Upload files** and drag **ALL files inside this ZIP** (do not upload the folder itself).
4. Commit the changes.
5. Repo **Settings → Pages** → Source = `main` / `(root)` → Save.
6. Your site will be live shortly at: `https://<your-username>.github.io/pulse-tracker/`

## Install on iPhone
- Open the URL in **Safari** → Share → **Add to Home Screen**.

## Shortcuts import (Steps example)
Create an iOS Shortcut ending with **Open URLs**:
```
https://<your-username>.github.io/pulse-tracker/index.html#import?type=steps&steps=5000&date=2025-08-10
```

## Developer notes
- Static PWA: `index.html`, `manifest.webmanifest`, `sw.js`, `icons/`
- Local storage only (IndexedDB). No server or database required.
- `.nojekyll` disables Jekyll processing on GitHub Pages.
