/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGE LIBRARY — every photograph on the site is defined here.
 *
 *  IMPORTANT: These are temporary, licensed stock photographs
 *  (Unsplash License) used for illustration only. They are NOT
 *  photos of Café 1 of a Kind, its food or its interior.
 *
 *  To swap in official photography:
 *    1. Drop files into /public/images (e.g. /public/images/hero.jpg)
 *    2. Replace the `src` below with '/images/hero.jpg'
 *    3. Update the `alt` text to describe the new photo
 *    4. Set `showStockPhotoNotice: false` in siteConfig.ts
 *
 *  If an image ever fails to load, <Img> shows a warm, branded
 *  placeholder instead of a broken-image icon.
 * ─────────────────────────────────────────────────────────────
 */

export interface SiteImage {
  src: string
  alt: string
  /** Optional CSS object-position, e.g. 'center 30%'. */
  position?: string
}

const u = (id: string) => `https://images.unsplash.com/${id}`

export const images = {
  hero: {
    src: u('photo-1509042239860-f550ce710b93'),
    alt: 'Steamed milk being poured into a ceramic cup of espresso, forming latte art',
  },
  story: {
    src: u('photo-1554118811-1e0d58224f24'),
    alt: 'A warm, wood-accented café interior with soft daylight and tables',
  },
  storyDetail: {
    src: u('photo-1495474472287-4d71bcdd2085'),
    alt: 'A cup of coffee resting on a wooden table',
  },
  coffeeHero: {
    src: u('photo-1447933601403-0c6688de566e'),
    alt: 'Close-up of a freshly made coffee in a ceramic cup',
  },
  espresso: {
    src: u('photo-1510707577719-ae7c14805e3a'),
    alt: 'A short espresso in a small cup',
  },
  coldBrew: {
    src: u('photo-1461023058943-07fcbe16d735'),
    alt: 'An iced coffee in a tall glass',
  },
  matcha: {
    src: u('photo-1515823064-d6e0c04616a7'),
    alt: 'A green matcha latte',
  },
  benedict: {
    src: u('photo-1608039829572-78524f79c4c7'),
    alt: 'Poached eggs on toast with greens on a brunch plate',
  },
  sandwich: {
    src: u('photo-1528735602780-2552fd46c7af'),
    alt: 'A stacked sandwich on a board',
  },
  soup: {
    src: u('photo-1547592166-23ac45744acd'),
    alt: 'A bowl of soup served with toasted bread',
  },
  crepe: {
    src: u('photo-1519676867240-f03562e64548'),
    alt: 'A dessert crepe served with fresh fruit',
  },
  brunchBowl: {
    src: u('photo-1512621776951-a57141f2eefd'),
    alt: 'A colorful brunch bowl with vegetables and greens',
  },
  pancakes: {
    src: u('photo-1528207776546-365bb710ee93'),
    alt: 'Small golden pancakes dusted with sugar',
  },
  pastries: {
    src: u('photo-1555507036-ab1f4038808a'),
    alt: 'Freshly baked croissants and pastries',
  },
  dessert: {
    src: u('photo-1551024601-bec78aea704b'),
    alt: 'An assortment of sweet baked treats',
  },
  latteArt: {
    src: u('photo-1511920170033-f8396924c348'),
    alt: 'Latte art in a white cup viewed from above',
  },
  coffeeCups: {
    src: u('photo-1442512595331-e89e73853f31'),
    alt: 'Coffee cups and beans arranged on a table',
  },
  interior: {
    src: u('photo-1501339847302-ac426a4a7cbb'),
    alt: 'A cozy café interior with warm lighting',
  },
  patio: {
    src: u('photo-1445116572660-236099ec97a0'),
    alt: 'Café tables and chairs set out in daylight',
  },
  coffeePastry: {
    src: u('photo-1517433670267-08bbd4be890f'),
    alt: 'A coffee served alongside a pastry',
  },
  barista: {
    src: u('photo-1498804103079-a6351b050096'),
    alt: 'A barista preparing coffee behind the counter',
  },
} satisfies Record<string, SiteImage>

export type ImageKey = keyof typeof images

export interface GalleryItem {
  image: SiteImage
  caption: string
  /** Grid shape on desktop. */
  shape: 'tall' | 'wide' | 'square' | 'large'
}

/** The atmosphere gallery, in display order. */
export const gallery: GalleryItem[] = [
  { image: images.barista, caption: 'Behind the bar', shape: 'tall' },
  { image: images.latteArt, caption: 'Latte art', shape: 'square' },
  { image: images.interior, caption: 'Warm interiors', shape: 'wide' },
  { image: images.benedict, caption: 'Brunch plates', shape: 'large' },
  { image: images.coffeeCups, caption: 'Coffee cups', shape: 'wide' },
  { image: images.dessert, caption: 'Something sweet', shape: 'tall' },
  { image: images.patio, caption: 'Outdoor patio', shape: 'wide' },
  { image: images.coffeePastry, caption: 'Coffee & pastry', shape: 'square' },
]
