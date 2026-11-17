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
import { PageHero, SectionHead, Silhouette } from "@/components/site/ui"

/*
 * Organisation homepages. Entries without a URL are ones we couldn't confirm;
 * they render without a link until someone adds the right address.
 * TODO: confirm URLs for Shelby Dental Care Center and WarmHub.
 */
const ORG_URL: Record<string, string> = {
  "Gene Haas Foundation": "https://ghaasfoundation.org",
  "NCSSM Foundation": "https://www.ncssm.edu",
  "monday.com": "https://monday.com",
  goBILDA: "https://www.gobilda.com",
  Rubrik: "https://www.rubrik.com",
  Google: "https://www.google.com",
  Intel: "https://www.intel.com",
  IBM: "https://www.ibm.com",
  MIT: "https://www.mit.edu",
  "Duke University": "https://duke.edu",
  "UNC Chapel Hill": "https://www.unc.edu",
  "NC State": "https://www.ncsu.edu"
}

function Logo({
  name,
  src,
  size
}: {
  name: string
  src: string
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
  const url = ORG_URL[name]
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
      <div className="media media--square">
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

      <section id="support" className="section section--surface">
        <div className="wrap--media">
          <SectionHead
            title="Who backs us"
            sub="Sponsors and grants pay for the program. These are the organisations behind it."
          />
          <div className="grid grid--3 logo-grid" data-reveal>
            {sponsors.map((logo) => (
              <Logo key={logo.name} {...logo} size="large" />
            ))}
          </div>
          <p className="logo-note body">Also supported by the Ryden family.</p>

          <h3 className="sub-title">Companies and schools we work with</h3>
          <div className="logo-row" data-reveal>
            {collaborators.map((logo) => (
              <Logo key={logo.name} {...logo} size="small" />
            ))}
          </div>
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
