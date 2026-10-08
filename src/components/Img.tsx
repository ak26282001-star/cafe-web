import { useState, type ImgHTMLAttributes } from 'react'
import { imageSrcSet, imageUrl } from '../lib/image'
import type { SiteImage } from '../data/gallery'

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  image: SiteImage
  /** Responsive `sizes` hint, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes?: string
  /** Above-the-fold images: eager + high fetch priority. */
  priority?: boolean
  /** Upper bound for generated srcset widths. */
  maxWidth?: number
  /** Purely decorative duplicate (e.g. hover preview) — empty alt. */
  decorative?: boolean
}

/**
 * Responsive image with lazy loading and a branded fallback — if a
 * photo fails to load, a warm placeholder is shown instead of a
 * broken-image icon. Always fills its (positioned) parent.
 */
export function Img({ image, sizes = '100vw', priority = false, maxWidth, decorative = false, className = '', style, ...rest }: ImgProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : image.alt}
        className={`@container absolute inset-0 flex items-end overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,#e5d7c4_0%,#b77a48_55%,#302019_100%)] p-4 ${className}`}
      >
        <span className="eyebrow hidden text-cream/70 @[11rem]:block">Photo coming soon</span>
      </div>
    )
  }

  return (
    <img
      src={imageUrl(image.src, 1440)}
      srcSet={imageSrcSet(image.src, maxWidth)}
      sizes={sizes}
      alt={decorative ? '' : image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      style={{ objectPosition: image.position, ...style }}
      {...rest}
    />
  )
}
