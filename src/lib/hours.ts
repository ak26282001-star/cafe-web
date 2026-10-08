import { siteConfig, type DayKey } from '../data/siteConfig'

type Hours = (typeof siteConfig.hours)[number]

const DAY_ORDER: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

/** "18:30" → "6:30 PM" (or "6:30" with compact=true, "10 AM" style when on the hour). */
export function formatTime(hhmm: string, compact = false): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const mins = m ? `:${String(m).padStart(2, '0')}` : compact ? '' : ':00'
  return `${hour12}${mins} ${suffix}`
}

export function formatRange(h: Pick<Hours, 'open' | 'close'>, compact = false): string {
  if (!h.open || !h.close) return 'Closed'
  return `${formatTime(h.open, compact)} – ${formatTime(h.close, compact)}`
}

export interface HoursGroup {
  days: string
  range: string
}

/** Collapses consecutive days with identical hours: "Monday – Sunday · 10:00 AM – 6:30 PM". */
export function groupHours(): HoursGroup[] {
  const groups: { first: Hours; last: Hours; range: string }[] = []
  for (const day of siteConfig.hours) {
    const range = formatRange(day)
    const prev = groups[groups.length - 1]
    if (prev && prev.range === range) prev.last = day
    else groups.push({ first: day, last: day, range })
  }
  return groups.map((g) => ({
    days: g.first === g.last ? g.first.label : `${g.first.label} – ${g.last.label}`,
    range: g.range,
  }))
}

/** One-line summary, e.g. "Open daily · 10 AM – 6:30 PM". */
export function hoursSummary(): string {
  const groups = groupHours()
  if (groups.length === 1 && siteConfig.hours.length === 7) {
    return `Open daily · ${formatRange(siteConfig.hours[0], true)}`
  }
  return groups.map((g) => `${g.days} ${g.range}`).join(' · ')
}

export interface OpenStatus {
  isOpen: boolean
  todayKey: DayKey
  label: string
}

/** Open / closed right now, computed in the café's own time zone. */
export function getOpenStatus(now = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: siteConfig.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const weekday = get('weekday').toLowerCase().slice(0, 3) as DayKey
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const today = siteConfig.hours.find((d) => d.day === weekday)
  if (today?.open && today.close) {
    const open = toMin(today.open)
    const close = toMin(today.close)
    if (minutes >= open && minutes < close) {
      return { isOpen: true, todayKey: weekday, label: `Open now · until ${formatTime(today.close, true)}` }
    }
    if (minutes < open) {
      return { isOpen: false, todayKey: weekday, label: `Closed now · opens ${formatTime(today.open, true)}` }
    }
  }
  // Find the next opening day.
  const idx = DAY_ORDER.indexOf(weekday)
  for (let i = 1; i <= 7; i++) {
    const key = DAY_ORDER[(idx + i) % 7]
    const next = siteConfig.hours.find((d) => d.day === key)
    if (next?.open) {
      const when = i === 1 ? 'tomorrow' : next.label
      return { isOpen: false, todayKey: weekday, label: `Closed now · opens ${when} ${formatTime(next.open, true)}` }
    }
  }
  return { isOpen: false, todayKey: weekday, label: 'Closed' }
}
