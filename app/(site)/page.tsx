import Image from "next/image"
import Link from "next/link"

import HeroExplode from "@/components/home/hero-explode"
import PinnedGallery, {
  type GalleryPhoto
} from "@/components/home/pinned-gallery"
import { impactStats, resourceLinks, sponsors } from "@/components/home/content"
import Crossfade, { type FadePhoto } from "@/components/site/crossfade"
import Marquee from "@/components/site/marquee"
import Tape from "@/components/site/tape"
import { MoreLink, PageTitle, SectionHead, Stats } from "@/components/site/ui"

const heroStats = [
  { value: "106", label: "Top score at our Oct scrimmage" },
  { value: "18", label: "Students" },
  { value: "16", label: "CNC-machined parts on our last robot" }
]

const subteams: {
  title: string
  body: string
  href: string
  link: string
  photos: FadePhoto[]
}[] = [
  {
    title: "Robot",
    body: "We design every part in CAD, then cut it ourselves on the FabLab waterjet, CNC and laser.",
    href: "/robot",
    link: "How it's built",
    photos: [
      {
        src: "/activity/mechanical.jpg",
        alt: "Students around a table assembling a robot mechanism"
      },
      {
        src: "/gallery/robot-closeup.jpg",
        alt: "Close-up of our robot's orange shooter hood and intake"
      },
      {
        src: "/gallery/robot-field-3.jpg",
        alt: "The intake fingers holding a purple artifact"
      }
    ]
  },
  {
    title: "Software",
    body: "Kotlin, command-based, and tested in simulation before it touches the robot.",
    href: "/software",
    link: "Read the code notes",
    photos: [
      {
        src: "/activity/programming-card.jpg",
        alt: "Programmers working on laptops in the lab"
      },
      {
        src: "/figures/simulation-usd.jpg",
        alt: "Our robot simulation running on a model of the field"
      },
      {
        src: "/figures/pedropathing.jpg",
        alt: "An autonomous path plotted in the Pedro Pathing visualizer"
      }
    ]
  },
  {
    title: "Outreach",
    body: "We started an FLL team in Greensboro and mentor teams across North Carolina.",
    href: "/outreach",
    link: "What we've done",
    photos: [
      {
        src: "/outreach/triad-technos.jpg",
        alt: "The Triad Technos FLL team beside their HydraTech project board",
        position: "center 35%"
      },
      {
        src: "/season/kickoff-mech-presenters-close.webp",
        alt: "Two team members presenting our Mechanical Optimization talk to other FTC teams",
        position: "center 30%"
      },
      {
        src: "/outreach/club-fair.jpg",
        alt: "Team members talking with students at the NCSSM club fair"
      }
    ]
  }
]

const gallery: GalleryPhoto[] = [
  {
    src: "/activity/robot-header.jpg",
    alt: "Our robot on the field beside other teams' robots at a competition"
  },
  {
    src: "/season/ri5w-huddle.jpg",
    alt: "Team members checking a robot number card at the October scrimmage",
    position: "center 35%"
  },
  {
    src: "/gallery/robot-field-1.jpg",
    alt: "A green artifact at the pink intake rollers"
  },
  {
    src: "/season/kickoff-mech-results.webp",
    alt: "Presenting sideplate stress results at the kickoff Mechanical Optimization talk"
  },
  {
    src: "/gallery/competition-pit.jpg",
    alt: "Mentoring Trial N' Error, FTC 16328, in the pits"
  },
  {
    src: "/season/ri5w-high-score.jpg",
    alt: "The field scoreboard after our 106 to 39 win",
    position: "center 40%"
  },
  {
    src: "/gallery/field-demo.jpg",
    alt: "Demonstrating the robot to students at the practice field"
  },
  {
    src: "/season/kickoff-digital-alliance.jpg",
    alt: "Presenting the Digital Alliance talk at the NCFTC kickoff",
    position: "center 35%"
  },
  {
    src: "/gallery/robot-field-3.jpg",
    alt: "The intake fingers holding a purple artifact"
  },
  {
    src: "/outreach/club-fair.jpg",
    alt: "Team members talking with students at the NCSSM club fair"
  },
  {
    src: "/season/kickoff-questions.webp",
    alt: "A team member taking questions in front of our closing slide at the NCFTC kickoff",
    position: "center 30%"
  },
  {
    src: "/activity/outreach-header.jpg",
    alt: "The team in front of the lit ROBOTS wall with the robot on the carpet",
    position: "center 45%"
  }
]

const latestStack = [
  {
    src: "/season/ri5w-robot-red.jpg",
    alt: "Our robot with its red number plate on the field at the October scrimmage",
    position: "50% 60%"
  },
  {
    src: "/season/ri5w-match.jpg",
    alt: "Drive teams behind the glass during a match, our robot at lower right",
    position: "70% 80%"
  },
  {
    src: "/season/ri5w-high-score.jpg",
    alt: "The scoreboard showing our alliance's 106 to 39 win",
    position: "50% 40%"
  }
]

