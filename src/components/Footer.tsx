import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { fullMenuHref, siteConfig } from '../data/siteConfig'
import { gsap, useGSAP, ease, prefersReducedMotion } from '../lib/gsap'
import { groupHours } from '../lib/hours'
import { handleAnchorClick } from './AnimatedButton'

const linkCls = 'link-underline pb-0.5 text-cream/80 transition-colors hover:text-cream'

export function Footer() {
  const ref = useRef<HTMLElement>(null)

  // Final reveal: the footer content rises from beneath the page as it
  // arrives, then the oversized wordmark letters settle into place.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(ref)
      gsap.from(q('[data-footer-inner]'), {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top 30%', scrub: true },
      })
      gsap.from(q('[data-footer-letter]'), {
        yPercent: 105,
        duration: 1.4,
        ease: ease.mask,
        stagger: 0.035,
        scrollTrigger: { trigger: q('[data-footer-word]')[0], start: 'top 98%', once: true },
      })
    },
    { scope: ref },
  )

  const word = 'One of a Kind'
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} className="relative overflow-hidden bg-espresso-deep text-cream" aria-labelledby="footer-heading">
      <div data-footer-inner className="container-x pt-24 md:pt-32">
        <div className="grid gap-14 border-b border-cream/10 pb-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 id="footer-heading" className="font-serif text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[1.02]">
              Good coffee. Good food. <em className="text-caramel">One of a kind.</em>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
              A neighborhood café in {siteConfig.address.neighborhood} for specialty coffee, brunch classics, sandwiches,
              fresh baked goods, and unique desserts.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
            <h3 className="eyebrow mb-5 text-cream/45">Explore</h3>
            <ul className="space-y-3 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={(e) => handleAnchorClick(e, item.href)} className={linkCls}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={fullMenuHref} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  Full menu<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              {siteConfig.instagramUrl && (
                <li>
                  <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    Instagram<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h3 className="eyebrow mb-5 text-cream/45">Visit</h3>
            <address className="space-y-3 text-sm not-italic">
              <a href={siteConfig.maps.searchUrl} target="_blank" rel="noopener noreferrer" className={`${linkCls} block leading-relaxed`}>
                {siteConfig.address.street}
                <br />
                {siteConfig.address.locality}, {siteConfig.address.region} {siteConfig.address.postalCode}
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
              <a href={siteConfig.phone.href} className={`${linkCls} inline-block`}>
                {siteConfig.phone.display}
              </a>
              <br />
              <a href={siteConfig.maps.directionsUrl} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-block text-caramel`}>
                Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </address>
          </div>

          <div className="md:col-span-2">
            <h3 className="eyebrow mb-5 text-cream/45">Hours</h3>
            <ul className="space-y-3 text-sm text-cream/80">
              {groupHours().map((g) => (
                <li key={g.days}>
                  {g.days}
                  <br />
                  <span className="text-cream/60">{g.range}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-cream/45">Subject to change — please confirm before visiting.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="#top"
            onClick={(e) => handleAnchorClick(e, '#top')}
            className="group inline-flex items-center gap-3 self-start tracking-[0.2em] uppercase transition-colors hover:text-cream sm:self-auto"
          >
            Back to top
            <span className="grid size-9 place-items-center border border-cream/20 transition-colors group-hover:border-cream">
              <ArrowUp aria-hidden="true" className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.6} />
            </span>
          </a>
        </div>
      </div>

      {/* Oversized closing wordmark */}
      <p
        data-footer-word
        aria-hidden="true"
        className="container-x flex justify-between overflow-hidden pb-4 font-serif text-[clamp(3.4rem,13.2vw,15rem)] leading-[0.95] whitespace-nowrap text-cream/[0.92] italic select-none"
      >
        {word.split(' ').map((w, wi) => (
          <span key={wi} className={`inline-flex ${wi === 0 ? 'text-caramel' : ''}`}>
            {w.split('').map((ch, i) => (
              <span key={i} data-footer-letter className="inline-block">
                {ch}
              </span>
            ))}
          </span>
        ))}
      </p>
    </footer>
  )
}
