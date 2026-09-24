import type { Metadata } from "next"
import Image from "next/image"

import Iteration from "@/components/home/iteration"
import PageHeader from "@/components/site/page-header"
import {
  iterationTracks,
  materialScores,
  robotName,
  robotSpecs,
  subsystems,
  worldsHeadline,
  worldsIntro,
  worldsSystems
} from "@/components/home/content"

export const metadata: Metadata = {
  title: "Robot — RoboKnights 8569",
  description:
    "Elite Ball Knowledge and the Worlds bot: subsystems, iteration history, and manufacturing."
}

export default function RobotPage() {
  return (
    <main>
      <PageHeader
        eyebrow="The machine"
        title={
          <>
            Two robots,
            <br />
            one season.
          </>
        }
        lede="Elite Ball Knowledge carried us through States. Then we tore it down and built the Worlds bot around a single question: how fast can one artifact get from the floor to the goal?"
      />

      {/* ------------------------------------------------------- Machine */}
      <section id="machine" className="machine-section">
        <header className="machine-header" data-reveal>
          <p className="section-index">01 / Elite Ball Knowledge</p>
          <h2>{robotName}</h2>
          <p className="machine-lede">
            Eight motors, six servos, and a colour-sorting carousel. Designed
            entirely in CAD before a single part was cut, then manufactured
            in-house on our FabLab&apos;s waterjet, CNC, Glowforge, and
            printers.
          </p>
        </header>

        <div className="machine-showcase" data-reveal>
          <div className="machine-render">
            <Image
              src="/cad/cover-render.png"
              alt="Full CAD render of Elite Ball Knowledge"
              width={938}
              height={810}
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </div>
          <ul className="machine-specs">
            {robotSpecs.map((spec) => (
              <li key={spec.label}>
                <span className="machine-spec-value">{spec.value}</span>
                <span className="machine-spec-label">{spec.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="subsystems" data-reveal>
          {subsystems.map((item) => (
            <article className="subsystem" key={item.name}>
              <div className="subsystem-figure">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 900px) 50vw, 24vw"
                  className="object-contain"
                />
              </div>
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- Iteration */}
      <section id="iteration" className="iteration-section">
        <header className="systems-header" data-reveal>
          <p className="section-index">02 / Iteration</p>
          <h2>
            Nothing works
            <br />
            the first time.
          </h2>
          <p className="section-lede">
            Every subsystem on this robot is a third or fourth attempt. Here is
            what broke, and what we did about it.
          </p>
        </header>

        <Iteration tracks={iterationTracks} />

        <div className="materials" data-reveal>
          <div className="materials-copy">
            <h3>Weighted material analysis</h3>
            <p>
              We scored every manufacturing route against strength, weight,
              repairability, quality, time, availability, precision, cost, and
              complexity. 3D printing won on total value — so it takes the
              non-structural parts, goBILDA covers boilerplate, and waterjet is
              reserved for the drivetrain, which takes hits all match.
            </p>
          </div>
          <div className="materials-bars">
            {materialScores.map((row) => (
              <div className="materials-row" key={row.material}>
                <div className="materials-label">
                  <span>{row.material}</span>
                  <span className="materials-score">{row.score}</span>
                </div>
                <div className="materials-bar">
                  <i style={{ width: `${(row.score / 56.5) * 100}%` }} />
                </div>
                <p>{row.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Worlds */}
      <section id="worlds" className="worlds-section">
        <header className="systems-header" data-reveal>
          <p className="section-index">03 / Worlds</p>
          <h2>
            We tore it down
            <br />
            and started again.
          </h2>
          <p className="section-lede">{worldsIntro}</p>
        </header>

        <div className="worlds-hero" data-reveal>
          <div className="worlds-render">
            <Image
              src="/worlds/bot-iso.jpg"
              alt="The Worlds competition robot"
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <ul className="worlds-stats">
            {worldsHeadline.map((stat) => (
              <li key={stat.label}>
                <span className="worlds-stat-value">{stat.value}</span>
                <span className="worlds-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="worlds-grid">
          {worldsSystems.map((item) => (
            <article className="worlds-card" key={item.name} data-reveal>
              <div className="worlds-figure">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="worlds-copy">
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