export default function HomePage() {
  return (
    <main>
      {/* ---------------------------------------------------------- Hero */}
      <section className="hero-home">
        <div className="wrap">
          <p className="eyebrow">FTC Team 8569 · NCSSM, Durham NC</p>
          <PageTitle>RoboKnights</PageTitle>
          <p className="subhead">
            Eighteen students at NCSSM designing, machining and coding a
            competition robot from scratch.
          </p>
          <div className="actions">
            <Link className="btn" href="/robot">
              See the robot
            </Link>
            <MoreLink href="/season">Follow the season</MoreLink>
          </div>
        </div>
        <div className="wrap--media">
          <HeroExplode>
            <div className="hero-stats tex-alu">
              <Stats items={heroStats} strip />
            </div>
          </HeroExplode>
        </div>
      </section>

      <div className="perf-band" aria-hidden="true" />

      {/* -------------------------------------------------------- Latest */}
      <section className="section">
        <div className="wrap--media">
          <article className="tile tile--split latest" data-reveal>
            <Tape
              color="white"
              style={{ top: -12, left: 56, ["--tape-r" as string]: "-5deg" }}
            />
            <div className="tile-copy">
              <p className="eyebrow">Latest</p>
              <h2>This season: BioBuzz</h2>
              <p className="body">
                Our new robot played its first matches at the October scrimmage
                and posted the top score of the day.
              </p>
              <MoreLink href="/season">See every event</MoreLink>
            </div>
            <div className="stack">
              {latestStack.map((photo) => (
                <div className="media stack-card" key={photo.src}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 834px) 70vw, 360px"
                    style={{ objectPosition: photo.position }}
                  />
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* --------------------------------------------------- What we do */}
      <section className="section section--surface">
        <div className="wrap--media">
          <SectionHead
            title="What we do"
            sub="Three subteams, one robot. Here's where each one spends its hours."
          />
          <div className="grid grid--3">
            {subteams.map((team) => (
              <article
                className="tile tile--media"
                key={team.title}
                data-reveal
              >
                <Crossfade
                  photos={team.photos}
                  sizes="(max-width: 734px) 100vw, 400px"
                />
                <div className="tile-copy">
                  <h3>{team.title}</h3>
                  <p className="body">{team.body}</p>
                  <MoreLink href={team.href}>{team.link}</MoreLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Photos */}
      <section className="section section--gallery">
        <div className="wrap--media">
          <SectionHead
            title="From the lab and the field"
            sub="Twelve photos from this season and last."
          />
        </div>
        <PinnedGallery photos={gallery} />
      </section>

      {/* ------------------------------------------------------ Outreach */}
      <section className="section section--surface section--photo-bg">
        <div className="section-bg" aria-hidden="true">
          <Image
            src="/team-hero.jpg"
            alt=""
            fill
            sizes="100vw"
            style={{ objectPosition: "50% 30%" }}
          />
        </div>
        <div className="wrap">
          <SectionHead
            title="Outreach, by the numbers"
            sub="Counts we can back up, with the date we took them."
          />
          <div data-odometer>
            <Stats items={impactStats} strip />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Sponsors */}
      <section className="section section--tight sponsors-band">
        <div className="wrap--media">
          <p className="eyebrow" style={{ textAlign: "center" }}>
            Backed by
          </p>
          <Marquee logos={sponsors} />
        </div>
      </section>

      {/* -------------------------------------------------------- Follow */}
      <section className="section">
        <div className="wrap--media">
          <SectionHead title="Follow along" />
          <div className="grid grid--3">
            {resourceLinks.map((link) => (
              <a
                className="tile"
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <SocialIcon name={link.label} />
                <h3 style={{ marginTop: 20 }}>{link.label}</h3>
                <p className="body" style={{ marginTop: 10 }}>
                  {link.detail}
                </p>
                <span className="more">Open {link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="perf-band" aria-hidden="true" />

      {/* ------------------------------------------------------- Contact */}
      <section className="section section--surface">
        <div className="wrap" style={{ textAlign: "center" }} data-reveal>
          <h2 className="headline">Want to sponsor, mentor or visit?</h2>
          <p className="subhead">We reply within a few days.</p>
          <div className="actions">
            <Link className="btn" href="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    GitHub:
      "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z",
    Instagram:
      "M12 2.2c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 4.66a5.14 5.14 0 1 0 0 10.28 5.14 5.14 0 0 0 0-10.28Zm0 8.48a3.34 3.34 0 1 1 0-6.68 3.34 3.34 0 0 1 0 6.68Zm5.34-9.89a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
    LinkedIn:
      "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="32"
      height="32"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={paths[name] ?? ""} />
    </svg>
  )
}
