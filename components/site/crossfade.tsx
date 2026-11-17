"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export type FadePhoto = { src: string; alt: string; position?: string }

/*
 * Cycles through photos with a crossfade every few seconds. Paused when
 * off-screen, when the tab is hidden, under reduced motion, or when the
 * visitor presses pause.
 */
export default function Crossfade({
  photos,
  interval = 4000,
  sizes,
  className = "media media--4x3"
}: {
  photos: FadePhoto[]
  interval?: number
  sizes: string
  className?: string
}) {
  const frame = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener("change", sync)
    const node = frame.current
    let intersecting = false
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      setVisible(intersecting && !document.hidden)
    })
    if (node) observer.observe(node)
    const onHidden = () => setVisible(intersecting && !document.hidden)
    document.addEventListener("visibilitychange", onHidden)
    return () => {
      query.removeEventListener("change", sync)
      observer.disconnect()
      document.removeEventListener("visibilitychange", onHidden)
    }
  }, [])

  const running = visible && !paused && !reduced && photos.length > 1
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % photos.length),
      interval
    )
    return () => window.clearInterval(timer)
  }, [running, interval, photos.length])

  return (
    <div className={`${className} fade`} ref={frame}>
      {photos.map((photo, i) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={i === index ? photo.alt : ""}
          aria-hidden={i === index ? undefined : true}
          fill
          sizes={sizes}
          className={i === index ? "is-active" : undefined}
          style={{ objectPosition: photo.position ?? "center" }}
        />
      ))}
      {photos.length > 1 && !reduced && (
        <button
          type="button"
          className="fade-toggle"
          aria-label={paused ? "Play photo slideshow" : "Pause photo slideshow"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}
