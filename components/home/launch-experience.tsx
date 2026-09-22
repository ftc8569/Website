"use client"

import Image from "next/image"
import { useEffect, useState, type MouseEvent } from "react"

const capabilities = [
  {
    number: "01",
    eyebrow: "Autonomous systems",
    title: "Code that thinks\nbefore we do.",
    description: "Computer vision, motion planning, and control systems engineered for decisive performance.",
    image: "/activity/programming-1.png",
    className: "capability--code"
  },
  {
    number: "02",
    eyebrow: "Mechanical engineering",
    title: "Built for the\npoint of impact.",
    description: "Every gram, gear, and geometry choice is designed to survive the match—and dominate it.",
    image: "/activity/mechanical-1.png",
    className: "capability--mechanical"
  },
  {
    number: "03",
    eyebrow: "Human connection",
    title: "Impact beyond\nthe arena.",
    description: "We build access, curiosity, and the next generation of people who refuse to think small.",
    image: "/activity/outreach-1.jpg",
    className: "capability--outreach"
  }
]

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function LaunchExperience() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const updateNav = () => setScrolled(window.scrollY > 40)
    updateNav()
    window.addEventListener("scroll", updateNav, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible")
      }),
      { threshold: 0.16 }
    )

    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node))

    return () => {
      window.removeEventListener("scroll", updateNav)
      observer.disconnect()
    }
  }, [])

  const trackPointer = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`)
  }

  return (
    <main className="launch-site">
      <nav className={`launch-nav ${scrolled ? "launch-nav--scrolled" : ""}`} aria-label="Primary navigation">
        <a className="launch-brand" href="#top" aria-label="RoboKnights home">
          <Image src="/assets/logo.png" alt="" width={42} height={42} priority />
          <span>RK / 8569</span>
        </a>
        <button className="launch-menu-button" type="button" aria-expanded={menuOpen} aria-controls="launch-menu" onClick={() => setMenuOpen((value) => !value)}>
          <span /><span /><span className="sr-only">Toggle menu</span>
        </button>
        <div id="launch-menu" className={`launch-links ${menuOpen ? "launch-links--open" : ""}`}>
          <a href="#systems" onClick={() => setMenuOpen(false)}>Systems</a>
          <a href="#team" onClick={() => setMenuOpen(false)}>Team</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
      </nav>

      <section id="top" className="launch-hero" onMouseMove={trackPointer}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-kicker"><span className="status-dot" />FTC Team 8569 · NCSSM</div>
        <div className="hero-copy">
          <p className="hero-overline">Engineering, weaponized.</p>
          <h1><span>Build the</span><span className="hero-title-accent">impossible.</span></h1>
          <p className="hero-subtitle">We don&apos;t enter the arena to participate.</p>
          <a className="launch-cta" href="#systems">Explore the machine <ArrowIcon /></a>
        </div>
        <div className="hero-machine" aria-label="RoboKnights competition robot render">
          <div className="machine-halo" aria-hidden="true" />
          <div className="machine-scan" aria-hidden="true" />
          <Image src="/robot/0001.png" alt="RoboKnights competition robot" width={1920} height={1920} priority sizes="(max-width: 900px) 100vw, 62vw" />
          <span className="machine-label machine-label--left">8569 // MK.V</span>
          <span className="machine-label machine-label--right">SYSTEM READY</span>
        </div>
        <div className="hero-scroll" aria-hidden="true"><span>Scroll to initialize</span><i /></div>
      </section>

      <section className="manifesto" data-reveal>
        <p className="section-index">00 / Mission</p>
        <h2>Precision is not a detail.<br /><em>It is the whole machine.</em></h2>
        <div className="manifesto-meta"><p>Durham, North Carolina</p><p>Student engineered</p><p>Competition proven</p></div>
      </section>

      <div className="signal-strip" aria-hidden="true"><div><span>DESIGN</span><i /><span>ITERATE</span><i /><span>EXECUTE</span><i /><span>DESIGN</span><i /><span>ITERATE</span><i /><span>EXECUTE</span><i /></div></div>

      <section id="systems" className="systems-section">
        <header className="systems-header" data-reveal><p className="section-index">01 / Systems</p><h2>Three disciplines.<br />One machine.</h2></header>
        {capabilities.map((capability) => (
          <article className={`capability ${capability.className}`} key={capability.title} data-reveal>
            <div className="capability-image">
              <Image src={capability.image} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" />
              <div className="capability-image-shade" />
            </div>
            <div className="capability-copy">
              <p className="capability-number">{capability.number}</p><p className="capability-eyebrow">{capability.eyebrow}</p>
              <h3>{capability.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3>
              <p className="capability-description">{capability.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section id="team" className="team-reveal" data-reveal onMouseMove={trackPointer}>
        <div className="team-image"><Image src="/team.jpg" alt="The RoboKnights working together in their robotics lab" fill sizes="100vw" /></div>
        <div className="team-overlay" />
        <div className="team-copy"><p className="section-index">02 / The team</p><h2>Small team.<br /><em>Heavy impact.</em></h2><p>Different disciplines. One standard.</p></div>
        <a className="team-link" href="/DigitalAlliance.pdf">Meet the force <ArrowIcon /></a>
      </section>

      <section id="contact" className="finale" data-reveal>
        <div className="finale-glow" aria-hidden="true" />
        <p className="section-index">03 / Contact</p>
        <h2>Ready to build<br />something <em>impossible?</em></h2>
        <a className="finale-button" href="mailto:roboknights@ncssm.edu"><span>Start a conversation</span><ArrowIcon /></a>
        <footer><span>© {new Date().getFullYear()} RoboKnights 8569</span><div><a href="https://www.instagram.com/roboknights8569/">Instagram</a><a href="https://github.com/ftc8569">GitHub</a><a href="https://www.linkedin.com/company/ftc8569">LinkedIn</a></div></footer>
      </section>
    </main>
  )
}
