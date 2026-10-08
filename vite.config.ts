import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { siteConfig } from './src/data/siteConfig'
import { images } from './src/data/gallery'
import { imageSrcSet, imageUrl } from './src/lib/image'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/**
 * Injects SEO metadata and LocalBusiness structured data into
 * index.html from siteConfig, so business details live in one place.
 */
function seo(): Plugin {
  const c = siteConfig
  const url = `${c.siteUrl}/`
  const ogImage = `${c.siteUrl}/og-image.jpg`

  const dayMap = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }
  const openingHours = c.hours
    .filter((d) => d.open && d.close)
    .map((d) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayMap[d.day]}`,
      opens: d.open,
      closes: d.close,
    }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${url}#cafe`,
    name: c.name,
    description: c.description,
    url,
    telephone: c.phone.e164,
    priceRange: c.priceRange,
    servesCuisine: c.servesCuisine,
    image: ogImage,
    hasMenu: c.fullMenuUrl ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address.street,
      addressLocality: c.address.locality,
      addressRegion: c.address.region,
      postalCode: c.address.postalCode,
      addressCountry: c.address.country,
    },
    ...(c.geo ? { geo: { '@type': 'GeoCoordinates', ...c.geo } } : {}),
    hasMap: c.maps.searchUrl,
    openingHoursSpecification: openingHours,
    amenityFeature: [
      c.amenities.outdoorSeating && 'Outdoor seating',
      c.amenities.freeWifi && 'Free Wi-Fi',
      c.amenities.petFriendlyPatio && 'Pet-friendly patio',
    ]
      .filter(Boolean)
      .map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: c.rating.value,
      bestRating: c.rating.best,
      reviewCount: c.rating.count,
    },
    ...(c.instagramUrl ? { sameAs: [c.instagramUrl] } : {}),
  }

  const tags = `
    <title>${esc(c.seoTitle)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(c.name)}" />
    <meta property="og:title" content="${esc(c.seoTitle)}" />
    <meta property="og:description" content="${esc(c.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(c.seoTitle)}" />
    <meta name="twitter:description" content="${esc(c.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="preconnect" href="https://images.unsplash.com" />
    <link rel="preload" as="image" href="${esc(imageUrl(images.hero.src, 1440))}" imagesrcset="${esc(imageSrcSet(images.hero.src) ?? '')}" imagesizes="100vw" fetchpriority="high" />
    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`

  return {
    name: 'cafe-seo',
    transformIndexHtml: (html) => html.replace(/<!-- %SEO%[\s\S]*?-->/, tags),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    // React + GSAP + Motion land at ~165 kB gzipped in one cacheable bundle.
    chunkSizeWarningLimit: 560,
  },
})
