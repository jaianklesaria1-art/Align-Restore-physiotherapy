# Align and Restore Physiotherapy — website

A hand-coded static site (no build step, no framework) replacing the old Hostinger
builder site. Plain HTML/CSS/JS — open any page directly, or serve the folder.

## Structure

```
index.html        Home
about.html         About Us / Why Choose Us / Approach / Vision
conditions.html    Conditions Treated (MSK, Post-Surgery, Home Visits) + testimonials
prices.html        Price list + FAQ
contact.html       Contact form + map + hours
css/styles.css      All styling (single shared stylesheet)
js/main.js          Nav toggle, scroll reveal, FAQ accordion, form handling
```

## Preview locally

Any static server works, e.g.:

```
npx serve .
```

then open the printed localhost URL.

## Before going live

1. **Map embed.** `contact.html` uses a keyless Google Maps embed (shows a
   "for development purposes only" watermark). For a clean production embed,
   get a free Google Maps Embed API key and swap the iframe `src`.
2. **Images.** The hero and section art are custom line-art SVG (no stock
   photos), so there's nothing broken to fix — but real photos of Mahima
   and/or the clinic would build more trust. Swap the `.hero-art`/`.page-hero`
   SVGs for `<img>` tags whenever photos are available.
3. **Domain.** Point `alignrestore.co.uk` at wherever you deploy this
   (Netlify, Vercel, GitHub Pages, or Hostinger's plain file hosting all work
   — it's just static files).
4. **Analytics.** The old site had Google Analytics (`G-YX8BSWY1ZL`) and
   Google Ads tags wired up via the site builder. Add back a GA4 snippet in
   each page's `<head>` if you want that tracking again.

## Content source

All copy, pricing, FAQs, and testimonials were pulled directly from the live
site at alignrestore.co.uk (Aug 2026) — nothing was invented. Update prices in
`prices.html` (`<table class="price-table">`) whenever they change.
