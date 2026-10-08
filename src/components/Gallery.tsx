import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'
import { gallery } from '../data/gallery'
import { siteConfig } from '../data/siteConfig'
import { imageSrcSet, imageUrl } from '../lib/image'
import { lockScroll } from '../lib/smoothScroll'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Img } from './Img'
import { Reveal, RevealImage, RevealLines } from './Reveal'

const SHAPES = {
  tall: 'row-span-2',
  wide: 'col-span-2',
  square: '',
  large: 'col-span-2 row-span-2',
} as const

const pad = (n: number) => String(n).padStart(2, '0')

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const openedFrom = useRef(0)

  const openAt = (i: number) => {
    openedFrom.current = i
    setIndex(i)
  }

  // Return focus to the thumbnail that opened the lightbox.
  const close = useCallback(() => {
    setIndex(null)
    requestAnimationFrame(() => triggers.current[openedFrom.current]?.focus())
  }, [])

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="section-y relative">
      <div className="container-x">
        <header className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow mb-6 text-caramel">Atmosphere</p>
            </Reveal>
            <RevealLines
              id="gallery-heading"
              className="display text-[clamp(2.8rem,6.6vw,6rem)] uppercase"
              lines={['Stay a while.', <em key="b" className="text-olive">Pull up a chair.</em>]}
            />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9 md:pb-3">
            <p className="text-[1.02rem] leading-relaxed text-ink-soft">
              A cozy, modern room with wood accents, indoor seating, and an outdoor patio when the weather invites it.
            </p>
          </Reveal>
        </header>

        <ul className="grid auto-rows-[44vw] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[30vw] md:grid-cols-4 md:auto-rows-[16vw] md:gap-4 2xl:auto-rows-[14rem]">
          {gallery.map((item, i) => (
            <li key={item.image.src + i} className={SHAPES[item.shape]}>
              <RevealImage delay={(i % 4) * 0.08} className="h-full w-full bg-beige">
                <button
                  ref={(el) => {
                    triggers.current[i] = el
                  }}
                  type="button"
                  onClick={() => openAt(i)}
                  className="group absolute inset-0 block h-full w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-offset-[-4px]"
                  aria-label={`Open image: ${item.caption}`}
                >
                  <Img
                    image={item.image}
                    sizes={item.shape === 'large' || item.shape === 'wide' ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                    className="transition-transform duration-[1400ms] ease-(--ease-expo) group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-espresso/70 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between text-cream opacity-0 transition-all duration-700 ease-(--ease-expo) group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    <span className="font-serif text-xl italic">{item.caption}</span>
                    <Plus className="size-4" strokeWidth={1.5} />
                  </span>
                </button>
              </RevealImage>
            </li>
          ))}
        </ul>

        {siteConfig.showStockPhotoNotice && (
          <p className="mt-6 text-[0.7rem] tracking-wide text-ink-soft/80">
            Photography shown is illustrative stock imagery and will be replaced with photos of the café.
          </p>
        )}
      </div>

      <Lightbox index={index} setIndex={setIndex} onClose={close} />
    </section>
  )
}

interface LightboxProps {
  index: number | null
  setIndex: (fn: (i: number | null) => number | null) => void
  onClose: () => void
}

function Lightbox({ index, setIndex, onClose }: LightboxProps) {
  const reduced = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [direction, setDirection] = useState(1)
  const swipeX = useRef(0)
  const open = index !== null
  const total = gallery.length

  const go = useCallback(
    (delta: number) => {
      setDirection(delta)
      setIndex((i) => (i === null ? i : (i + delta + total) % total))
    },
    [setIndex, total],
  )

  useEffect(() => {
    if (!open) return
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab') {
        const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button') ?? [])
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open, onClose, go])

  const item = index !== null ? gallery[index] : null
  const slide = reduced ? 0 : 60

  return (
    <AnimatePresence>
      {item && (
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image ${pad(index! + 1)} of ${pad(total)}: ${item.caption}`}
          className="fixed inset-0 z-[60] flex flex-col bg-espresso-deep/96 text-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.01 : 0.5 }}
        >
          <div className="container-x flex h-20 shrink-0 items-center justify-between">
            <p className="eyebrow text-cream/70" aria-live="polite">
              {pad(index! + 1)} <span className="text-cream/35">/ {pad(total)}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="-mr-3 grid size-12 place-items-center transition-transform duration-500 hover:rotate-90"
              aria-label="Close gallery"
            >
              <X className="size-6" strokeWidth={1.4} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <m.figure
                key={index}
                className="flex h-full max-h-full w-full touch-pan-y flex-col items-center justify-center"
                initial={{ opacity: 0, x: direction * slide }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * slide }}
                transition={{ duration: reduced ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                onPointerDown={(e) => {
                  swipeX.current = e.clientX
                }}
                onPointerUp={(e) => {
                  const dx = e.clientX - swipeX.current
                  if (dx < -60) go(1)
                  else if (dx > 60) go(-1)
                }}
              >
                <img
                  src={imageUrl(item.image.src, 1920, 80)}
                  srcSet={imageSrcSet(item.image.src)}
                  sizes="90vw"
                  alt={item.image.alt}
                  draggable={false}
                  className="max-h-[calc(100%-3rem)] w-auto max-w-full object-contain select-none"
                  onError={(e) => ((e.currentTarget.style.visibility = 'hidden'))}
                />
                <figcaption className="mt-4 font-serif text-xl italic">{item.caption}</figcaption>
              </m.figure>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="group absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center border border-cream/25 transition-colors hover:bg-cream hover:text-espresso md:left-8 md:size-14"
            >
              <ArrowLeft className="size-5 transition-transform duration-500 group-hover:-translate-x-0.5" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="group absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center border border-cream/25 transition-colors hover:bg-cream hover:text-espresso md:right-8 md:size-14"
            >
              <ArrowRight className="size-5 transition-transform duration-500 group-hover:translate-x-0.5" strokeWidth={1.4} />
            </button>
          </div>
          <p className="container-x py-5 text-center text-[0.7rem] text-cream/45">
            Use ← → keys or swipe to browse · Esc to close
          </p>
        </m.div>
      )}
    </AnimatePresence>
  )
}
