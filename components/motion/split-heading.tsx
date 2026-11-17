"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { loadMotion, prefersReducedMotion } from "@/components/motion/load"

/*
 * A headline that slides up line by line the first time it scrolls into
 * view. The server renders the plain text; after hydration the component
 * measures its own line breaks and re-renders them as masked lines through
 * state, so React always owns the markup. Headlines already on screen at
 * load, and reduced motion, are left alone.
 */
export default function SplitHeading({
  as: Tag = "h2",
  className,
  text
}: {
  as?: "h1" | "h2" | "h3"
  className?: string
  text: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)
  const words = text.split(" ")

  // Measure which words share a line, then switch to masked lines.
  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion()) return
    const box = node.getBoundingClientRect()
    if (box.top < window.innerHeight) return
    let cancelled = false
    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return
      const groups: string[][] = []
      let top = Number.NaN
      node.querySelectorAll<HTMLElement>("[data-w]").forEach((word) => {
        const y = Math.round(word.getBoundingClientRect().top)
        if (y !== top) {
          groups.push([])
          top = y
        }
        groups[groups.length - 1].push(word.textContent ?? "")
      })
      setLines(groups.map((group) => group.join(" ")))
    })
    return () => {
      cancelled = true
    }
  }, [text])

  // Animate once the masked lines are on screen; restore plain text after.
  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !lines) return
    let revert: (() => void) | undefined
    let disposed = false
    void loadMotion().then(({ gsap }) => {
      if (disposed) return
      const tween = gsap.from(node.querySelectorAll(".line-inner"), {
        yPercent: 105,
        duration: 0.9,
        stagger: 0.06,
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
        onComplete: () => setLines(null)
      })
      revert = () => tween.scrollTrigger?.kill()
    })
    return () => {
      disposed = true
      revert?.()
    }
  }, [lines])

  return (
    <Tag ref={ref} className={className} aria-label={lines ? text : undefined}>
      {lines
        ? lines.map((line, index) => (
            <span className="line" aria-hidden="true" key={index}>
              <span className="line-inner">{line}</span>
            </span>
          ))
        : words.map((word, index) => (
            <span key={index}>
              <span data-w>{word}</span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
    </Tag>
  )
}
