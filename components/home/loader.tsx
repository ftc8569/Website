"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

/*
 * Boot sequence.
 *
 * Hard rule: this overlay must never be able to trap someone on a blank page.
 * It is server-rendered, so if dismissal depended on JS, any hydration failure
 * or throttled timer would strand the whole site behind it.
 *
 * So the animation AND the dismissal are pure CSS — the fill, the sweep, the
 * bar and the final fade all run off keyframes that end in
 * `visibility: hidden; pointer-events: none`. With JS dead, broken, or simply
 * slow, the page still becomes usable on schedule.
 *
 * JS only unmounts the element afterwards and ticks the decorative counter.
 * There is deliberately no scroll lock: that would be one more way to strand
 * someone if teardown never ran.
 */

const RUN = 1800 // fill duration, must match --boot-run in globals.css
const TOTAL = 2500 // fill + fade, must match the bootOut keyframes

export default function Loader() {
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const started = performance.now()

    const ticker = setInterval(() => {
      const pct = Math.min(100, ((performance.now() - started) / RUN) * 100)
      setCount(pct)
      if (pct >= 100) clearInterval(ticker)
    }, 60)

    const unmount = setTimeout(() => setDone(true), TOTAL + 150)

    return () => {
      clearInterval(ticker)
      clearTimeout(unmount)
    }
  }, [])

  if (done) return null

  return (
    <div className="boot" role="status" aria-label="Loading RoboKnights">
      <div className="boot-grid" aria-hidden="true" />
      <div className="boot-core">
        <div className="boot-ring" aria-hidden="true" />
        <div className="boot-ring boot-ring--inner" aria-hidden="true" />
        <div className="boot-mark">
          <Image
            className="boot-mark-ghost"
            src="/assets/logo.png"
            alt=""
            width={866}
            height={1096}
            priority
          />
          <Image
            className="boot-mark-lit"
            src="/assets/logo.png"
            alt=""
            width={866}
            height={1096}
            priority
          />
          <span className="boot-sweep" aria-hidden="true" />
        </div>
      </div>

      <div className="boot-readout">
        <span>RoboKnights</span>
        <span className="boot-count">
          {Math.round(count).toString().padStart(3, "0")}
        </span>
        <span>8569</span>
      </div>
      <div className="boot-bar" aria-hidden="true">
        <i />
      </div>
    </div>
  )
}
