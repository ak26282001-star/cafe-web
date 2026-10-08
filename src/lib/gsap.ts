/**
 * Single place GSAP plugins are registered. Every component imports
 * gsap/ScrollTrigger from here so registration happens exactly once.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'expo.out', duration: 1.2 })

/** Shared easing vocabulary — keeps motion consistent across sections. */
export const ease = {
  reveal: 'expo.out',
  mask: 'power4.out',
  soft: 'power2.out',
  inOut: 'power3.inOut',
} as const

/** True when the visitor asked the OS for reduced motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, useGSAP }
