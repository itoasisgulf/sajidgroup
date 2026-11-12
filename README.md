# Sajid Group of Companies website

Static site (HTML, CSS, vanilla JS). No framework, no build tools beyond Node.

## Edit content
All text, services, contacts and pages live in `build.js`, in English and Arabic side by side ({en, ar} or [en, ar]). Change it, then rebuild:

```bash
node build.js
```

This rewrites the English pages in the root, the Arabic pages in `ar/` (right to left), `sitemap.xml` and `robots.txt`. Styles are in `styles.css`, behaviour in `app.js`, images in `assets/img/`.

## Preview locally

```bash
python3 -m http.server 5610
```

Open http://localhost:5610

## Deploy
Upload everything except `inputs/`, `build.js`, `profile.js` and `README.md` to any static host (GitHub Pages, Netlify, Cloudflare Pages, cPanel). If the domain changes from sajidgroup.com, change `SITE` at the top of `build.js` and rebuild.

## Pages
Every page exists in English (`/`) and Arabic (`/ar/`), with a language switch in the menu and hreflang tags.

Home, About, Our Companies, Contact, 404, and one page per company: Interior & Technical, Real Estate, Pest Control, Advertising, Corporate Services, IT Oasis UAE (links to https://itoasisgulf.com).

## Live hosting (GitHub Pages)
- Live: https://sajidgroup.com (domain at Namecheap, DNS points to GitHub Pages; the `CNAME` file holds the domain).
- Deploy: run `node build.js`, commit, push to `main`. The workflow in `.github/workflows/pages.yml` publishes only the site files (not `build.js`, `profile.js`, `README.md`).
- Old preview: https://sajidgroup.pages.dev (Cloudflare Pages, no longer updated).
- Shareable profile: `node profile.js` writes `outputs/sajid_group_profile.html` (not deployed).
