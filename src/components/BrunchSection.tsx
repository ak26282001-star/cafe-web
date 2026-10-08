import { images, type SiteImage } from '../data/gallery'
import { AnimatedButton } from './AnimatedButton'
import { Img } from './Img'
import { Parallax } from './Parallax'
import { Reveal, RevealImage, RevealLines } from './Reveal'

const featured = ['Green Eggs Benedict', 'Grilled sourdough sandwiches', 'Ebelskivers', 'Brunch bowls', 'Fresh desserts']

function Figure({
  image,
  no,
  caption,
  className = '',
  frameClassName = '',
  sizes,
  from,
  captionRight = false,
}: {
  captionRight?: boolean
  image: SiteImage
  no: string
  caption: string
  className?: string
  frameClassName?: string
  sizes: string
  from?: 'bottom' | 'left' | 'right' | 'top'
}) {
  return (
    <figure className={`group ${className}`}>
      <RevealImage from={from} className={`bg-beige ${frameClassName}`}>
        <Img image={image} sizes={sizes} className="transition-transform duration-[1400ms] ease-(--ease-expo) group-hover:scale-[1.045]" />
      </RevealImage>
      <figcaption className={`mt-3 flex items-baseline gap-3 text-[0.8rem] text-ink-soft ${captionRight ? 'justify-end' : ''}`}>
        <span className="eyebrow text-caramel">Fig. {no}</span>
        <span className="font-serif text-base italic text-espresso">{caption}</span>
      </figcaption>
    </figure>
  )
}

export function BrunchSection() {
  return (
    <section id="brunch" aria-labelledby="brunch-heading" className="section-y relative overflow-hidden bg-beige/45">
      {/* Oversized background word */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-6 font-serif text-[clamp(8rem,24vw,22rem)] leading-none text-espresso/[0.04] italic select-none"
      >
        Brunch
      </p>

      <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Copy column */}
        <div className="lg:col-span-5 lg:pt-16">
          <Reveal>
            <p className="eyebrow mb-6 text-olive">Brunch &amp; bites</p>
          </Reveal>
          <RevealLines
            id="brunch-heading"
            className="display text-[clamp(2.9rem,6.6vw,6rem)] uppercase"
            lines={['Brunch is', <em key="b" className="text-caramel">better here.</em>]}
          />
          <Reveal>
            <p className="mt-8 max-w-md text-[1.05rem] leading-[1.8] text-ink-soft">
              Comforting favorites, satisfying bites, and sweet treats made for a well-deserved break.
            </p>
          </Reveal>
          <Reveal as="ol" stagger={0.07} className="mt-12 border-t border-espresso/15">
            {featured.map((f, i) => (
              <li key={f} className="flex items-baseline gap-5 border-b border-espresso/15 py-4">
                <span className="eyebrow w-6 text-caramel" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-[1.6rem] leading-tight">{f}</span>
              </li>
            ))}
          </Reveal>
          <Reveal className="mt-12">
            <AnimatedButton href="#menu" variant="outline">
              Explore the menu
            </AnimatedButton>
          </Reveal>
        </div>

        {/* Magazine composition */}
        <div className="relative lg:col-span-7">
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <Figure
              image={images.benedict}
              no="01"
              caption="Green Eggs Benedict"
              captionRight
              className="col-span-10 col-start-3 md:col-span-8 md:col-start-5"
              frameClassName="aspect-[4/5]"
              sizes="(min-width: 1024px) 38vw, 80vw"
            />
            <Parallax distance={-120} className="relative z-10 col-span-7 col-start-1 -mt-40 md:col-span-6 md:-mt-64">
              <Figure
                image={images.soup}
                no="02"
                caption="Soup & grilled sourdough"
                frameClassName="aspect-[5/4] border-[10px] border-cream"
                sizes="(min-width: 1024px) 28vw, 58vw"
                from="left"
              />
            </Parallax>
            <Parallax distance={60} className="col-span-5 col-start-8 mt-6 md:col-span-4 md:col-start-8 md:mt-10">
              <Figure
                image={images.pancakes}
                no="03"
                caption="Ebelskivers"
                frameClassName="aspect-square"
                sizes="(min-width: 1024px) 18vw, 40vw"
                from="right"
              />
            </Parallax>
          </div>
        </div>
      </div>

      {/* Second spread */}
      <div className="container-x relative mt-20 grid grid-cols-12 gap-4 md:mt-28 md:gap-6">
        <Figure
          image={images.brunchBowl}
          no="04"
          caption="Brunch bowls"
          className="col-span-12 md:col-span-7"
          frameClassName="aspect-[16/10]"
          sizes="(min-width: 768px) 55vw, 100vw"
        />
        <Parallax distance={-90} className="col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-24">
          <Figure
            image={images.dessert}
            no="05"
            caption="Fresh desserts"
            frameClassName="aspect-[4/5]"
            sizes="(min-width: 768px) 30vw, 66vw"
          />
        </Parallax>
      </div>
    </section>
  )
}
