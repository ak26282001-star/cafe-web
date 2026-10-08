import { useRef } from 'react'
import { images } from '../data/gallery'
import { siteConfig } from '../data/siteConfig'
import { gsap, useGSAP, ease, prefersReducedMotion } from '../lib/gsap'
import { hoursSummary } from '../lib/hours'
import { handleAnchorClick, AnimatedButton } from './AnimatedButton'
import { Img } from './Img'
import { RevealLines } from './Reveal'

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(ref)

      // Intro: the photograph opens from a framed window, then settles.
      const tl = gsap.timeline({ defaults: { ease: ease.reveal } })
      tl.from(q('[data-hero-frame]'), { clipPath: 'inset(14% 10% 14% 10%)', duration: 1.9, ease: ease.inOut })
        .from(q('[data-hero-img]'), { scale: 1.35, duration: 2.6 }, 0)
        .from(q('[data-hero-fade]'), { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.09 }, 1.15)
        .from(q('[data-hero-rule]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.4, ease: ease.inOut }, 1.0)

      // Restrained scroll-out: image drifts slower than the page, copy lifts away.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(q('[data-hero-parallax]'), { yPercent: 18, ease: 'none', scrollTrigger: st })
        gsap.to(q('[data-hero-content]'), { yPercent: -14, autoAlpha: 0.15, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate flex h-svh min-h-[40rem] flex-col overflow-hidden bg-espresso-deep text-cream"
    >
      {/* Photograph */}
      <div data-hero-frame className="absolute inset-0 -z-10 overflow-hidden" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
        <div data-hero-parallax className="absolute -inset-y-[6%] inset-x-0">
          <div data-hero-img className="absolute inset-0">
            <Img image={images.hero} priority sizes="100vw" className="brightness-[0.82] saturate-[0.9] sepia-[0.12]" />
          </div>
        </div>
        {/* Cinematic grade */}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-espresso-deep via-espresso-deep/45 to-espresso-deep/10" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-espresso-deep/70 via-espresso-deep/10 to-transparent" />
        {/* Drifting window light */}
        <div
          aria-hidden="true"
          className="light-drift absolute -top-1/4 right-[-10%] h-[90%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(232,176,120,0.42),transparent)] mix-blend-screen blur-2xl"
        />
        {/* Steam */}
        <svg aria-hidden="true" viewBox="0 0 200 260" className="absolute right-[18%] bottom-[34%] hidden w-40 text-cream/40 blur-[6px] md:block">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              className="steam-wisp"
              style={{ animationDelay: `${i * 2}s` }}
              d={`M${70 + i * 28} 250 C ${40 + i * 30} 200, ${110 + i * 20} 160, ${75 + i * 25} 110 S ${60 + i * 30} 40, ${95 + i * 20} 0`}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div aria-hidden="true" className="grain absolute inset-0" />
      </div>

      <div data-hero-content className="container-x relative flex flex-1 flex-col justify-end pt-28 pb-24 md:pb-28">
        <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-cream/80 md:mb-8">
          <span className="h-px w-8 bg-caramel" aria-hidden="true" />
          Specialty coffee &amp; brunch · {siteConfig.address.neighborhood}
        </p>

        <RevealLines
          as="h1"
          id="hero-heading"
          immediate
          delay={0.55}
          stagger={0.13}
          className="display text-[clamp(3.1rem,10.5vw,10.5rem)] max-sm:text-[clamp(2.6rem,12.4vw,3.4rem)] uppercase"
          lines={['Good coffee.', 'Great company.', 'One of a kind.']}
          lineClassName={(i) => (i === 2 ? 'italic text-caramel [font-variation-settings:"wght"_420]' : '')}
        />

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
          <div>
            <div data-hero-rule aria-hidden="true" className="mb-6 h-px w-full max-w-md bg-cream/25" />
            <p data-hero-fade className="max-w-md text-[0.98rem] leading-relaxed text-cream/85 md:text-[1.05rem]">
              Your neighborhood café for specialty coffee, thoughtful brunch, and little moments worth slowing down for.
            </p>
          </div>
          <div data-hero-fade className="flex flex-col gap-3 xs:flex-row">
            <AnimatedButton href="#menu" variant="light">
              Explore our menu
            </AnimatedButton>
            <AnimatedButton href="#visit" variant="ghost-light">
              Find your table
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Bottom rail: hours + scroll cue */}
      <div data-hero-fade className="container-x absolute inset-x-0 bottom-0 flex items-end justify-between pb-6 text-cream/70">
        <a
          href="#visit"
          onClick={(e) => handleAnchorClick(e, '#visit')}
          className="eyebrow link-underline hidden pb-1 sm:inline"
        >
          {hoursSummary()}*
          <span className="sr-only"> — hours subject to change, see visit details</span>
        </a>
        <a
          href="#story"
          onClick={(e) => handleAnchorClick(e, '#story')}
          className="group ml-auto flex items-center gap-4 sm:ml-0"
          aria-label="Scroll to the next section"
        >
          <span className="eyebrow">Scroll</span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-cream/20">
            <span className="scroll-cue-line absolute inset-0 bg-cream" />
          </span>
        </a>
      </div>
    </section>
  )
}
