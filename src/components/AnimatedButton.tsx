import type { MouseEvent, ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { scrollToHash } from '../lib/smoothScroll'

type Variant = 'solid' | 'outline' | 'light' | 'ghost-light'

interface AnimatedButtonProps {
  href: string
  children: string
  variant?: Variant
  className?: string
  /** Icon override; defaults to an arrow (↗ for external links). */
  icon?: ReactNode
  ariaLabel?: string
}

const VARIANTS: Record<Variant, string> = {
  solid: 'bg-espresso text-cream border-espresso hover:bg-caramel hover:border-caramel',
  outline: 'border-espresso/30 text-espresso hover:border-espresso hover:bg-espresso hover:text-cream',
  light: 'bg-cream text-espresso border-cream hover:bg-caramel hover:border-caramel hover:text-cream',
  'ghost-light': 'border-cream/45 text-cream hover:border-cream hover:bg-cream hover:text-espresso',
}

export const isExternal = (href: string) => /^https?:\/\//.test(href)

/** Smoothly handles in-page anchors; external links open in a new tab. */
export function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  scrollToHash(href)
}

/**
 * Pill-free, square-shouldered button with a rolling label and a
 * sliding arrow on hover / focus.
 */
export function AnimatedButton({ href, children, variant = 'solid', className = '', icon, ariaLabel }: AnimatedButtonProps) {
  const external = isExternal(href)
  const Icon = external ? ArrowUpRight : ArrowRight

  return (
    <a
      href={href}
      onClick={(e) => handleAnchorClick(e, href)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel ?? (external ? `${children} (opens in a new tab)` : undefined)}
      className={`group relative inline-flex min-h-12 items-center justify-center gap-4 overflow-hidden border px-7 py-3.5 text-[0.7rem] font-semibold tracking-[0.22em] uppercase transition-[background-color,border-color,color] duration-500 ease-(--ease-expo) active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-(--ease-expo) group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          {children}
        </span>
      </span>
      <span className="relative block size-4 overflow-hidden" aria-hidden="true">
        {icon ?? (
          <>
            <Icon className="absolute inset-0 size-4 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-full group-focus-visible:translate-x-full" strokeWidth={1.6} />
            <Icon className="absolute inset-0 size-4 -translate-x-full transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-0 group-focus-visible:translate-x-0" strokeWidth={1.6} />
          </>
        )}
      </span>
    </a>
  )
}

interface TextLinkProps {
  href: string
  children: string
  className?: string
}

/** Small uppercase link with animated underline and nudge arrow. */
export function TextLink({ href, children, className = '' }: TextLinkProps) {
  const external = isExternal(href)
  return (
    <a
      href={href}
      onClick={(e) => handleAnchorClick(e, href)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group inline-flex items-center gap-3 py-2 text-[0.7rem] font-semibold tracking-[0.22em] uppercase ${className}`}
    >
      <span className="link-underline pb-1">{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="size-3.5 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-1.5"
        strokeWidth={1.8}
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}
