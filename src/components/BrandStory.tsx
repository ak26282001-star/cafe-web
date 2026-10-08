import { useRef } from 'react'
import { images } from '../data/gallery'
import { siteConfig } from '../data/siteConfig'
import { gsap, useGSAP, ease, prefersReducedMotion } from '../lib/gsap'
import { TextLink } from './AnimatedButton'
import { Img } from './Img'
import { Reveal, RevealImage, RevealLines } from './Reveal'

const highlights = ['Stumptown coffee', 'Vegan options', 'Free Wi-Fi', 'Pet-friendly patio']

export function BrandStory() {
  const ruleRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion() || !ruleRef.current) return
    gsap.from(ruleRef.current, {
      scaleX: 0,
      transformOrigin: '0% 50%',
      duration: 1.6,
      ease: ease.inOut,
      scrollTrigger: { trigger: ruleRef.current, start: 'top 90%', once: true },
    })
  })

  return (
    <section id="story" aria-labelledby="story-heading" className="section-y relative overflow-hidden">
      <div className="container-x grid items-center gap-14 md:grid-cols-12 md:gap-8">
        {/* Imagery — main photo with an offset detail frame */}
        <div className="relative md:col-span-6 lg:col-span-6">
          <RevealImage parallax={6} className="aspect-[4/5] w-[86%] md:w-[88%]">
            <Img image={images.story} sizes="(min-width: 768px) 45vw, 86vw" />
          </RevealImage>
          <RevealImage
            from="left"
            delay={0.25}
            className="absolute right-0 -bottom-10 aspect-square w-[44%] border-[10px] border-cream md:-bottom-14"
          >
            <Img image={images.storyDetail} sizes="(min-width: 768px) 22vw, 44vw" />
          </RevealImage>
        </div>

        {/* Copy */}
        <div className="md:col-span-6 md:pl-8 lg:col-span-5 lg:col-start-8 lg:pl-0">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-3 text-olive">
              <span className="inline-block size-1.5 rounded-full bg-caramel" aria-hidden="true" />
              {siteConfig.address.neighborhood}
            </p>
          </Reveal>
          <RevealLines
            id="story-heading"
            className="display text-[clamp(2.8rem,6.2vw,5.6rem)] uppercase"
            lines={['A little place.', <em key="b" className="text-caramel">A lot to love.</em>]}
          />
          <div ref={ruleRef} aria-hidden="true" className="my-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-espresso/20" />
            <span className="font-serif text-xl text-caramel italic">1</span>
            <span className="h-px w-12 bg-espresso/20" />
          </div>
          <Reveal>
            <p className="max-w-[34rem] text-[1.05rem] leading-[1.8] text-ink-soft">
              From your first morning coffee to a relaxed brunch with friends, {siteConfig.name} is a neighborhood spot for
              good food, carefully crafted drinks, and moments worth savoring.
            </p>
          </Reveal>
          <Reveal stagger={0.06} as="ul" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-espresso/10 pt-8">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-sm text-espresso/80">
                <span className="h-px w-4 bg-caramel" aria-hidden="true" />
                {h}
              </li>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <TextLink href="#menu">Discover our menu</TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
