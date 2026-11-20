# RadiusBot website

Published at https://radiusbot.com/ (GitHub Pages, repo `radiusbot/radiusbot.github.io`, `main` branch, root; custom domain set in `CNAME`).

It's the developer website listed in Play Console, the App Store (Marketing URL) and AdMob, and it serves `app-ads.txt` at the domain root, where AdMob looks for it.

| File | What it is |
|---|---|
| `index.html` | The page: hero, our work, services, process, technology, why us, FAQ, contact. Every claim on it must be true: no invented stats, clients, awards or reviews. |
| `styles.css` | All styling. Colours and type follow the RadiusBot brand guidelines (Night Navy, Radius Cyan, Avenir Next). |
| `main.js` | Mobile menu, process tabs, contact form, scroll reveal. The page works without it. |
| `assets/` | Logo lockup, icons, share image (`og-image.png`) and app screenshots/icons. |
| `favicon.ico`, `favicon.svg`, `site.webmanifest` | Browser-tab and Google Search icon. Google picks a square icon whose size is a multiple of 48px. |
| `robots.txt`, `sitemap.xml` | Let search engines find the page. |
| `app-ads.txt` | Authorized ad sellers. The Google line covers both the Android and iOS apps (publisher `pub-1337229327886397`). |
| `google39ce9a81df6c3925.html` | Google Search Console ownership check. Don't delete. |

## Contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards each message to `radiusbot@gmail.com` (GitHub Pages can't run a server). It's activated, and the page addresses it by FormSubmit's alias (`FORM_ID` in `main.js`, and the form's `action`) instead of the email address. The email address isn't shown on the page; it appears only if a message fails to send, with a link to a pre-filled email.

## Search (SEO)

- `<title>`, meta description and headings use the terms people search for: Flutter, React Native, mobile app development, website development.
- Structured data in `index.html` (JSON-LD): Organization (name, logo, services), WebSite (site name in results), both apps as MobileApplication, and the FAQ. Check it with Google's Rich Results Test after changes.
- `sitemap.xml` (update `lastmod` when the page changes) and `robots.txt`.
- In Search Console: submit `https://radiusbot.com/sitemap.xml`, and request indexing after big changes.

## Logo and brand

The brand kit (vector mark, lockups, guidelines) is kept outside this repo, in `RadiusBot Company/Logo` on the owner's Desktop. Icons here were exported from `out/logo/app-icon-1024.png`, `out/logo/mark.svg` and `out/logo/lockup-on-dark.png`.

## Deploying

After editing `styles.css` or `main.js`, update the `?v=` stamp on its link in `index.html` (first 10 characters of `shasum -a 256 <file>`). GitHub Pages lets browsers cache files for 10 minutes; a new stamp makes them fetch the new file at once instead of mixing new HTML with old styles.

Push to `main`. GitHub Pages updates within a few minutes. Google refreshes the search icon and site name the next time it crawls the page, which can take days to weeks; Search Console → URL Inspection → Request indexing speeds it up.
