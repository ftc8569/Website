"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import type { SeasonEvent } from "@/components/home/season"

/* Counts from 0 to `value` the first time it scrolls into view. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const node = ref.current
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setShown(0)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1400, 1)
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <span ref={ref} aria-label={String(value)}>
      {shown}
    </span>
  )
}

export default function SeasonTimeline({ events }: { events: SeasonEvent[] }) {
  const rail = useRef<HTMLOListElement>(null)

  // Fill the rail as the reader moves through the season.
  useEffect(() => {
    const node = rail.current
    if (!node) return
    let frame = 0
    const update = () => {
      frame = 0
      const bounds = node.getBoundingClientRect()
      const anchor = window.innerHeight * 0.55
      const progress = (anchor - bounds.top) / Math.max(bounds.height, 1)
      node.style.setProperty(
        "--season-progress",
        String(Math.min(Math.max(progress, 0), 1))
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
    }
  }, [])

  return (
    <ol className="season-rail" ref={rail}>
      {events.map((event, index) => (
        <li
          className={`season-event${event.highlight ? " season-event--feature" : ""}`}
          key={event.id}
          id={event.id}
          data-reveal
        >
          <div className="season-marker" aria-hidden="true">
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
          <div className="season-body">
            <p className="season-meta">
              <span>{event.date}</span>
              {event.kind}
            </p>
            <h2>{event.title}</h2>
            <p className="season-copy">{event.body}</p>

            {event.highlight && (
              <div className="season-highlight">
                <p className="season-highlight-value">
                  <CountUp value={event.highlight.value} />
                </p>
                <div>
                  <p className="season-highlight-label">
                    {event.highlight.label}
                  </p>
                  <p className="season-highlight-detail">
                    {event.highlight.detail}
                  </p>
                </div>
              </div>
            )}

            {event.stats && (
              <dl className="season-stats">
                {event.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.value}</dt>
                    <dd>{stat.label}</dd>
                  </div>
                ))}
              </dl>
            )}

            {event.image && (
              <figure className="season-figure">
                <Image
                  src={event.image.src}
                  alt={event.image.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  className="object-cover"
                />
              </figure>
            )}

            {event.points && (
              <ul className="season-points">
                {event.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}

            {event.photos && (
              <div className="season-mosaic">
                {event.photos.map((photo) => (
                  <figure
                    className={photo.span && `is-${photo.span}`}
                    key={photo.src}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </figure>
                ))}
              </div>
            )}
            {event.credit && <p className="season-credit">{event.credit}</p>}
          </div>
        </li>
      ))}
      <li className="season-event season-event--next" data-reveal>
        <div className="season-marker" aria-hidden="true">
          <span>…</span>
        </div>
        <div className="season-body">
          <p className="season-meta">
            <span>Next</span>Still being written
          </p>
          <h2>More to come.</h2>
          <p className="season-copy">New events land here as they happen.</p>
        </div>
      </li>
    </ol>
  )
}
