import { useEffect } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { BrandStory } from './components/BrandStory'
import { Marquee } from './components/Marquee'
import { MenuPreview } from './components/MenuPreview'
import { CoffeeExperience } from './components/CoffeeExperience'
import { BrunchSection } from './components/BrunchSection'
import { Gallery } from './components/Gallery'
import { Reviews } from './components/Reviews'
import { Location } from './components/Location'
import { Footer } from './components/Footer'
import { initSmoothScroll, scrollToHash } from './lib/smoothScroll'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  useEffect(() => {
    const destroy = initSmoothScroll()

    // Late-loading images/fonts change layout; keep trigger positions accurate.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    // Honour a deep link like /#visit on first load.
    if (location.hash.length > 1) {
      const hash = location.hash
      setTimeout(() => document.querySelector(hash) && scrollToHash(hash), 300)
    }

    return () => {
      window.removeEventListener('load', refresh)
      destroy()
    }
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] -translate-y-24 bg-espresso px-5 py-3 text-xs font-semibold tracking-[0.2em] text-cream uppercase transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <BrandStory />
        <Marquee />
        <MenuPreview />
        <CoffeeExperience />
        <BrunchSection />
        <Gallery />
        <Reviews />
        <Location />
      </main>
      <Footer />
    </LazyMotion>
  )
}
