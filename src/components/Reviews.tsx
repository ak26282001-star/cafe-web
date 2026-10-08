import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'
import { verifiedReviews, type VerifiedReview } from '../data/reviews'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { AnimatedButton } from './AnimatedButton'
import { Reveal, RevealLines } from './Reveal'

const { rating } = siteConfig

function Stars({ value, best }: { value: number; best: number }) {
  const pct = (value / best) * 100
  const row = (cls: string) => (
    <span className={`flex w-max flex-nowrap gap-1.5 ${cls}`}>
      {Array.from({ length: best }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-5 shrink-0 md:size-6">
          <path
            d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  )
  return (
    <span className="relative inline-block" aria-hidden="true">
      {row('text-espresso/15')}
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row('text-caramel')}
      </span>
    </span>
  )
}

function ReviewCarousel({ reviews }: { reviews: VerifiedReview[] }) {
  const [i, setI] = useState(0)
  const r = reviews[i]
  const go = (d: number) => setI((n) => (n + d + reviews.length) % reviews.length)
  return (
    <div role="region" aria-roledescription="carousel" aria-label="Guest reviews" className="mt-14">
      <figure aria-live="polite" className="min-h-48">
        <blockquote className="font-serif text-[clamp(1.6rem,2.8vw,2.4rem)] leading-snug italic">“{r.quote}”</blockquote>
        <figcaption className="eyebrow mt-6 text-olive">
          {r.author} · {r.source}
          {r.date ? ` · ${r.date}` : ''}
        </figcaption>
      </figure>
      {reviews.length > 1 && (
        <div className="mt-8 flex gap-3">
          <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid size-12 place-items-center border border-espresso/20 hover:bg-espresso hover:text-cream">
            <ArrowLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid size-12 place-items-center border border-espresso/20 hover:bg-espresso hover:text-cream">
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  )
}

export function Reviews() {
  const numRef = useRef<HTMLDivElement>(null)

  // Count the figures up once as they enter view. Final values are in the
  // markup, so the numbers are correct even if this never runs.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const els = gsap.utils.toArray<HTMLElement>('[data-count]', numRef.current)
      els.forEach((el) => {
        const end = Number(el.dataset.count)
        const decimals = Number(el.dataset.decimals ?? 0)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: numRef.current, start: 'top 85%', once: true },
          onStart: () => {
            el.textContent = (0).toFixed(decimals)
          },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals)
          },
        })
      })
    },
    { scope: numRef },
  )

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="section-y relative overflow-hidden border-t border-espresso/10">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow mb-6 text-caramel">Kind words</p>
          </Reveal>
          <RevealLines
            id="reviews-heading"
            className="display text-[clamp(2.8rem,6.4vw,5.8rem)] uppercase"
            lines={['Loved by our', <em key="b" className="text-caramel">neighborhood.</em>]}
          />
          {verifiedReviews.length > 0 ? (
            <ReviewCarousel reviews={verifiedReviews} />
          ) : (
            <Reveal>
              <p className="mt-10 max-w-md text-[1.05rem] leading-[1.8] text-ink-soft">
                Curious what guests think? Read the café’s reviews in their own words on {rating.source}.
              </p>
            </Reveal>
          )}
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <div ref={numRef} className="relative border border-espresso/15 bg-white/70 p-8 md:p-12">
            <span className="eyebrow absolute -top-2.5 left-8 bg-cream px-3 text-olive md:left-12">{rating.source} rating</span>
            <p className="sr-only">
              Rated {rating.value} out of {rating.best} from {rating.approximate ? 'approximately ' : ''}
              {rating.count} {rating.source} reviews.
            </p>
            <div aria-hidden="true" className="flex items-baseline gap-3">
              <span data-count={rating.value} data-decimals="1" className="display text-[clamp(6rem,14vw,10rem)] tabular-nums">
                {rating.value.toFixed(1)}
              </span>
              <span className="font-serif text-4xl text-espresso/40 italic">/ {rating.best}</span>
            </div>
            <div className="mt-4">
              <Stars value={rating.value} best={rating.best} />
            </div>
            <p aria-hidden="true" className="mt-6 border-t border-espresso/10 pt-6 text-sm text-ink-soft">
              {rating.approximate ? 'Approximately ' : ''}
              <span data-count={rating.count} className="font-semibold text-espresso tabular-nums">
                {rating.count}
              </span>{' '}
              {rating.source} reviews
            </p>
            <AnimatedButton href={siteConfig.maps.reviewsUrl} variant="solid" className="mt-8 w-full">
              Read reviews on Google
            </AnimatedButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
