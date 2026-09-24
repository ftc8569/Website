"use client"

import { useEffect, useMemo, useRef } from "react"

/*
 * Two-row photo marquee: the rows drift in opposite directions, and a
 * horizontal trackpad swipe injects an impulse that decays back to the idle
 * drift. Hand-rolled rAF writing transforms directly — no animation library,
 * no CSS keyframes.
 *
 * Two deliberate choices here, both learned the hard way:
 *
 *  1. ONE DOM tree, sized by CSS. Rendering separate desktop and mobile trees
 *     meant the hidden one still fetched every image — and a `display: none`
 *     element can't resolve `sizes`, so the browser grabbed the LARGEST srcset
 *     candidate (3840w) for every card. That queued dozens of huge images and
 *     left the strip blank.
 *
 *  2. Plain <img> on pre-sized files, not next/image. These are decorative
 *     thumbnails duplicated many times over; running ~24 of them through the
 *     image optimizer buys nothing and stalls the strip on a cold cache.
 *     /public/gallery holds them at 960x560, which is 2x the desktop card.
 *
 * The loop distance is measured from the live DOM, so it stays correct across
 * breakpoints without duplicating the markup.
 */

export type MarqueeImage = { src: string; alt: string }

const BASE_VELOCITY = -0.35
const MAX_VELOCITY = 14
const REPEATS = 3

function Track({
  trackRef,
  items,
  keyPrefix
}: {
  trackRef: React.RefObject<HTMLDivElement | null>
  items: MarqueeImage[]
  keyPrefix: string
}) {
  return (
    <div className="marquee-row">
      <div ref={trackRef} className="marquee-track">
        {items.map((img, i) => (
          <div className="marquee-card" key={`${keyPrefix}-${i}`}>
            <img
              src={img.src}
              alt={i < items.length / REPEATS ? img.alt : ""}
              width={960}
              height={560}
              draggable={false}
              decoding="async"
              /*
               * Eager on purpose. These cards are positioned by transform, so
               * the ones parked off-screen never satisfy the lazy-load
               * heuristic and stay blank forever. There are only 13 unique
               * files (~1.2 MB) and the repeats reuse the same URLs, so the
               * browser fetches each one once.
               */
              loading="eager"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PhotoMarquee({ images }: { images: MarqueeImage[] }) {
  const half = Math.ceil(images.length / 2)
  const rowA = useMemo(() => images.slice(0, half), [images, half])
  const rowB = useMemo(() => images.slice(half), [images, half])

  const repeat = (row: MarqueeImage[]) =>
    Array.from({ length: REPEATS }, () => row).flat()

  const trackA = useMemo(() => repeat(rowA), [rowA])
  const trackB = useMemo(() => repeat(rowB), [rowB])

  const shell = useRef<HTMLDivElement>(null)
  const trkA = useRef<HTMLDivElement>(null)
  const trkB = useRef<HTMLDivElement>(null)

  const offsetA = useRef(0)
  const offsetB = useRef(0)
  const velocity = useRef(BASE_VELOCITY)
  const impulse = useRef(0)
  const lastWheel = useRef(0)
  const visible = useRef(true)

  useEffect(() => {
    const node = shell.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // One repeat's worth of width, measured live so it survives a resize.
    const loopOf = (track: HTMLDivElement | null) =>
      track ? track.scrollWidth / REPEATS : 0

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
      },
      { rootMargin: "200px" }
    )
    io.observe(node)

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) * 1.4 <= Math.abs(event.deltaY)) return
      event.preventDefault()
      impulse.current += event.deltaX * 0.0045
      lastWheel.current = performance.now()
    }
    node.addEventListener("wheel", onWheel, { passive: false })

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible.current) return

      const loopA = loopOf(trkA.current)
      const loopB = loopOf(trkB.current)
      if (!loopA || !loopB) return

      const now = performance.now()
      velocity.current += impulse.current
      impulse.current *= 0.6
      if (Math.abs(impulse.current) < 5e-4) impulse.current = 0

      const rate = now - lastWheel.current > 1000 ? 0.03 : 0.035
      velocity.current += (BASE_VELOCITY - velocity.current) * rate
      velocity.current = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, velocity.current)
      )

      offsetA.current += velocity.current
      if (offsetA.current <= -loopA) offsetA.current += loopA
      if (offsetA.current > 0) offsetA.current -= loopA

      offsetB.current -= velocity.current
      if (offsetB.current >= 0) offsetB.current -= loopB
      if (offsetB.current < -loopB) offsetB.current += loopB

      if (trkA.current)
        trkA.current.style.transform = `translate3d(${offsetA.current}px,0,0)`
      if (trkB.current)
        trkB.current.style.transform = `translate3d(${offsetB.current}px,0,0)`
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      node.removeEventListener("wheel", onWheel)
    }
  }, [])

  return (
    <div className="marquee" ref={shell}>
      <div className="marquee-fade marquee-fade--left" aria-hidden="true" />
      <div className="marquee-fade marquee-fade--right" aria-hidden="true" />
      <Track trackRef={trkA} items={trackA} keyPrefix="a" />
      <Track trackRef={trkB} items={trackB} keyPrefix="b" />
    </div>
  )
}
