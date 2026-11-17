"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export type Logo = { name: string; src: string; href?: string }

/*
 * Sponsor logos scrolling slowly in a loop. Pauses on hover, when off-screen,
 * and when the visitor presses pause. Under reduced motion it becomes a
 * static wrapped row.
 */
export default function Marquee({ logos }: { logos: Logo[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const node = root.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const item = (logo: Logo, copy: number) => {
    const image = (
      <Image
        src={logo.src}
        alt={copy ? "" : logo.name}
        width={480}
        height={200}
        sizes="160px"
      />
    )
    return (
      <li key={`${logo.name}-${copy}`} aria-hidden={copy ? true : undefined}>
        {logo.href ? (
          <a
            href={logo.href}
            target="_blank"
            rel="noreferrer"
            tabIndex={copy ? -1 : undefined}
          >
            {image}
          </a>
        ) : (
          image
        )}
      </li>
    )
  }

  return (
    <div
      className="marquee"
      ref={root}
      data-paused={paused || !visible || undefined}
    >
      <ul className="marquee-track" aria-label="Sponsors">
        {logos.map((logo) => item(logo, 0))}
        {logos.map((logo) => item(logo, 1))}
      </ul>
      <button
        type="button"
        className="marquee-toggle"
        aria-label={paused ? "Play sponsor logos" : "Pause sponsor logos"}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  )
}
