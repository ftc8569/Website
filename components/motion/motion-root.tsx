"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

import {
  loadMotion,
  prefersReducedMotion,
  startSmoothScroll
} from "@/components/motion/load"

/*
 * Site-wide motion, opted into with data attributes so pages stay server
 * components:
 *   data-parallax    photo frame; its image drifts at ~0.85x scroll speed
 *   data-slide       element slides in from the left
 *   data-seq         children animate in order; [data-arrow] draws itself
 *   data-zoom        image zooms 1.0 → 1.06 over 8s while in view
 *   data-sharpen     image goes from soft blur to sharp on enter
 *   data-draw        SVG strokes draw themselves
 *   data-terms       KaTeX equation rows fade in one after another
 *   data-codelines   code lines highlight in order as you scroll
 * Headline line reveals and odometer numbers are React components
 * (motion/split-heading.tsx, motion/odometer.tsx) so they never rewrite
 * markup React owns. Plus spotlight/tilt on .spot tiles, magnetic .btn, and the local-nav
 * progress line. Nothing runs under prefers-reduced-motion.
 */

const inViewport = (el: Element) => {
  const box = el.getBoundingClientRect()
  return box.top < window.innerHeight && box.bottom > 0
}

export default function MotionRoot() {
  const pathname = usePathname()

  // Global, route-independent pointer effects (desktop only).
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null
      const tile = target?.closest<HTMLElement>(".spot")
      if (tile) {
        const box = tile.getBoundingClientRect()
        const x = (event.clientX - box.left) / box.width
        const y = (event.clientY - box.top) / box.height
        tile.style.setProperty("--mx", `${x * 100}%`)
        tile.style.setProperty("--my", `${y * 100}%`)
        if (box.width < 560) {
          tile.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`)
          tile.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`)
        }
      }
      const button = target?.closest<HTMLElement>(".btn")
      if (button) {
        const box = button.getBoundingClientRect()
        const dx = event.clientX - (box.left + box.width / 2)
        const dy = event.clientY - (box.top + box.height / 2)
        button.style.transform = `translate(${Math.max(-6, Math.min(6, dx * 0.2))}px, ${Math.max(-4, Math.min(4, dy * 0.3))}px)`
      }
    }
    const onOut = (event: PointerEvent) => {
      const target = event.target as Element | null
      const related = event.relatedTarget as Element | null
      const tile = target?.closest<HTMLElement>(".spot")
      if (tile && !tile.contains(related)) {
        tile.style.setProperty("--tilt-x", "0deg")
        tile.style.setProperty("--tilt-y", "0deg")
      }
      const button = target?.closest<HTMLElement>(".btn")
      if (button && !button.contains(related)) button.style.transform = ""
    }
    document.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerout", onOut, { passive: true })
    return () => {
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerout", onOut)
    }
  }, [])

  // Local-nav progress line. Cheap, no library.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".localnav")
    if (!nav) return
    const bar = document.createElement("span")
    bar.className = "localnav-progress"
    bar.setAttribute("aria-hidden", "true")
    nav.appendChild(bar)
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.setProperty(
        "--progress",
        String(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      cancelAnimationFrame(frame)
      bar.remove()
    }
  }, [pathname])

  // Tiles that get the hover spotlight.
  useEffect(() => {
    document
      .querySelectorAll(
        ".tile:not(.form-tile):not(.timeline-tile):not(.tile--split):not(.spec):not(.materials)"
      )
      .forEach((tile) => tile.classList.add("spot"))
  }, [pathname])

  // Scroll-driven effects, loaded lazily after the page is idle.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let disposed = false
    const cleanups: (() => void)[] = []
    let revert: (() => void) | undefined

    const run = async () => {
      await startSmoothScroll()
      const { gsap, ScrollTrigger } = await loadMotion()
      if (disposed) return
      await document.fonts?.ready
      if (disposed) return

      const ctx = gsap.context(() => {
        // Parallax photos.
        document
          .querySelectorAll<HTMLElement>("[data-parallax]")
          .forEach((frame) => {
            const img = frame.querySelector("img")
            if (!img) return
            gsap.fromTo(
              img,
              { yPercent: -6, scale: 1.12 },
              {
                yPercent: 6,
                scale: 1.05,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true
                }
              }
            )
          })

        // Slide in from the timeline line.
        document.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) => {
          if (inViewport(el)) return
          gsap.from(el, {
            x: -32,
            opacity: 0,
            duration: 0.7,
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          })
        })

        // Sequenced rows with self-drawing arrows.
        document.querySelectorAll<HTMLElement>("[data-seq]").forEach((row) => {
          const items = row.querySelectorAll("[data-seq-item]")
          const arrows = row.querySelectorAll("[data-arrow]")
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 85%", once: true }
          })
          items.forEach((item, index) => {
            if (index > 0 && arrows[index - 1])
              tl.from(
                arrows[index - 1],
                { scaleX: 0, transformOrigin: "left", duration: 0.4 },
                ">-0.2"
              )
            tl.from(item, { opacity: 0, y: 24, duration: 0.6 }, ">-0.1")
          })
        })

        // Slow zoom while in view.
        document
          .querySelectorAll<HTMLElement>("[data-zoom] img")
          .forEach((img) => {
            const tween = gsap.fromTo(
              img,
              { scale: 1 },
              { scale: 1.06, duration: 8, ease: "none", paused: true }
            )
            ScrollTrigger.create({
              trigger: img,
              onToggle: (self) => (self.isActive ? tween.play() : tween.pause())
            })
          })

        // Blur to sharp.
        document
          .querySelectorAll<HTMLElement>("[data-sharpen]")
          .forEach((el) => {
            if (inViewport(el)) return
            gsap.from(el, {
              filter: "blur(12px)",
              opacity: 0.4,
              duration: 0.9,
              clearProps: "filter",
              scrollTrigger: { trigger: el, start: "top 92%", once: true }
            })
          })

        // SVG strokes draw themselves.
        document.querySelectorAll<SVGElement>("[data-draw]").forEach((svg) => {
          const paths = svg.querySelectorAll<SVGGeometryElement>(
            "path, line, rect, circle, polyline"
          )
          paths.forEach((path) => {
            const length = Math.ceil(path.getTotalLength?.() ?? 400)
            path.style.strokeDasharray = `${length}`
            path.style.strokeDashoffset = `${length}`
          })
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.inOut",
            scrollTrigger: { trigger: svg, start: "top 80%", once: true }
          })
          svg.querySelectorAll("[data-draw-label]").forEach((label) =>
            gsap.from(label, {
              opacity: 0,
              duration: 0.5,
              delay: 0.4,
              scrollTrigger: { trigger: svg, start: "top 80%", once: true }
            })
          )
        })

        // Map dots pop in one after another.
        document.querySelectorAll<SVGElement>("[data-pop]").forEach((svg) => {
          gsap.from(svg.querySelectorAll("[data-dot]"), {
            scale: 0,
            opacity: 0,
            transformOrigin: "center",
            transformBox: "fill-box",
            duration: 0.6,
            ease: "back.out(2)",
            stagger: 0.18,
            scrollTrigger: { trigger: svg, start: "top 80%", once: true }
          })
        })

        // Equation rows fade in one after another.
        document.querySelectorAll<HTMLElement>("[data-terms]").forEach((el) => {
          const rows = el.querySelectorAll(
            ".katex-html .vlist-t .vlist-r > .vlist > span"
          )
          if (!rows.length) return
          gsap.from(rows, {
            opacity: 0,
            y: 8,
            duration: 0.5,
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 80%", once: true }
          })
        })

        // Code lines highlight in sequence as the tile scrolls through.
        document
          .querySelectorAll<HTMLElement>("[data-codelines]")
          .forEach((block) => {
            const lines = [
              ...block.querySelectorAll<HTMLElement>("[data-line]")
            ]
            ScrollTrigger.create({
              trigger: block,
              start: "top 75%",
              end: "bottom 35%",
              onUpdate: (self) => {
                const active = Math.min(
                  lines.length - 1,
                  Math.floor(self.progress * lines.length)
                )
                lines.forEach((line, index) =>
                  line.toggleAttribute("data-active", index === active)
                )
              },
              onLeave: () =>
                lines.forEach((line) => line.removeAttribute("data-active"))
            })
          })
      })
      revert = () => ctx.revert()
      ScrollTrigger.refresh()
    }

    const hasIdle = typeof window.requestIdleCallback === "function"
    const idle = hasIdle
      ? window.requestIdleCallback(() => void run(), { timeout: 1500 })
      : window.setTimeout(() => void run(), 300)

    return () => {
      disposed = true
      if (hasIdle) window.cancelIdleCallback(idle as number)
      else window.clearTimeout(idle as number)
      revert?.()
      cleanups.forEach((fn) => fn())
    }
  }, [pathname])

  return null
}
