"use client"

import Image from "next/image"
import { type MouseEvent } from "react"

import Roster, { type TeamData } from "@/components/home/roster"
import { collaborators, mentors, sponsors } from "@/components/home/content"

export default function TeamView({ team }: { team: TeamData }) {
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
      {/* ---------------------------------------------------------- Team */}
      <section className="team-reveal" data-reveal onMouseMove={trackPointer}>
        <div className="team-image">
          <Image
            src="/team-hero.jpg"
            alt="The RoboKnights working together in their robotics lab"
            fill
            sizes="100vw"
          />
        </div>
        <div className="team-overlay" />
        <div className="team-copy">
          <p className="section-index">01 / The team</p>
          <h2>
            Small team.
            <br />
            <em>Heavy impact.</em>
          </h2>
          <p>Different disciplines. One standard.</p>
        </div>
      </section>

      <section id="team" className="roster-section">
        <header className="systems-header" data-reveal>
          <p className="section-index">02 / Roster</p>
          <h2>Meet the RoboKnights.</h2>
        </header>
        <Roster team={team} />
      </section>

      {/* ------------------------------------------------------ Partners */}
      <section id="partners" className="partners" data-reveal>
        <p className="section-index">03 / Support</p>
        <h2>Who backs us.</h2>

        <p className="partners-label">Sponsors</p>
        <div className="logo-wall">
          {sponsors.map((logo) => (
            <div className="logo" key={logo.name} title={logo.name}>
              <Image
                src={logo.src}
                alt={logo.name}
                width={480}
                height={200}
                sizes="180px"
              />
            </div>
          ))}
          <div className="logo logo--text">Ryden Family</div>
        </div>

        <p className="partners-label">
          Companies &amp; institutions we work with
        </p>
        <div className="logo-wall">
          {collaborators.map((logo) => (
            <div className="logo" key={logo.name} title={logo.name}>
              <Image
                src={logo.src}
                alt={logo.name}
                width={480}
                height={200}
                sizes="180px"
              />
            </div>
          ))}
        </div>

        <p className="partners-label">Mentors</p>
        <ul className="mentor-strip">
          {mentors.map((mentor) => (
            <li key={mentor.name}>
              <span className="mentor-avatar">
                <Image
                  src={mentor.src}
                  alt=""
                  width={64}
                  height={64}
                  sizes="48px"
                />
              </span>
              <span className="mentor-text">
                <span className="mentor-name">{mentor.name}</span>
                <span className="mentor-org">{mentor.org}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
