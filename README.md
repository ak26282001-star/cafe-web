# Café 1 of a Kind — website

A single-page site for **Café 1 of a Kind**, 255-13 Northern Blvd, Little Neck, NY 11362.
Built with React 19, TypeScript, Vite, Tailwind CSS v4, GSAP + ScrollTrigger, Motion for React, Lenis and Lucide icons.

## Run it

```bash
npm install
npm run dev        # local dev server → http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build → http://localhost:4173
```

Node 20+ is recommended. `dist/` is a static site that any static host can serve (Netlify, Vercel, Cloudflare Pages, S3 and so on).

## Where to edit content

| What | File |
| --- | --- |
| Name, phone, address, **hours**, **rating / review count**, links, amenities, nav | `src/data/siteConfig.ts` |
| Menu items and **prices**, disclaimer | `src/data/menu.ts` |
| **Every photo** (URLs and alt text) and the gallery order | `src/data/gallery.ts` |
| Verified customer reviews (empty by default) | `src/data/reviews.ts` |

The SEO tags (title, description, canonical, Open Graph, Twitter) and the `CafeOrCoffeeShop` JSON-LD are
generated from `siteConfig.ts` at build time by a small plugin in `vite.config.ts`. You never need to edit `index.html`.

### Placeholders the owner should fill in

- **`fullMenuUrl`**: no verified menu page was available, so the "View full menu" buttons link to the official website home page. Set this to the real menu URL.
- **`instagramUrl`**: left `null` (not verified). No Instagram link renders until it's set.
- **`parking`** and **`geo`**: left `null` (not verified).
- **`maps.reviewsUrl`**: currently a Google Maps search for the café. You can swap in the direct Google review link.
- **Photography**: every image is temporary **Unsplash stock** used for illustration. None of them show the café. Put official photos in `public/images/`, point `gallery.ts` at them (for example `/images/hero.jpg`), update the alt text, then set `showStockPhotoNotice: false`. If an image fails to load, a branded placeholder appears instead of a broken image.
- **Reviews**: none are invented. Add real, verbatim reviews you have permission to show to `reviews.ts`, and a carousel appears automatically.
- **Hours** are shown with a "please confirm" notice. The live *Open now / Closed now* badge is calculated in the America/New_York time zone from `siteConfig.hours`.

`npm` does not regenerate `public/og-image.jpg` or `public/apple-touch-icon.png`. To rebuild them after a brand change, run `node scripts/generate-og.mjs` (needs `playwright`).

## Motion architecture

- **GSAP + ScrollTrigger** (`src/lib/gsap.ts`) handles every scroll-linked and intro animation: line-mask heading reveals, clip-path image reveals, restrained parallax, the count-up rating and the footer reveal. All tweens are created inside `useGSAP`, so they revert on unmount.
- **Motion for React** (`LazyMotion` + `domAnimation`) handles UI that mounts and unmounts: the mobile menu and the gallery lightbox.
- **Lenis** smooth scroll runs on GSAP's ticker, so it shares a single animation frame with ScrollTrigger. Keyboard scrolling stays native.
- **Reduced motion**: when `prefers-reduced-motion` is set, Lenis, parallax and reveals are all skipped and CSS loops are disabled.
- Content is never hidden behind an animation. GSAP only sets *starting* states at runtime, so without JavaScript or with reduced motion everything is visible straight away. Parallax runs only at tablet width and up (≥768px or ≥1024px).

## Structure

```
src/
  components/  Navbar, Hero, BrandStory, Marquee, MenuPreview, CoffeeExperience,
               BrunchSection, Gallery (+ lightbox), Reviews, Location, Footer,
               AnimatedButton, Reveal (RevealLines / Reveal / RevealImage), Parallax, Img, Wordmark
  data/        siteConfig.ts, menu.ts, gallery.ts, reviews.ts
  hooks/       useReducedMotion.ts
  lib/         gsap.ts, smoothScroll.ts, hours.ts, image.ts
  styles/      globals.css (Tailwind theme tokens + motion utilities)
```

## Accessibility notes

The page includes a skip link and semantic landmarks, with one `h1` and an ordered heading hierarchy. Focus is visible throughout. The mobile menu and the lightbox trap focus, close with Esc and return focus when closed; the lightbox also supports ←/→ keys and swipe. In-page links move focus to their target section, and external links are announced as opening in a new tab. Phone and address links are clickable.
