"use client"

import { useEffect, useRef, useState } from "react"

/*
 * A stat that rolls digit by digit when it enters view. The final value is
 * what the server renders, so without JavaScript, under reduced motion, or
 * when the number is already on screen at load, it simply reads correctly.
 */
export default function Odometer({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [mode, setMode] = useState<"plain" | "ready" | "rolled">("plain")

  useEffect(() => {
    const node = ref.current
    if (!node || !/\d/.test(value)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (node.getBoundingClientRect().top < window.innerHeight) return
    setMode("ready")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        requestAnimationFrame(() => setMode("rolled"))
      },
      { rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  if (mode === "plain") return <span ref={ref}>{value}</span>

  let digit = 0
  return (
    <span ref={ref} className="odo">
      <span className="sr-only">{value}</span>
      {[...value].map((char, index) => {
        if (!/\d/.test(char))
          return (
            <span aria-hidden="true" key={index}>
              {char}
            </span>
          )
        const delay = digit++ * 60
        return (
          <span className="odo-col" aria-hidden="true" key={index}>
            <span
              style={{
                transform:
                  mode === "rolled"
                    ? `translateY(-${Number(char) * 1.1}em)`
                    : "translateY(0)",
                transitionDelay: `${delay}ms`
              }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
