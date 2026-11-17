import type { Metadata } from "next"
import Image from "next/image"

import Iteration from "@/components/home/iteration"
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
import { LocalNav, SectionHead, Stats } from "@/components/site/ui"

/*
 * These robots are from the season before the current one. The repo dates
 * the current roster and Season page as 2026–27, so these are 2025–26.
 */
const ROBOT_SEASON = "2025–26 season"

export const metadata: Metadata = {
  title: "Robot",
  description:
    "Our 2025–26 robots: Elite Ball Knowledge, which carried us through States, and the Worlds robot we rebuilt with SigmaCorns #22377."
}

/* The three Worlds tiles shown in full; the rest stay in the data file. */
const WORLDS_FEATURED = [
  "Vectoring intake",
  "FEA-optimised chassis",
  "Ranking-point strategy"
]

export default function RobotPage() {
  const featured = worldsSystems.filter((item) =>
    WORLDS_FEATURED.includes(item.name)
  )

  return (
    <main>
      <header className="hero-home">
        <div className="wrap">
          <p className="eyebrow">{ROBOT_SEASON} robots</p>
          <h1>Two robots, one season.</h1>
          <p className="subhead" style={{ maxWidth: "40ch" }}>
            Elite Ball Knowledge carried us through States. Then we tore it down
            and built the Worlds bot around one question: how fast can one
            artifact get from the floor to the goal?
          </p>
        </div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <div className="robot-hero-render">
            <Image
              src="/cad/cover-render.webp"
              alt="CAD render of Elite Ball Knowledge, our States robot"
              width={719}
              height={718}
              priority
              sizes="(max-width: 734px) 90vw, 620px"
            />
          </div>
        </div>
      </header>

      <LocalNav
        title="Robot"
        links={[
          { href: "#ebk", label: "Elite Ball Knowledge" },
          { href: "#iteration", label: "How we iterated" },
          { href: "#worlds", label: "Worlds robot" }
        ]}
        action={{ href: "/software", label: "See the code" }}
      />

      {/* ------------------------------------------------------------ EBK */}
      <section id="ebk" className="section">
        <div className="wrap--media">
          <SectionHead
            eyebrow={`States robot · ${ROBOT_SEASON}`}
            title={robotName}
            sub="Eight motors and six servos around a Geneva colour sorter. We modelled every part in CAD before anything was cut, then made it in the NCSSM FabLab."
          />
          <div className="spec" data-reveal>
            <div className="media media--square media--render spec-render">
              <Image
                src="/cad/robot-full.webp"
                alt="Full CAD model of Elite Ball Knowledge"
                fill
                sizes="(max-width: 834px) 100vw, 560px"
              />
            </div>
            <Stats items={robotSpecs} cols={2} />
          </div>
          <div className="grid grid--4" style={{ marginTop: 16 }}>
            {subsystems.map((item) => (
              <article className="tile tile--media" key={item.name} data-reveal>
                <div className="media media--4x3 media--render">
                  <Image
                    src={item.image}
                    alt={`CAD render of the ${item.name.toLowerCase()}`}
                    fill
                    sizes="(max-width: 734px) 100vw, 300px"
                  />
                </div>
                <div className="tile-copy">
                  <h3>{item.name}</h3>
                  <p className="body">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Iteration */}
      <section id="iteration" className="section section--surface">
        <div className="wrap--media">
          <SectionHead
            title="Nothing worked the first time."
            sub="The intake and transfer each took three versions and the Spice Rack took two. Here's what broke each time and what we changed."
          />
          <Iteration tracks={iterationTracks} />

          <div className="tile materials" data-reveal>
            <div>
              <h3>How we chose materials</h3>
              <p className="body">
                We scored each way of making a part on nine criteria, including
                strength, weight, repairability and cost. 3D printing scored
                highest overall, so it makes the non-structural parts. goBILDA
                covers standard hardware, and we save the waterjet for the
                drivetrain, which takes hits all match.
              </p>
            </div>
            <ul className="bars">
              {materialScores.map((row) => (
                <li key={row.material}>
                  <div className="bars-label">
                    <span>{row.material}</span>
                    <span className="num">{row.score}</span>
                  </div>
                  <div className="bars-track" aria-hidden="true">
                    <i style={{ width: `${(row.score / 56.5) * 100}%` }} />
                  </div>
                  <p className="caption">{row.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Worlds */}
      <section id="worlds" className="section">
        <div className="wrap--media">
          <SectionHead
            eyebrow={`Worlds robot · ${ROBOT_SEASON}`}
            title="We tore it down and started again."
            sub={worldsIntro}
          />
          <div className="tile worlds-hero" data-reveal>
            <div className="media media--4x3 media--render">
              <Image
                src="/worlds/bot-iso.webp"
                alt="CAD render of the Worlds robot"
                fill
                sizes="(max-width: 834px) 100vw, 560px"
              />
            </div>
            <Stats items={worldsHeadline} cols={2} />
          </div>
          <div className="grid grid--3" style={{ marginTop: 16 }}>
            {featured.map((item) => (
              <article className="tile tile--media" key={item.name} data-reveal>
                <div
                  className={`media media--16x9 ${
                    item.image.includes("fea") ? "media--fea" : "media--render"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={
                      item.image.includes("fea")
                        ? "Finite element stress map of the drivetrain sideplate, blue for low stress through red for high"
                        : `CAD render: ${item.name.toLowerCase()}`
                    }
                    fill
                    sizes="(max-width: 734px) 100vw, 400px"
                  />
                </div>
                <div className="tile-copy">
                  <h3>{item.name}</h3>
                  <p className="body">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
