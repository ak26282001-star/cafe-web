interface WordmarkProps {
  className?: string
  /** Compact = navigation size. */
  size?: 'nav' | 'footer'
}

/** Custom typographic wordmark: serif "Café", a ringed numeral, sans small caps. */
export function Wordmark({ className = '', size = 'nav' }: WordmarkProps) {
  const isNav = size === 'nav'
  return (
    <span className={`inline-flex items-center gap-[0.35em] leading-none ${className}`} aria-hidden="true">
      <span className={`font-serif italic ${isNav ? 'text-[1.6rem]' : 'text-[1em]'}`}>Café</span>
      <span
        className={`grid place-items-center rounded-full border border-current font-serif ${
          isNav ? 'size-[1.55rem] text-[0.95rem]' : 'size-[0.82em] text-[0.55em]'
        }`}
      >
        <span className="translate-y-[-0.04em]">1</span>
      </span>
      <span className={`font-sans font-semibold uppercase ${isNav ? 'text-[0.62rem] tracking-[0.28em]' : 'text-[0.2em] tracking-[0.3em]'}`}>
        of a kind
      </span>
    </span>
  )
}
