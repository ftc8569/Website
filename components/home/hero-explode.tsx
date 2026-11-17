"use client"

import Image from "next/image"
import { useEffect, useRef, type ReactNode } from "react"

import RobotViewer from "@/components/home/robot-viewer"
import { loadMotion, prefersReducedMotion } from "@/components/motion/load"

/*
 * The Worlds robot, held in place while you scroll the next ~120vh. It turns half
 * a turn, then its subsystems separate along their axes with labels, then
 * come back together.
 *
 * The GLB is one mesh with no named parts, so the "exploded" pieces are our
 * own CAD renders of each subsystem layered around the model. Under reduced
 * motion the renders sit in a plain row below the model instead. Anything
 * passed as children (the stat strip) stays with the model while it sticks.
 */
const LAYERS = [
  {
    name: "Storage rollers",
    src: "/worlds/roller-stack.webp",
    w: 366,
    h: 291,
    to: { x: -1, y: -1 }
  },
  {
    name: "Shooter",
    src: "/worlds/shooter.webp",
    w: 424,
    h: 327,
    to: { x: 1, y: -1 }
  },
  {
    name: "Drivetrain",
    src: "/worlds/drivetrain.webp",
    w: 304,
    h: 265,
    to: { x: -1, y: 1 }
  },
  {
    name: "Intake",
    src: "/worlds/intake-front.webp",
    w: 440,
    h: 260,
    to: { x: 1, y: 1 }
  }
]

export default function HeroExplode({ children }: { children?: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)
  const spin = useRef(0)

  useEffect(() => {
    const node = stage.current
    if (!node || prefersReducedMotion()) return
    let revert: (() => void) | undefined
    let disposed = false

    void loadMotion().then(({ gsap }) => {
      if (disposed) return
      node.classList.add("explode--live")
      const ctx = gsap.context(() => {
        const model = node.querySelector(".hero-model")
        const layers = gsap.utils.toArray<HTMLElement>(".explode-layer", node)
        const labels = gsap.utils.toArray<HTMLElement>(".explode-label", node)
        const box = node.querySelector<HTMLElement>(".explode-box") ?? node
        const spread = () => ({
          x: box.clientWidth * 0.3,
          y: box.clientHeight * 0.27
        })
        gsap.set(layers, { opacity: 0, scale: 0.55, x: 0, y: 0 })
        gsap.set(labels, { opacity: 0 })

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          // The track is 120vh taller than the robot from first paint and the
          // robot is position: sticky inside it, so no pin spacer is ever
          // inserted and nothing on the page shifts when motion loads.
          scrollTrigger: {
            trigger: node.parentElement ?? node,
            start: "top 56px",
            end: () => `+=${window.innerHeight * 1.2}`,
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        tl.to(spin, { current: 1, duration: 3 })
          .to(model, { opacity: 0.12, scale: 0.88, duration: 1.4 }, ">-0.4")
          .to(
            layers,
            {
              opacity: 1,
              scale: 1,
              x: (i) => LAYERS[i].to.x * spread().x,
              y: (i) => LAYERS[i].to.y * spread().y,
              duration: 2,
              stagger: 0.12
            },
            "<"
          )
          .to(labels, { opacity: 1, duration: 0.8, stagger: 0.08 }, ">-0.6")
          .to({}, { duration: 1.2 })
          .to(labels, { opacity: 0, duration: 0.5 })
          .to(
            layers,
            { opacity: 0, scale: 0.55, x: 0, y: 0, duration: 1.6 },
            "<"
          )
          .to(model, { opacity: 1, scale: 1, duration: 1.4 }, "<0.3")
      }, node)
      revert = () => {
        ctx.revert()
        node.classList.remove("explode--live")
      }
    })

    return () => {
      disposed = true
      revert?.()
    }
  }, [])

  return (
    <div className="explode-track">
      <div className="explode" ref={stage}>
        <div className="explode-box">
          <div className="hero-model">
            <RobotViewer spin={spin} />
          </div>
          <ul className="explode-layers" aria-label="Worlds robot subsystems">
            {LAYERS.map((layer) => (
              <li className="explode-layer" key={layer.name}>
                <Image
                  src={layer.src}
                  alt={`CAD render of the Worlds robot's ${layer.name.toLowerCase()}`}
                  width={layer.w}
                  height={layer.h}
                  sizes="220px"
                />
                <span className="explode-label">{layer.name}</span>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </div>
  )
}
