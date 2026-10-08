import { images, type SiteImage } from '../data/gallery'
import { Img } from './Img'
import { Reveal, RevealImage, RevealLines } from './Reveal'

const highlights: { no: string; title: string; text: string; image: SiteImage }[] = [
  { no: '01', title: 'Espresso', text: 'Carefully prepared espresso drinks.', image: images.espresso },
  { no: '02', title: 'Cold Brew', text: 'Refreshing coffee for a slower afternoon.', image: images.coldBrew },
  { no: '03', title: 'Matcha', text: 'A smooth, vibrant alternative to your usual cup.', image: images.matcha },
]

export function CoffeeExperience() {
  return (
    <section id="coffee" aria-labelledby="coffee-heading" className="relative overflow-hidden bg-espresso text-cream">
      {/* Cinematic band */}
      <div className="relative isolate flex min-h-[78svh] items-end md:min-h-[92svh]">
        <RevealImage parallax={10} className="absolute inset-0 -z-10">
          <Img image={images.coffeeHero} sizes="100vw" className="brightness-[0.7] sepia-[0.15]" />
        </RevealImage>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-espresso via-espresso/40 to-espresso/20" />
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

        <div className="container-x grid gap-10 pb-16 md:grid-cols-12 md:items-end md:pb-24">
          <div className="md:col-span-8">
            <Reveal>
              <p className="eyebrow mb-6 text-caramel">The coffee</p>
            </Reveal>
            <RevealLines
              id="coffee-heading"
              className="display text-[clamp(3rem,7.4vw,7.4rem)] uppercase"
              lines={['Your daily cup,', <em key="e" className="text-beige">elevated.</em>]}
            />
          </div>
          <Reveal className="md:col-span-4 md:pb-4">
            <p className="max-w-sm text-[1.02rem] leading-relaxed text-cream/80">
              From rich espresso to refreshing cold brew, find your favorite way to slow down and enjoy the moment.
            </p>
            <p className="eyebrow mt-8 flex items-center gap-3 text-cream/60">
              <span className="h-px w-8 bg-caramel" aria-hidden="true" />
              Featuring Stumptown coffee
            </p>
          </Reveal>
        </div>
      </div>

      {/* Three highlights */}
      <div className="container-x section-y pt-20! md:pt-28!">
        <ol className="grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
          {highlights.map((h, i) => (
            <li key={h.no} className={`group ${i === 1 ? 'md:mt-24' : ''}`}>
              <RevealImage delay={i * 0.12} className="aspect-[3/4] bg-espresso-deep">
                <Img
                  image={h.image}
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="transition-transform duration-[1400ms] ease-(--ease-expo) group-hover:scale-[1.05]"
                />
              </RevealImage>
              <Reveal delay={0.1 + i * 0.08} className="mt-7 flex items-start gap-6 border-t border-cream/15 pt-6">
                <span className="font-serif text-4xl leading-none text-caramel italic" aria-hidden="true">
                  {h.no}
                </span>
                <div>
                  <h3 className="eyebrow text-[0.75rem]">
                    <span className="sr-only">{h.no} — </span>
                    {h.title}
                  </h3>
                  <p className="mt-3 font-serif text-2xl leading-snug text-cream/85">{h.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
