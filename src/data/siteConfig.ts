/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — the single source of truth for business
 *  details. Edit this file to update hours, rating, contact info
 *  and links. Everything on the site (and the SEO metadata /
 *  structured data injected into index.html at build time) reads
 *  from here.
 * ─────────────────────────────────────────────────────────────
 */

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface DayHours {
  day: DayKey
  label: string
  /** 24h "HH:MM" in the café's local time zone, or null when closed. */
  open: string | null
  close: string | null
}

const address = {
  street: '255-13 Northern Blvd',
  locality: 'Little Neck',
  region: 'NY',
  postalCode: '11362',
  country: 'US',
  neighborhood: 'Little Neck, Queens',
}

const fullAddress = `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`
const mapsQuery = encodeURIComponent(`Café 1 of a Kind, ${fullAddress}`)

export const siteConfig = {
  name: 'Café 1 of a Kind',
  shortName: '1 of a Kind',
  tagline: 'Good coffee. Good food. One of a kind.',
  description:
    'Discover specialty coffee, brunch favorites, sandwiches, and desserts at Café 1 of a Kind in Little Neck, Queens, NY.',
  seoTitle: 'Café 1 of a Kind | Specialty Coffee & Brunch in Little Neck, Queens',

  /** Canonical production URL — no trailing slash. */
  siteUrl: 'https://www.cafe1ofakind.com',
  /** Official website, as supplied. */
  website: 'https://www.cafe1ofakind.com',

  /**
   * Official full-menu URL.
   * TODO(owner): replace `null` with the verified menu page URL.
   * While null, the "View full menu" buttons fall back to the
   * official website home page (never an invented URL).
   */
  fullMenuUrl: null as string | null,

  /**
   * Official Instagram profile.
   * TODO(owner): add the verified profile URL. While null, no
   * Instagram link is rendered anywhere.
   */
  instagramUrl: null as string | null,

  phone: {
    display: '(347) 408-4780',
    href: 'tel:+13474084780',
    e164: '+1-347-408-4780',
  },

  address,
  fullAddress,
  geo: null as { latitude: number; longitude: number } | null, // TODO(owner): optional verified coordinates for schema.org

  maps: {
    /** Opens the café in Google Maps (search link — no API key needed). */
    searchUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
    /** Opens turn-by-turn directions in Google Maps. */
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
    /** Keyless embed for the location section. */
    embedUrl: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
    /**
     * Where the "Read reviews on Google" button points.
     * TODO(owner): swap for the café's direct Google Business review link if desired.
     */
    reviewsUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  },

  priceRange: '$10–20',

  /** Supplied Google rating figures — update as they change. */
  rating: {
    value: 4.4,
    best: 5,
    count: 808,
    /** Shown as "Approximately 808 Google reviews". */
    approximate: true,
    source: 'Google',
  },

  timeZone: 'America/New_York',
  /** Supplied hours. Business hours can change — keep this current. */
  hours: [
    { day: 'mon', label: 'Monday', open: '10:00', close: '18:30' },
    { day: 'tue', label: 'Tuesday', open: '10:00', close: '18:30' },
    { day: 'wed', label: 'Wednesday', open: '10:00', close: '18:30' },
    { day: 'thu', label: 'Thursday', open: '10:00', close: '18:30' },
    { day: 'fri', label: 'Friday', open: '10:00', close: '18:30' },
    { day: 'sat', label: 'Saturday', open: '10:00', close: '18:30' },
    { day: 'sun', label: 'Sunday', open: '10:00', close: '18:30' },
  ] satisfies DayHours[],
  hoursNotice: 'Hours can change — please call ahead to confirm before visiting.',

  /** Amenities shown in the Visit section. Set to false to hide. */
  amenities: {
    outdoorSeating: true,
    petFriendlyPatio: true,
    freeWifi: true,
    veganOptions: true,
    indoorSeating: true,
  },
  /** TODO(owner): add verified parking details, e.g. "Street parking on Northern Blvd". */
  parking: null as string | null,

  features: [
    'Specialty coffee',
    'Stumptown coffee',
    'Espresso drinks',
    'Iced matcha',
    'Brunch classics',
    'Sandwiches',
    'Fresh baked goods',
    'Unique desserts',
    'Outdoor seating',
    'Vegan options',
    'Free Wi-Fi',
    'Pet-friendly patio',
  ],

  servesCuisine: ['Coffee', 'Brunch', 'Sandwiches', 'Bakery', 'Desserts'],

  /**
   * When true, a small note discloses that photography is illustrative
   * stock imagery. Turn off once official café photos are in place.
   */
  showStockPhotoNotice: true,

  nav: [
    { label: 'Menu', href: '#menu' },
    { label: 'Coffee', href: '#coffee' },
    { label: 'Brunch', href: '#brunch' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Visit', href: '#visit' },
  ],
} as const

/** Resolved full-menu link: verified menu URL, else the official site. */
export const fullMenuHref = siteConfig.fullMenuUrl ?? siteConfig.website

export type SiteConfig = typeof siteConfig
