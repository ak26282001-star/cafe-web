import { memo, useCallback, useMemo, useState } from 'react'
import { alsoFeatured, menuCategories, menuDisclaimer, type MenuItem } from '../data/menu'
import { fullMenuHref } from '../data/siteConfig'
import { AnimatedButton } from './AnimatedButton'
import { Img } from './Img'
import { Reveal, RevealImage, RevealLines } from './Reveal'

interface Entry {
  item: MenuItem
  category: string
}

const entries: Entry[] = menuCategories.flatMap((c) => c.items.map((item) => ({ item, category: c.label })))

/** Index of each category's first item within `entries`. */
const categoryOffsets = menuCategories.map((_, ci) =>
  menuCategories.slice(0, ci).reduce((n, c) => n + c.items.length, 0),
)

interface RowProps {
  item: MenuItem
  index: number
  active: boolean
  onActivate: (index: number) => void
}

const MenuRow = memo(function MenuRow({ item, index, active, onActivate }: RowProps) {
  return (
    <li
      onPointerEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      className="group relative border-b border-espresso/10 py-6 md:py-7"
    >
      <div className="flex items-start gap-4">
        {/* Mobile thumbnail — the desktop preview panel takes over from lg */}
        {item.image && (
          <div className="relative size-16 shrink-0 overflow-hidden bg-beige lg:hidden">
            <Img image={item.image} sizes="64px" maxWidth={480} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-4">
            <h4 className="relative font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.05] transition-transform duration-700 ease-(--ease-expo) lg:group-hover:translate-x-2">
              {item.name}
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-px w-0 bg-caramel transition-[width] duration-700 ease-(--ease-expo) ${
                  active ? 'lg:w-full' : ''
                }`}
              />
            </h4>
            <span aria-hidden="true" className="mb-1.5 hidden flex-1 border-b border-dotted border-espresso/25 sm:block" />
            {item.price && (
              <p className="ml-auto shrink-0 font-sans text-[0.95rem] font-semibold tabular-nums tracking-wide text-espresso">
                <span className="sr-only">Price: </span>
                {item.price}
              </p>
            )}
          </div>
          {item.description && (
            <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-ink-soft transition-transform duration-700 ease-(--ease-expo) lg:group-hover:translate-x-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </li>
  )
})

export function MenuPreview() {
  const [active, setActive] = useState(0)
  const onActivate = useCallback((i: number) => setActive(i), [])

  // Unique preview images, so the stacked panel never duplicates a download.
  const previewImages = useMemo(() => {
    const seen = new Map<string, number>()
    entries.forEach((e) => e.item.image && !seen.has(e.item.image.src) && seen.set(e.item.image.src, seen.size))
    return { seen, list: [...seen.keys()].map((src) => entries.find((e) => e.item.image?.src === src)!.item.image!) }
  }, [])
  const activeEntry = entries[active]
  const activeImageIndex = activeEntry.item.image ? previewImages.seen.get(activeEntry.item.image.src) : undefined

  return (
    <section id="menu" aria-labelledby="menu-heading" className="section-y relative bg-white/60">
      <div className="container-x">
        <header className="grid gap-8 border-b border-espresso/15 pb-12 md:grid-cols-12 md:items-end md:pb-16">
          <div className="md:col-span-8">
            <Reveal>
              <p className="eyebrow mb-6 text-caramel">The menu</p>
            </Reveal>
            <RevealLines
              id="menu-heading"
              className="display text-[clamp(2.8rem,7vw,6.4rem)] uppercase"
              lines={['Made for your', <em key="b">kind of day</em>]}
            />
          </div>
          <Reveal className="md:col-span-4 md:pb-3">
            <p className="max-w-xs text-[1.02rem] leading-relaxed text-ink-soft">
              Specialty coffee, comforting brunch favorites, and something sweet.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-16 pt-14 lg:grid-cols-12 lg:gap-12 lg:pt-20">
          {/* Sticky interactive preview */}
          <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
            <div className="sticky top-28">
              <RevealImage className="aspect-[4/5] w-full bg-beige">
                {previewImages.list.map((img, i) => (
                  <div
                    key={img.src}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-(--ease-expo) ${
                      i === activeImageIndex ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
                    }`}
                  >
                    <Img image={img} sizes="40vw" decorative />
                  </div>
                ))}
              </RevealImage>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <p className="eyebrow text-olive">{activeEntry.category}</p>
                <p key={active} className="font-serif text-xl italic">
                  {activeEntry.item.name}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:pl-8">
            {menuCategories.map((cat, ci) => {
              const start = categoryOffsets[ci]
              return (
                <Reveal key={cat.id} className="mb-16 last:mb-0">
                  <h3 className="flex items-center gap-5 border-b border-espresso pb-4">
                    <span className="font-serif text-lg text-caramel italic">{cat.kicker}</span>
                    <span className="eyebrow">{cat.label}</span>
                  </h3>
                  <ul>
                    {cat.items.map((item, i) => (
                      <MenuRow
                        key={item.name}
                        item={item}
                        index={start + i}
                        active={active === start + i}
                        onActivate={onActivate}
                      />
                    ))}
                  </ul>
                </Reveal>
              )
            })}

            <Reveal className="mt-16 bg-cream p-8 md:p-10">
              <h3 className="eyebrow mb-6 text-olive">Also on the menu</h3>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {alsoFeatured.map((item) => (
                  <li key={item.name} className="font-serif text-[clamp(1.4rem,2.2vw,1.8rem)] italic">
                    {item.name}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-soft">Ask in the café for today’s selection and pricing.</p>
            </Reveal>

            <Reveal className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-relaxed text-ink-soft">
                <span aria-hidden="true">* </span>
                {menuDisclaimer}
              </p>
              <AnimatedButton href={fullMenuHref}>View full menu</AnimatedButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
