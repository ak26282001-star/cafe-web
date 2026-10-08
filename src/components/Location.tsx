import { useEffect, useState } from 'react'
import { Clock, MapPin, Phone, Dog, Sun, Wifi, Leaf, Armchair } from 'lucide-react'
import { siteConfig } from '../data/siteConfig'
import { formatRange, getOpenStatus, type OpenStatus } from '../lib/hours'
import { AnimatedButton } from './AnimatedButton'
import { Reveal, RevealImage, RevealLines } from './Reveal'

const amenityList = [
  { key: 'outdoorSeating', label: 'Outdoor seating', Icon: Sun },
  { key: 'petFriendlyPatio', label: 'Pet-friendly patio', Icon: Dog },
  { key: 'indoorSeating', label: 'Indoor seating', Icon: Armchair },
  { key: 'freeWifi', label: 'Free Wi-Fi', Icon: Wifi },
  { key: 'veganOptions', label: 'Vegan options', Icon: Leaf },
] as const

function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null)
  useEffect(() => {
    const update = () => setStatus(getOpenStatus())
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}

export function Location() {
  const status = useOpenStatus()
  const { address, phone, maps } = siteConfig

  return (
    <section id="visit" aria-labelledby="visit-heading" className="section-y relative bg-espresso text-cream">
      <div className="container-x">
        <header className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <p className="eyebrow mb-6 text-caramel">Visit us</p>
            </Reveal>
            <RevealLines
              id="visit-heading"
              className="display text-[clamp(2.8rem,7vw,6.4rem)] uppercase"
              lines={['Your next', <em key="b" className="text-beige">coffee stop.</em>]}
            />
          </div>
          {status && (
            <Reveal className="md:col-span-4 md:justify-self-end md:pb-4">
              <p className="inline-flex items-center gap-3 border border-cream/20 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.16em] uppercase">
                <span
                  aria-hidden="true"
                  className={`pulse-dot relative inline-block size-2 rounded-full ${status.isOpen ? 'text-[#a9b47a]' : 'text-caramel'} bg-current`}
                />
                {status.label}
              </p>
            </Reveal>
          )}
        </header>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Details */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <Reveal className="border-t border-cream/15 pt-6">
              <h3 className="eyebrow mb-4 flex items-center gap-2.5 text-cream/60">
                <MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.6} /> Address
              </h3>
              <p className="font-serif text-2xl leading-snug">{siteConfig.name}</p>
              <a href={maps.searchUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-1 inline-block text-[1.02rem] leading-relaxed text-cream/85">
                <address className="not-italic">
                  {address.street}
                  <br />
                  {address.locality}, {address.region} {address.postalCode}
                </address>
                <span className="sr-only"> (opens Google Maps in a new tab)</span>
              </a>
            </Reveal>

            <Reveal className="border-t border-cream/15 pt-6">
              <h3 className="eyebrow mb-4 flex items-center gap-2.5 text-cream/60">
                <Phone aria-hidden="true" className="size-3.5" strokeWidth={1.6} /> Phone
              </h3>
              <a href={phone.href} className="link-underline font-serif text-3xl">
                {phone.display}
              </a>
              <p className="mt-2 text-sm text-cream/60">Call for today’s hours, menu availability, and questions.</p>
            </Reveal>

            <Reveal className="border-t border-cream/15 pt-6 sm:col-span-2 lg:col-span-1">
              <h3 className="eyebrow mb-4 flex items-center gap-2.5 text-cream/60">
                <Clock aria-hidden="true" className="size-3.5" strokeWidth={1.6} /> Hours
              </h3>
              <table className="w-full text-[0.95rem]">
                <caption className="sr-only">Opening hours</caption>
                <tbody>
                  {siteConfig.hours.map((d) => {
                    const today = status?.todayKey === d.day
                    return (
                      <tr key={d.day} className={`border-b border-cream/10 last:border-0 ${today ? 'text-cream' : 'text-cream/70'}`}>
                        <th scope="row" className="py-2 text-left font-normal">
                          {d.label}
                          {today && <span className="eyebrow ml-3 text-caramel">Today</span>}
                        </th>
                        <td className="py-2 text-right tabular-nums">{formatRange(d)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="mt-4 text-xs leading-relaxed text-cream/55">
                <span aria-hidden="true">* </span>
                {siteConfig.hoursNotice}
              </p>
            </Reveal>

            <Reveal as="ul" stagger={0.05} className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1">
              {amenityList
                .filter((a) => siteConfig.amenities[a.key])
                .map(({ key, label, Icon }) => (
                  <li key={key} className="inline-flex items-center gap-2 border border-cream/15 px-3.5 py-2 text-[0.78rem] text-cream/80">
                    <Icon aria-hidden="true" className="size-3.5 text-caramel" strokeWidth={1.6} />
                    {label}
                  </li>
                ))}
              {siteConfig.parking && (
                <li className="inline-flex items-center gap-2 border border-cream/15 px-3.5 py-2 text-[0.78rem] text-cream/80">
                  {siteConfig.parking}
                </li>
              )}
            </Reveal>
          </div>

          {/* Map */}
          <div className="lg:col-span-7">
            <RevealImage from="right" className="aspect-[4/5] w-full bg-espresso-deep sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
              <p className="absolute inset-0 grid place-items-center text-sm text-cream/40">Loading map…</p>
              <iframe
                title={`Map showing ${siteConfig.name} at ${siteConfig.fullAddress}`}
                src={maps.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.35)_saturate(0.7)_contrast(1.02)_brightness(0.95)]"
              />
            </RevealImage>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AnimatedButton href={maps.directionsUrl} variant="light" className="sm:flex-1">
                Get directions
              </AnimatedButton>
              <AnimatedButton href={phone.href} variant="ghost-light" className="sm:flex-1" ariaLabel={`Call ${phone.display}`}>
                Call the café
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
