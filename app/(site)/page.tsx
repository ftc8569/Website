"use client"

import Image from "next/image"
import Link from "next/link"
import { type MouseEvent } from "react"

import PhotoMarquee from "@/components/home/photo-marquee"
import RobotViewer from "@/components/home/robot-viewer"
import { ArrowIcon } from "@/components/site/shell"
import { galleryImages, impactStats } from "@/components/home/content"

const capabilities = [
  {
    number: "01",
    eyebrow: "Autonomous systems",
    title: "Code that thinks\nbefore we do.",
    description:
      "Computer vision, motion planning, and control systems engineered for decisive performance.",
    image: "/activity/programming.jpg",
    href: "/software",
    className: "capability--code"
  },
  {
    number: "02",
    eyebrow: "Mechanical engineering",
    title: "Built for the\npoint of impact.",
    description:
      "Every gram, gear, and geometry choice is designed to survive the match—and dominate it.",
    image: "/activity/mechanical.jpg",
    href: "/robot",
    className: "capability--mechanical"
  },
  {
    number: "03",
    eyebrow: "Human connection",
    title: "Impact beyond\nthe arena.",
    description:
      "We build access, curiosity, and the next generation of people who refuse to think small.",
    image: "/activity/outreach.jpg",
    href: "/outreach",
    className: "capability--outreach"
  }
]

export default function HomePage() {
  const trackPointer = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${event.clientX - bounds.left}px`
    )
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${event.clientY - bounds.top}px`
    )
  }

  return (
    <main>
      {/* ---------------------------------------------------------- Hero */}
      <section id="top" className="launch-hero" onMouseMove={trackPointer}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-kicker">
          <span className="status-dot" />
          FTC Team 8569 · NCSSM
        </div>
        <div className="hero-copy">
          <p className="hero-overline">Engineering, weaponized.</p>
          <h1>
            <span>Build the</span>
            <span className="hero-title-accent">impossible.</span>
          </h1>
          <p className="hero-subtitle">
            We don&apos;t enter the arena to participate.
          </p>
          <a className="launch-cta" href="#systems">
            Explore the machine <ArrowIcon />
          </a>
        </div>
        <div
          className="hero-machine"
          aria-label="RoboKnights competition robot render"
        >
          <div className="machine-halo" aria-hidden="true" />
          <div className="machine-scan" aria-hidden="true" />
          <RobotViewer />
          <span className="machine-label machine-label--left">
            8569 // MK.V
          </span>
          <span className="machine-label machine-label--right">
            SYSTEM READY
          </span>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll to initialize</span>
          <i />
        </div>
      </section>

      {/* ----------------------------------------------------- Manifesto */}
      <section className="manifesto" data-reveal>
        <p className="section-index">00 / Mission</p>
        <h2>
          Precision is not a detail.
          <br />
          <em>It is the whole machine.</em>
        </h2>
        <div className="manifesto-meta">
          <p>Durham, North Carolina</p>
          <p>Student engineered</p>
          <p>Competition proven</p>
        </div>
      </section>
      <div className="signal-strip" aria-hidden="true">
        <div>
          <span>SPEED</span>
          <i />
          <span>SLIME</span>
          <i />
          <span>SCORE</span>
          <i />
          <span>SPEED</span>
          <i />
          <span>SLIME</span>
          <i />
          <span>SCORE</span>
          <i />
        </div>
      </div>

      {/* -------------------------------------------------------- Impact */}
      <section id="impact" className="impact" data-reveal>
        <p className="section-index">01 / Impact</p>
        <div className="impact-grid">
          {impactStats.map((stat) => (
            <div className="impact-cell" key={stat.label}>
              <p className="impact-value">{stat.value}</p>
              <p className="impact-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="systems" className="systems-section">
        <header className="systems-header" data-reveal>
          <p className="section-index">02 / Systems</p>
          <h2>
            Three disciplines.
            <br />
            One machine.
          </h2>
        </header>
        {capabilities.map((capability) => (
          <Link
            className={`capability ${capability.className}`}
            key={capability.title}
            href={capability.href}
            data-reveal
          >
            <div className="capability-image">
              <Image
                src={capability.image}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
              />
              <div className="capability-image-shade" />
            </div>
            <div className="capability-copy">
              <p className="capability-number">{capability.number}</p>
              <p className="capability-eyebrow">{capability.eyebrow}</p>
              <h3>
                {capability.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p className="capability-description">{capability.description}</p>
              <span className="capability-cta">
                Explore <ArrowIcon />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section id="gallery" className="gallery-section" data-reveal>
        <header className="gallery-header">
          <p className="section-index">03 / In the field</p>
          <h2>The season, as it happened.</h2>
        </header>
        <PhotoMarquee images={galleryImages} />
      </section>

      {/* ------------------------------------------------------- Contact */}
      <section id="contact" className="finale" data-reveal>
        <div className="finale-glow" aria-hidden="true" />
        <p className="section-index">04 / Contact</p>
        <h2>
          Ready to build
          <br />
          something <em>impossible?</em>
        </h2>
        <a className="finale-button" href="mailto:roboknights@ncssm.edu">
          <span>Start a conversation</span>
          <ArrowIcon />
        </a>
        <footer>
          <span>© {new Date().getFullYear()} RoboKnights 8569</span>
          <div>
            <a href="https://www.instagram.com/roboknights8569/">Instagram</a>
            <a href="https://github.com/ftc8569">GitHub</a>
            <a href="https://www.linkedin.com/company/ftc8569">LinkedIn</a>
          </div>
        </footer>
      </section>
    </main>
  )
}
