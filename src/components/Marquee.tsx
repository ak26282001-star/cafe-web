import { siteConfig } from '../data/siteConfig'

/** Slow editorial ticker of the café's supplied features. Decorative duplicate is hidden from AT. */
export function Marquee() {
  const items = siteConfig.features
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((f) => (
        <li key={f} className="flex items-center">
          <span className="px-6 font-serif text-[clamp(1.6rem,3.4vw,2.8rem)] italic md:px-10">{f}</span>
          <svg viewBox="0 0 20 20" className="size-3.5 text-caramel" aria-hidden="true">
            <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="marquee overflow-hidden border-y border-espresso/10 bg-cream py-6 md:py-8">
      <h2 className="sr-only">What you'll find here</h2>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
