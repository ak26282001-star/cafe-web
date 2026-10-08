/**
 * Responsive image helpers. Unsplash URLs get on-the-fly resizing
 * (auto=format serves AVIF/WebP where supported). Any other URL —
 * e.g. official photos dropped into /public/images — is used as-is.
 */
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560] as const

const isUnsplash = (src: string) => src.includes('images.unsplash.com')

export function imageUrl(src: string, width = 1440, quality = 72): string {
  if (!isUnsplash(src)) return src
  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'crop')
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(quality))
  return url.toString()
}

export function imageSrcSet(src: string, maxWidth = 2560): string | undefined {
  if (!isUnsplash(src)) return undefined
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${imageUrl(src, w)} ${w}w`)
    .join(', ')
}
