/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
 * Lenis share one animation frame. Disabled for reduced-motion users
 * (native scrolling is used instead). Lenis never intercepts keyboard
 * scrolling, so arrow keys / Page Down / Space keep working natively.
 */
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

let lenis: Lenis | null = null

export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: false })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

const NAV_OFFSET = 72

/** Scroll to an in-page anchor ("#menu"), with Lenis when active. */
export function scrollToHash(hash: string) {
  const target = hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash)
  if (!target) return
  if (lenis) {
    // Lenis already honours the CSS scroll-padding-top (nav height).
    lenis.scrollTo(hash === '#top' ? 0 : target)
  } else {
    const top = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET + 1
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
  // Move keyboard focus to the section for screen-reader & keyboard users.
  if (hash !== '#top') {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  history.pushState(null, '', hash === '#top' ? location.pathname : hash)
}

/** Pause/resume page scrolling (mobile menu, lightbox). */
export function lockScroll(locked: boolean) {
  if (locked) {
    lenis?.stop()
    document.documentElement.classList.add('scroll-locked')
  } else {
    lenis?.start()
    document.documentElement.classList.remove('scroll-locked')
  }
}
