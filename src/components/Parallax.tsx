import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'

interface ParallaxProps {
  children: ReactNode
  /** Travel in px across the element's pass through the viewport. Negative = moves up faster. */
  distance?: number
  className?: string
}

/** Restrained scroll-linked drift. Desktop only; off for reduced motion. */
export function Parallax({ children, distance = 80, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        gsap.fromTo(
          ref.current,
          { y: distance / 2 },
          {
            y: -distance / 2,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
