/*
 * GSAP, ScrollTrigger and Lenis are loaded on demand (never in the first
 * bundle) and shared by every motion component.
 */
import type { gsap as GSAP } from "gsap"
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger"
import type Lenis from "lenis"

export type Motion = { gsap: typeof GSAP; ScrollTrigger: typeof ST }

let motion: Promise<Motion> | null = null
let interacted: Promise<void> | null = null

/*
 * Resolves on the visitor's first scroll, wheel, touch, key or pointer move.
 * Nothing animates before someone scrolls, so the animation libraries wait
 * for this and stay off the main thread while the page loads.
 */
export function firstInteraction(): Promise<void> {
  if (!interacted)
    interacted = new Promise((resolve) => {
      const events = [
        "scroll",
        "wheel",
        "touchstart",
        "pointermove",
        "pointerdown",
        "keydown"
      ] as const
      const done = () => {
        events.forEach((name) => window.removeEventListener(name, done))
        resolve()
      }
      events.forEach((name) =>
        window.addEventListener(name, done, { passive: true, once: true })
      )
    })
  return interacted
}
let lenis: Lenis | null = null

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/* Close to the site easing, cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE = "expo.out"

export function loadMotion(): Promise<Motion> {
  if (!motion)
    motion = firstInteraction()
      .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]))
      .then(([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)
        gsap.defaults({ ease: EASE, duration: 0.8 })
        return { gsap, ScrollTrigger }
      })
  return motion
}

/*
 * Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger pins
 * stay in sync. Skipped entirely under reduced motion.
 */
export async function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  const [{ gsap, ScrollTrigger }, { default: LenisCtor }] = await Promise.all([
    loadMotion(),
    import("lenis")
  ])
  if (lenis) return lenis
  lenis = new LenisCtor({ anchors: { offset: -100 }, lerp: 0.12 })
  lenis.on("scroll", ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis
