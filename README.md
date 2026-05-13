# Ashwanova — Landing Page

Static React site (React 18 via CDN + Babel standalone for in-browser JSX).
No build step. Deploys as plain static files.

## Structure

```
index.html              # main landing page
formula-check.html      # secondary compliance check page
icons.jsx               # icon components
styles.css              # all styles
sections/*.jsx          # page sections (registered on window.*)
assets/                 # hero video etc.
docs/                   # public-facing PDFs (AYUSH advisory)
```

`uploads/` is source material (PDFs, screenshots, mp4 originals) — gitignored.

## Deploy (Vercel via GitHub)

1. Push this folder to a new GitHub repo
2. Import the repo in Vercel
3. Framework Preset: **Other**
4. Build Command: *(leave empty)*
5. Output Directory: *(leave empty — serves from root)*
6. Deploy

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes

- Babel standalone compiles JSX in the browser. Fine for this scale, slow at huge scale. If page weight becomes an issue later, switch to a Vite build.
- Asset cache headers are set in `vercel.json` (1 year for `/assets`, 1 day for `/docs`).
