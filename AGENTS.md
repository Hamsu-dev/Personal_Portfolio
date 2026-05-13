# AGENTS.md

## Cursor Cloud specific instructions

This is a static HTML/CSS/JS portfolio website with no build system, no package manager, and no backend. All external dependencies (fonts, icons, ScrollReveal, particles.js) are loaded via CDN `<script>` and `<link>` tags.

### Running the dev server

```bash
python3 -m http.server 8080
```

Serves the site at `http://localhost:8080/`. All three pages are accessible:
- `/index.html` — main portfolio
- `/share.html` — link-sharing page
- `/thefrogprince.html` — HHB Studio / The Frog Prince page

### Lint / Test / Build

There are no linters, test frameworks, or build steps configured. Validation is done by verifying pages return HTTP 200 and render correctly in a browser.

### Key notes

- No `package.json`, `requirements.txt`, or lockfiles exist — there are zero installable dependencies.
- The `Start-Local-Site.bat` is a Windows convenience script; on Linux use `python3 -m http.server 8080` directly.
- CDN access (internet) is needed for full visual fidelity (icons, fonts, animations). The site structurally loads without them but will look degraded.
