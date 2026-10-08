// Regenerates public/og-image.jpg and public/apple-touch-icon.png.
// Usage: node scripts/generate-og.mjs   (requires `playwright`)
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('file://' + here('./og.html'), { waitUntil: 'networkidle' })
await page.screenshot({ path: here('../public/og-image.jpg'), type: 'jpeg', quality: 88 })
const icon = await browser.newPage({ viewport: { width: 180, height: 180 } })
await icon.goto('file://' + here('../public/favicon.svg'))
await icon.screenshot({ path: here('../public/apple-touch-icon.png') })
await browser.close()
