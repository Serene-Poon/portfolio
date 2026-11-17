# Serene Poon — Portfolio Website

Static site. No build step, no framework. Bilingual EN / 繁中.

```
serene-portfolio/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/main.js
│  ├─ fonts/AbrilFatface-Regular.ttf
│  ├─ cv.pdf
│  └─ img/
│     ├─ design-01…15.jpg      (Design Work)
│     ├─ photo-01…14.jpg       (Photography, no captions)
│     └─ showreel-poster.jpg   (video cover, taken from the Drive thumbnail)
└─ README.md
```

## Sections

| Section | Contents |
|---|---|
| Hero | Name, positioning line, links to work / ShowReel / CV |
| Work | 15 design projects |
| Motion | ShowReel 2026 — click-to-play Google Drive embed |
| Photography | 14 images, **no captions** (hover zoom only) |
| About | Bio, tools, at-a-glance facts |
| Contact | Email, CV (no phone number shown) |

## Bilingual

- Toggle at the bottom of the sidebar (EN / 中文)
- Any element with `data-en` and `data-zh` is translated on the fly
- Shareable links: `?lang=zh` or `?lang=en`
- Choice is remembered in `localStorage`

To translate something new:

```html
<p data-en="English text" data-zh="中文文字">English text</p>
```

## Editing

| What | Where |
|---|---|
| Project title (hover + lightbox) | `figure.tile` → `data-title="…"` |
| Project meta line | `figure.tile` → `data-meta="…"` |
| Visible hover caption | the `<figcaption>` inside the tile |
| Nav / hero / about / contact text | `data-en` / `data-zh` attributes |
| Colours | `assets/css/style.css` → `:root` |
| Video | `#showreel` in `index.html` + the URL in `main.js` |

Add a project:

```html
<figure class="tile" data-title="Project name" data-meta="Format · Year">
  <img src="assets/img/design-16.jpg" alt="Short description" loading="lazy">
  <figcaption>Project name</figcaption>
</figure>
```

## Publish

**Netlify Drop** (fastest): https://app.netlify.com/drop → drag this folder → live in ~20 s.

**GitHub Pages**: push the folder contents to a repo → Settings → Pages → deploy from `main` / root.

**Cloudflare Pages**: https://pages.cloudflare.com → Direct upload.

## Notes

- Fonts: Abril Fatface (SIL OFL). Chinese falls back to Noto Serif HK / Noto Sans HK, both common on macOS, Windows and Android.
- Hero marquee: duplicated `<span class="marquee-item">` inside `.marquee-track`; the `-50%` animation loops seamlessly. Hover pauses it, `prefers-reduced-motion` stops it.
- Custom cursor: the small diamond follows the pointer with a soft lag and enlarges over links, buttons and tiles. Disabled automatically on touch devices.
- Images ~1400 px on the long edge, 150–580 KB each. Total ≈ 8.9 MB.
- Keyboard: `Tab` to a tile → `Enter` opens → `←` `→` navigate → `Esc` closes.
- The Drive video must stay shared as “anyone with the link” or the Motion player will show an error.
