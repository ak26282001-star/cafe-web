import { useRef, type ElementType, type ReactNode, type CSSProperties } from 'react'
import { gsap, useGSAP, ease, prefersReducedMotion } from '../lib/gsap'

/*
 * Reveal primitives. Content is fully rendered in the DOM and visible
 * without JavaScript; GSAP only sets the *starting* state at runtime
 * (via gsap.from), so nothing essential depends on an animation
 * finishing. All tweens/ScrollTriggers are scoped to the component
 * through useGSAP and reverted automatically on unmount.
 */

interface RevealLinesProps {
  lines: ReactNode[]
  as?: ElementType
  className?: string
  lineClassName?: (index: number) => string
  /** Play on mount (hero) instead of on scroll. */
  immediate?: boolean
  delay?: number
  stagger?: number
  id?: string
}

/** Heading whose lines slide up from behind individual masks. */
export function RevealLines({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName,
  immediate = false,
  delay = 0,
  stagger = 0.11,
  id,
}: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const inner = gsap.utils.toArray<HTMLElement>('.line-inner', ref.current)
      gsap.from(inner, {
        yPercent: 108,
        rotate: 2.5,
        transformOrigin: '0% 100%',
        duration: 1.35,
        ease: ease.mask,
        stagger,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: 'top 86%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className={`line-inner ${lineClassName?.(i) ?? ''}`}>{line}</span>{' '}
        </span>
      ))}
    </Tag>
  )
}

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  /** Stagger direct children instead of the wrapper. */
  stagger?: number
  y?: number
  style?: CSSProperties
}

/** Gentle fade-and-rise as the element scrolls into view. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, stagger, y = 28, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      const targets = stagger ? Array.from(ref.current.children) : ref.current
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration: 1.1,
        ease: ease.reveal,
        delay,
        stagger,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

interface RevealImageProps {
  children: ReactNode
  className?: string
  /** Direction the mask opens from. */
  from?: 'bottom' | 'left' | 'right' | 'top'
  /** Restrained scroll parallax on the inner image (desktop only). */
  parallax?: number
  delay?: number
  immediate?: boolean
}

const CLIP_FROM: Record<NonNullable<RevealImageProps['from']>, string> = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

/**
 * Masked image reveal: the frame opens with clip-path while the image
 * inside settles from a slight zoom. Optional parallax drifts the
 * image within its frame as the page scrolls.
 */
export function RevealImage({ children, className = '', from = 'bottom', parallax = 0, delay = 0, immediate = false }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      let mm: gsap.MatchMedia | undefined
      const media = ref.current.querySelector<HTMLElement>('[data-reveal-media]')

      const tl = gsap.timeline({
        delay,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: 'top 85%', once: true },
      })
      tl.from(ref.current, { clipPath: CLIP_FROM[from], duration: 1.5, ease: ease.inOut })
      if (media) tl.from(media, { scale: 1.22, duration: 2, ease: ease.reveal }, 0)

      if (parallax && media) {
        mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
          gsap.fromTo(
            media.parentElement,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: 'none',
              scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      }
      return () => mm?.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`${/(^|\s)absolute/.test(className) ? '' : 'relative '}overflow-hidden ${className}`} style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
      {/* Oversized wrapper gives the parallax room to travel without exposing edges. */}
      <div className={`absolute ${parallax ? '-inset-y-[12%] inset-x-0' : 'inset-0'}`}>
        <div data-reveal-media className="absolute inset-0">
          {children}
        </div>
      </div>
    </div>
  )
}
