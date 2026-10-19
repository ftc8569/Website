import type { Metadata } from "next"
import Image from "next/image"

import PageHeader from "@/components/site/page-header"
import { ArrowIcon } from "@/components/site/shell"
import {
  outreachPrograms,
  resourceLinks,
  socialStats,
  sustainability
} from "@/components/home/content"

export const metadata: Metadata = {
  title: "Outreach",
  description:
    "Founding FLL teams, mentoring FIRST teams worldwide, and teaching STEM across North Carolina."
}

export default function OutreachPage() {
  return (
    <main>
      <PageHeader
        image="/activity/outreach.jpg"
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
      </section>

      {/* ------------------------------------------------ Sustainability */}
      <section id="sustainability" className="sustain-section">
        <header className="systems-header" data-reveal>
          <p className="section-index">Sustainability</p>
          <h2>
            Built to outlast
            <br />
            every roster.
          </h2>
          <p className="section-lede">
            Half the team graduates every year. These are the systems that keep
            what we know from leaving with them.
          </p>
        </header>
        <ol className="sustain-grid" data-reveal>
          {sustainability.map((item, index) => (
            <li className="sustain-item" key={item.title}>
              <span className="sustain-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* -------------------------------------------------------- Social */}
      <section id="social" className="social-section">
        <header className="systems-header" data-reveal>
          <p className="section-index">Follow along</p>
          <h2>Find us online.</h2>
          <p className="section-lede">
            Season updates, outreach events, our code, and the engineering
            write-ups behind it all.
          </p>
        </header>
        <div className="impact-grid social-stats" data-reveal>
          {socialStats.map((stat) => (
            <div className="impact-cell" key={stat.label}>
              <p className="impact-value">{stat.value}</p>
              <p className="impact-label">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="resources" data-reveal>
          {resourceLinks.map((link) => (
            <a
              className="resource"
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="resource-label">
                {link.label}
                <ArrowIcon />
              </span>
              <span className="resource-detail">{link.detail}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
