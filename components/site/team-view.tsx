import Image from "next/image"
import Link from "next/link"

import Roster, { type TeamData } from "@/components/home/roster"
import {
  collaborators,
  leadMentors,
  mentors,
  sponsors,
  type Mentor
} from "@/components/home/content"
import Marquee from "@/components/site/marquee"
import Tape from "@/components/site/tape"
import { PageHero, SectionHead, Silhouette } from "@/components/site/ui"

function Logo({
  name,
  src,
  href,
  size
}: {
  name: string
  src: string
  href?: string
  size: "large" | "small"
}) {
  const image = (
    <Image
      src={src}
      alt={name}
      width={480}
      height={200}
      sizes={size === "large" ? "240px" : "140px"}
    />
  )
  const url = href
  const className = `tile logo-tile logo-tile--${size}`
  return url ? (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      {image}
    </a>
  ) : (
    <div className={className}>{image}</div>
  )
}

function MentorCard({ mentor, lead }: { mentor: Mentor; lead?: boolean }) {
  return (
    <figure className="person">
      <div className="media media--square" data-sharpen>
        {mentor.src ? (
          <Image
            src={mentor.src}
            alt={mentor.name}
            fill
            sizes="(max-width: 734px) 50vw, 280px"
            style={{ objectPosition: "50% 35%" }}
          />
        ) : (
          <Silhouette />
        )}
      </div>
      <figcaption>
        {lead && <span className="chip chip--accent">Lead mentor</span>}
        <p className="person-name">{mentor.name}</p>
        {mentor.org && <p className="person-role">{mentor.org}</p>}
      </figcaption>
    </figure>
  )
}

export default function TeamView({ team }: { team: TeamData }) {
  return (
    <main>
      <PageHero
        tall
        image="/team-hero.jpg"
        imagePosition="50% 20%"
        eyebrow="Team"
        title="Eighteen students, three subteams."
        sub="Mechanical designs and builds, programming makes it move, outreach takes it into the community."
      />

      <section id="roster" className="section">
        <div className="wrap--media">
          <SectionHead title="Meet the RoboKnights" />
          <Roster team={team} />
        </div>
      </section>

      <div className="band media" data-parallax aria-hidden="true">
        <Image
          src="/team.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectPosition: "50% 30%" }}
        />
      </div>

      <section id="support" className="section section--surface">
        <div className="wrap--media">
          <SectionHead
            title="Who backs us"
            sub="Sponsors and grants pay for the program. These are the organisations behind it."
          />
          <div className="grid grid--3 logo-grid" data-reveal>
            <Tape
              color="white"
              style={{ top: -14, left: 24, ["--tape-r" as string]: "-4deg" }}
            />
            {sponsors.map((logo) => (
              <Logo key={logo.name} {...logo} size="large" />
            ))}
          </div>
          <p className="logo-note body">Also supported by the Ryden family.</p>

          <h3 className="sub-title">Companies and schools we work with</h3>
          <Marquee logos={collaborators} />
        </div>
      </section>

      <section id="mentors" className="section">
        <div className="wrap--media">
          <SectionHead
            title="Mentors"
            sub="Engineers, NCSSM staff and FIRST alumni who work with us through the season."
          />
          <div className="grid grid--4 roster-grid" data-reveal>
            {leadMentors.map((mentor) => (
              <MentorCard key={mentor.name} mentor={mentor} lead />
            ))}
            {mentors.map((mentor) => (
              <MentorCard key={mentor.name} mentor={mentor} />
            ))}
          </div>

          <div
            className="tile"
            style={{ marginTop: 56, textAlign: "center", alignItems: "center" }}
            data-reveal
          >
            <h3>Want to mentor or sponsor us?</h3>
            <p className="body" style={{ marginTop: 10 }}>
              Tell us what you'd like to help with and we'll get back to you.
            </p>
            <div className="actions" style={{ marginTop: 24 }}>
              <Link className="btn" href="/contact">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
