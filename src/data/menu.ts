/**
 * ─────────────────────────────────────────────────────────────
 *  MENU — featured items and prices shown on the website.
 *
 *  • `price` is a display string. A trailing "+" means
 *    "starting at" (e.g. size or milk upgrades).
 *  • Leave `price` undefined when no price has been supplied —
 *    never guess a price. Unpriced items render without one.
 *  • `image` points at a key in gallery.ts.
 * ─────────────────────────────────────────────────────────────
 */
import { images, type SiteImage } from './gallery'

export interface MenuItem {
  name: string
  price?: string
  description?: string
  /** Preview image shown on hover. Optional. */
  image?: SiteImage
  tags?: string[]
}

export interface MenuCategory {
  id: string
  label: string
  kicker: string
  items: MenuItem[]
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'coffee',
    label: 'Coffee & Drinks',
    kicker: '01',
    items: [
      { name: 'Drip Coffee', price: '$4.00+', image: images.coffeeHero },
      { name: 'Flat White', price: '$4.50+', image: images.latteArt },
      { name: 'Latte', price: '$5.25+', image: images.hero },
      { name: 'Iced Matcha Latte', price: '$5.25+', image: images.matcha },
      { name: 'Draft Cold Brew', price: '$5.00+', image: images.coldBrew },
    ],
  },
  {
    id: 'brunch',
    label: 'Brunch & Savory',
    kicker: '02',
    items: [
      {
        name: 'Green Eggs Benedict',
        price: '$12.25',
        description: 'Served with hash browns, avocado, and baby spinach.',
        image: images.benedict,
      },
      {
        name: 'Soup & Grilled Sourdough Sandwich',
        price: '$11.15',
        image: images.soup,
      },
      {
        name: 'T.A.T.S. Sandwich',
        price: '$13.50',
        description: 'Turkey, avocado, tomato, and spinach on honey wheat.',
        image: images.sandwich,
      },
    ],
  },
  {
    id: 'sweet',
    label: 'Sweet Treats',
    kicker: '03',
    items: [
      {
        name: 'Nutella Crepe',
        price: '$11.85',
        description: 'With strawberries and banana.',
        image: images.crepe,
      },
    ],
  },
]

/** Also on the menu — no prices supplied, so none are shown. */
export const alsoFeatured: MenuItem[] = [
  { name: 'Ebelskivers', image: images.pancakes },
  { name: 'Brunch Bowls', image: images.brunchBowl },
  { name: 'Mashed Potato Volcano' },
  { name: 'Baked Goods', image: images.pastries },
]

export const menuDisclaimer =
  'Menu items and prices may change. Please confirm availability with the café.'
