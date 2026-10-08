import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Phone } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'
import { Wordmark } from './Wordmark'
import { handleAnchorClick } from './AnimatedButton'
import { lockScroll, scrollToHash } from '../lib/smoothScroll'
import { useReducedMotion } from '../hooks/useReducedMotion'

const SOLID_AFTER = 40
const HIDE_AFTER = 640

export function Navbar() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Scroll state: solid after leaving the very top; tuck away while
  // scrolling down, return on any upward scroll. rAF-throttled and only
  // sets state when a value actually changes.
  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setSolid(y > SOLID_AFTER)
      const goingDown = y > lastY + 4
      const goingUp = y < lastY - 4
      if (goingDown && y > HIDE_AFTER && !headerRef.current?.contains(document.activeElement)) setHidden(true)
      else if (goingUp || y <= HIDE_AFTER) setHidden(false)
      if (goingDown || goingUp) lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Mobile menu: lock scroll, close on Escape, trap focus inside the panel.
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const panel = panelRef.current
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    requestAnimationFrame(() => focusables()[0]?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      } else if (e.key === 'Tab') {
        const items = [toggleRef.current!, ...focusables()]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open])

  // Close the mobile menu if the viewport grows to desktop.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mql.matches && setOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const onDark = !solid && !open
  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (open) {
      setOpen(false)
      // Let the scroll lock release before scrolling.
      e.preventDefault()
      setTimeout(() => scrollToHash(href), 60)
      return
    }
    handleAnchorClick(e, href)
  }

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-700 ease-(--ease-expo) ${
        hidden && !open ? '-translate-y-full' : ''
      } ${
        onDark
          ? 'border-b border-transparent bg-transparent text-cream'
          : 'border-b border-espresso/10 bg-cream text-espresso'
      }`}
    >
      {/* Soft top scrim keeps the transparent nav legible on any photo. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-espresso-deep/55 to-transparent transition-opacity duration-700 ${
          onDark ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <nav aria-label="Primary" className="container-x flex h-[72px] items-center justify-between gap-6">
        <a
          href="#top"
          onClick={(e) => navigate(e, '#top')}
          className="relative z-10 -my-2 py-2"
          aria-label={`${siteConfig.name} — back to top`}
        >
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => navigate(e, item.href)}
                className="link-underline py-1 text-[0.7rem] font-semibold tracking-[0.22em] uppercase"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.phone.href}
            className={`hidden items-center gap-2.5 border px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-500 sm:inline-flex ${
              onDark
                ? 'border-cream/40 hover:border-cream hover:bg-cream hover:text-espresso'
                : 'border-espresso/25 hover:border-espresso hover:bg-espresso hover:text-cream'
            }`}
          >
            <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.6} />
            <span className="sr-only">Call </span>
            {siteConfig.phone.display}
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-10 -mr-3 grid size-12 place-items-center lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" className="relative block h-3 w-7">
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ease-(--ease-expo) ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-px bg-current transition-all duration-500 ease-(--ease-expo) ${
                  open ? 'top-1.5 w-full -rotate-45' : 'top-3 w-4/6'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 -z-10 flex h-dvh flex-col overflow-y-auto bg-cream px-[clamp(1.25rem,4.5vw,4rem)] pt-28 pb-10 text-espresso lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduced ? 0.01 : 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col">
              {siteConfig.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-espresso/10">
                  <m.a
                    href={item.href}
                    onClick={(e) => navigate(e, item.href)}
                    className="flex items-baseline justify-between py-4 font-serif text-[clamp(2.4rem,11vw,4rem)] leading-none"
                    initial={reduced ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {item.label}
                    <span className="eyebrow text-caramel" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </m.a>
                </li>
              ))}
            </ul>
            <m.div
              className="mt-auto grid gap-6 pt-12 text-sm"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <a href={siteConfig.phone.href} className="font-serif text-3xl">
                {siteConfig.phone.display}
              </a>
              <a href={siteConfig.maps.searchUrl} target="_blank" rel="noopener noreferrer" className="leading-relaxed text-ink-soft">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.locality}, {siteConfig.address.region} {siteConfig.address.postalCode}
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
