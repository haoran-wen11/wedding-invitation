# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Wedding invitation website for 文浩然 & 朱莹 — a single-page static site deployed to GitHub Pages with a Cloudflare Worker backend for RSVP submissions. The domain is `haoran-ying.online` (CNAME + Cloudflare proxy).

## Architecture

### Frontend (`index.html`)
Single HTML file containing all CSS (inline `<style>`), all markup, and all JS (inline `<script>`). Three sections scroll sequentially:
1. **Part 1** (`#home`, `.part1`) — Grand opening: couple photo, names, date, decorative SVG line art
2. **Part 2** (`#schedule`, `.part2`) — Timeline/itinerary and photo gallery (`.moments` section with 6 photos)
3. **Part 3** (`#rsvp`, `.part3`) — RSVP form (name, attendance, guest count, message) + location/detail card

### Backend (`worker.js`)
Cloudflare Worker deployed separately (not via GitHub Pages). Three routes:
- `POST /submit` — receives RSVP form data, stores to KV namespace `GUEST_DATA`
- `GET /admin?key=wenying2026` — renders an admin HTML page listing all submissions with delete buttons
- `DELETE /delete?id=X&key=wenying2026` — deletes a submission by KV key

No authentication beyond the `?key=wenying2026` query parameter.

### Asset files
- `music/bgm.mp3` — background music (2.1MB), triggered on splash click
- `photos/IMG_8146.JPG` — hero/couple photo (also used for OG image)
- `photos/1.jpg` through `photos/6.jpg` — gallery photos
- `photos/share-card-v2.png` — alternate share card image
- `.nojekyll` — required for GitHub Pages to serve files starting with `_` or `.`
- `760b52d02c598fea72a3790d5be2ecde.txt` — domain verification file (Cloudflare)

### Splash screen flow
1. Page loads → preloader spinner shows briefly, then splash screen with heartbeat animation appears
2. User clicks splash → splash fades out, background music starts playing, body `overflow:hidden` is cleared
3. WeChat browsers: `WeixinJSBridge` event triggers auto-play

### RSVP submission flow
- Form posts to `/submit` targeting a hidden `<iframe>` (`#rsvpIframe`)
- Worker returns `<script>parent.submitDone()</script>`, which shows the success message and hides the form
- Return visitors with `?submitted=1` URL param skip the splash and scroll directly to the success state

## Build & deploy

There is **no build step**. The site is plain static HTML deployed to GitHub Pages.

- **Local dev**: Open `index.html` directly in a browser, or use any static server (e.g., `python -m http.server` or ` http-server`)
- **Deploy**: Push to `main` — GitHub Actions (`.github/workflows/pages.yml`) deploys the entire repo root to GitHub Pages. No build, no minification, no dependency installation.
- **Worker deploy**: Uses the `wrangler` CLI (devDependency in `package.json`). Run `npx wrangler deploy` to push `worker.js` to Cloudflare. Requires a `wrangler.toml` (not present in repo) with KV namespace binding for `GUEST_DATA`.

## Key implementation details

- **Map links**: Non-iOS devices get a Google Maps link; iOS devices get an Apple Maps link (set by JS at runtime based on `navigator.userAgent`)
- **Scroll animations**: `IntersectionObserver` adds `.visible` to elements with `.reveal` class; staggered delays via `.reveal-d1` through `.reveal-d7`
- **Music toggle**: Fixed-position button bottom-right; rotates when playing, static when paused. Starts paused until splash click.
- **OG/Twitter meta tags**: Hardcoded in `<head>` — the image is `photos/IMG_8146.JPG`; update these if the photos change
- **Fonts**: Loaded from `fonts.loli.net` (Chinese CDN mirror for Google Fonts). Noto Serif SC, Alex Brush, Ma Shan Zheng, Long Cang, Cormorant Garamond
- **The `wrangler` dev dependency**: Only used for deploying the worker; has no effect on the frontend site

## Git workflow

- `main` is both the default branch and the deployment branch
- Commit messages end with `Co-Authored-By: Claude <noreply@anthropic.com>` per the global git config
- No PR template, no branch protection rules
