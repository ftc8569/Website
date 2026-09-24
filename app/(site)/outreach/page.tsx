import type { Metadata } from "next"
import Image from "next/image"

import PageHeader from "@/components/site/page-header"
import { mentoredTeams, outreachPrograms } from "@/components/home/content"

export const metadata: Metadata = {
  title: "Outreach — RoboKnights 8569",
  description:
    "Founding FLL teams, mentoring FIRST teams worldwide, and teaching STEM across North Carolina."
}

export default function OutreachPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Outreach"
        title={
          <>
            We teach what
            <br />
            we were taught.
          </>
        }
        lede="NCSSM is a two-year school — half our team turns over every year. That makes passing knowledge on a survival skill, and we practise it well beyond our own roster."
      />

      {/* ------------------------------------------------------ Outreach */}
      <section id="outreach" className="outreach-section">
        <div className="outreach-grid">
          {outreachPrograms.map((program) => (
            <article className="outreach-card" key={program.title} data-reveal>
              <div className="outreach-figure">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="outreach-copy">
                <h3>{program.title}</h3>
                <p className="outreach-subtitle">{program.subtitle}</p>
                <p>{program.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mentored" data-reveal>
          <h3>Teams we mentor</h3>
          <ul>
            {mentoredTeams.map((team) => (
              <li key={team.number}>
                <span className="mentored-number">{team.number}</span>
                <span className="mentored-name">{team.name}</span>
                <span className="mentored-note">{team.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
