import type { Metadata } from "next"
import Image from "next/image"

import {
  impactStats,
  outreachPrograms,
  sustainability
} from "@/components/home/content"
import Crossfade from "@/components/site/crossfade"
import NcMap from "@/components/site/nc-map"
import Tape from "@/components/site/tape"
import { LocalNav, PageTitle, SectionHead, Stats } from "@/components/site/ui"

const COLLAGE = [
  {
    src: "/activity/outreach-header.jpg",
    alt: "The team in front of the lit ROBOTS wall with the robot on the carpet",
    position: "center 45%"
  },
  {
    src: "/outreach/triad-technos.jpg",
    alt: "The Triad Technos FLL team we started, beside their project board",
    position: "center 35%"
  },
  {
    src: "/outreach/club-fair.jpg",
    alt: "Team members at our club fair table",
    position: "center"
  }
]

export const metadata: Metadata = {
  title: "Outreach",
  description:
    "Starting an FLL team in Greensboro, running robot demos across Durham, and trading design reviews with teams in Brazil and Romania."
}

const program = (title: string) => {
  const found = outreachPrograms.find((item) => item.title === title)
  if (!found) throw new Error(`Missing outreach program: ${title}`)
  return found
}

const PHOTO: Record<string, { alt: string; position: string }> = {
  "Triad Technos": {
    alt: "The Triad Technos FLL students beside their HydraTech project board",
    position: "center 35%"
  },
  "Kids Knight Out": {
    alt: "RoboKnights members and a young child at a sensory-friendly science demo",
    position: "center 35%"
  },
  GlobalKnights: {
    alt: "Video call between RoboKnights and partner teams in Brazil and Romania",
    position: "center"
  },
  "Open House": {
    alt: "Visitors gathered around our robot on a mat at the open house",
    position: "center 12%"
  },
  "Durham Main Library": {
    alt: "RoboKnights members talking with young visitors at the library",
    position: "center 30%"
  },
  Volunteering: {
    alt: "Five volunteers in gold FIRST volunteer shirts",
    position: "center 15%"
  }
}

/* Second photos, only where we have a distinct one of the same event. */
const EXTRA: Record<string, { src: string; alt: string; position?: string }[]> =
  {
    "Triad Technos": [
      {
        src: "/outreach/science-board.jpg",
        alt: "The Triad Technos project board for their FLL season"
      }
    ]
  }

export default function OutreachPage() {
  const featured = program("Triad Technos")
  const started = [program("Kids Knight Out"), program("GlobalKnights")]
  const events = [
    program("Open House"),
    program("Durham Main Library"),
    program("Volunteering")
  ]
  const [docs, ri5w] = [
    sustainability.find((item) => item.title === "Knowledge continuity"),
    sustainability.find((item) => item.title === "Robot in 5 Weeks")
  ]

  return (
    <main>
      <header className="collage-hero">
        <div className="wrap--media collage-hero-inner">
          <div className="collage-copy">
            <p className="eyebrow">Outreach</p>
            <PageTitle>We teach what we were taught.</PageTitle>
            <p className="subhead">
              NCSSM is a two-year school, so half our team turns over every
              year. Passing knowledge on is how we survive, and we do it well
              beyond our own roster.
            </p>
          </div>
          <div className="collage" role="group" aria-label="Outreach photos">
            <Tape
              color="pink"
              style={{ top: 2, left: "38%", ["--tape-r" as string]: "-6deg" }}
            />
            {COLLAGE.map((photo, index) => (
              <div
                className={`media collage-photo collage-photo--${index}`}
                key={photo.src}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading={index === 0 ? "eager" : undefined}
                  fetchPriority={index === 0 ? "high" : undefined}
                  sizes="(max-width: 834px) 70vw, 420px"
                  style={{ objectPosition: photo.position }}
                />
              </div>
            ))}
          </div>
        </div>
      </header>
      <LocalNav
        title="Outreach"
        links={[
          { href: "#started", label: "Teams we started" },
          { href: "#events", label: "Events" },
          { href: "#volunteering", label: "Volunteering" },
          { href: "#sustainability", label: "Sustainability" }
        ]}
      />

      {/* ------------------------------------------- Teams we started */}
      <section id="started" className="section">
        <div className="wrap--media">
          <SectionHead
            title="Teams and programs we started"
            sub="Some of this is a team we built from scratch. Some of it runs every month."
          />
          <article className="tile tile--split" data-reveal>
            <Crossfade
              className="media"
              sizes="(max-width: 834px) 100vw, 640px"
              photos={[
                {
                  src: featured.image!,
                  alt: PHOTO[featured.title].alt,
                  position: PHOTO[featured.title].position
                },
                ...EXTRA[featured.title]
              ]}
            />
            <div className="tile-copy">
              <p className="eyebrow">{featured.subtitle}</p>
              <h3>{featured.title}</h3>
              <p className="body">{featured.body}</p>
            </div>
          </article>
          <div className="grid grid--2" style={{ marginTop: 16 }}>
            {started.map((item) => (
              <ProgramTile key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Events */}
      <section id="events" className="section section--surface">
        <div className="wrap--media">
          <SectionHead
            title="Events"
            sub="Where we brought the robot, and where we helped run someone else's event."
          />
          <div className="grid grid--3">
            {events.map((item) => (
              <ProgramTile
                key={item.title}
                item={item}
                id={item.title === "Volunteering" ? "volunteering" : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Map */}
      <section className="section">
        <div className="wrap">
          <SectionHead
            title="Where we've been"
            sub="Every place our outreach copy names, from Durham to Greensboro."
          />
          <div data-reveal>
            <NcMap />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Numbers */}
      <section className="section section--surface">
        <div className="wrap">
          <SectionHead title="By the numbers" />
          <div data-reveal data-odometer>
            <Stats items={impactStats} strip />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Sustainability */}
      <section id="sustainability" className="section section--surface">
        <div className="wrap--media split">
          <SectionHead
            align="left"
            eyebrow="Sustainability"
            title="Built to outlast"
            sub="Half the team graduates every year. This is how what we know stays on the team."
          />
          <div className="grid" data-reveal>
            {[docs, ri5w].map(
              (item) =>
                item && (
                  <article className="tile" key={item.title}>
                    <h3 style={{ fontSize: 24 }}>
                      {item.title === "Robot in 5 Weeks"
                        ? "Mentoring: Robot in 5 Weeks"
                        : "Documentation and training"}
                    </h3>
                    <p className="body" style={{ marginTop: 10 }}>
                      {item.body}
                    </p>
                  </article>
                )
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

function ProgramTile({
  item,
  id
}: {
  item: (typeof outreachPrograms)[number]
  id?: string
}) {
  const photo = PHOTO[item.title]
  return (
    <article className="tile tile--media" id={id} data-reveal>
      {item.image && (
        <Crossfade
          className="media media--16x9"
          sizes="(max-width: 734px) 100vw, 400px"
          photos={[
            {
              src: item.image,
              alt: photo?.alt ?? item.title,
              position: photo?.position
            },
            ...(EXTRA[item.title] ?? [])
          ]}
        />
      )}
      <div className="tile-copy">
        <h3>{item.title}</h3>
        <p className="tile-sub">{item.subtitle}</p>
        <p className="body">{item.body}</p>
      </div>
    </article>
  )
}
