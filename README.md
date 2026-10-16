# Eracore Learning Center — Team Leader Raising Program

An interactive learning platform for Eracore's 10-week Team Leader Raising Program (leadership course). It is a single self-contained HTML/CSS/JS file with no frameworks.

**Live demo:** see the GitHub Pages link in this repo's About section.

## What's here

| Path | Contents |
|---|---|
| `dist/leadership-course-demo.html` | The finished app. Open it in any browser. |
| `build/` | The build pipeline: Python parsers and the HTML/CSS/JS pieces that make up the app. |
| `RECREATE.md` | Full documentation: architecture, data model, design system, features and how to extend it. |

## Rebuilding

The five source `.docx` documents are internal and are not in this repo. To rebuild, put them in `source/` and run:

```bash
pip install python-docx
bash build/build.sh
```

## Demo limits

Progress is saved per browser (localStorage). There is no sign-in or shared storage, so this is a demo, not the production platform. See section 9 of `RECREATE.md`.
