"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import { loadMotion, prefersReducedMotion } from "@/components/motion/load"

export type GalleryPhoto = { src: string; alt: string; position?: string }

/*
 * The section pins and the strip of photos scrolls sideways, with a progress
 * bar underneath. Without JS, under reduced motion, or on narrow screens it
 * is a normal swipeable row with scroll snap.
 */
export default function PinnedGallery({ photos }: { photos: GalleryPhoto[] }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = root.current
    if (!node || prefersReducedMotion()) return
    if (!window.matchMedia("(min-width: 835px)").matches) return
    let revert: (() => void) | undefined
    let disposed = false

    void loadMotion().then(({ gsap }) => {
      if (disposed) return
      node.classList.add("strip--pinned")
      const ctx = gsap.context(() => {
        const track = node.querySelector<HTMLElement>(".strip-track")
        const bar = node.querySelector<HTMLElement>(".strip-progress i")
        if (!track) return
        const distance = () => track.scrollWidth - node.clientWidth
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              bar?.style.setProperty("transform", `scaleX(${self.progress})`)
          }
        })
      }, node)
      revert = () => {
        ctx.revert()
        node.classList.remove("strip--pinned")
      }
    })
    return () => {
      disposed = true
      revert?.()
    }
  }, [])

  return (
    <div className="strip" ref={root}>
      <ul className="strip-track" tabIndex={0} aria-label="Photo gallery">
        {photos.map((photo) => (
          <li className="strip-item" key={photo.src}>
            <div className="media media--4x3">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 834px) 80vw, 480px"
                style={{ objectPosition: photo.position ?? "center" }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="strip-progress" aria-hidden="true">
        <i />
      </div>
    </div>
  )
}
