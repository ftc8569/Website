import type { Metadata } from "next"
import Image from "next/image"

import PageHeader from "@/components/site/page-header"
import { ArrowIcon } from "@/components/site/shell"
import {
  aiPractice,
  codePractice,
  controlWork,
  programmingCards,
  resourceLinks
} from "@/components/home/content"

export const metadata: Metadata = {
  title: "Software — RoboKnights 8569",
  description:
    "Kotlin, command-based, simulated first: localization, vision, simulation and optimal control."
}

export default function SoftwarePage() {
  return (
    <main>
      <PageHeader
        eyebrow="Software"
        title={
          <>
            Kotlin, command-based,
            <br />
            and simulated first.
          </>
        }
        lede="We started in Java with a tick-based architecture and outgrew it. The rewrite into a command-based Kotlin codebase gave us modularity, parallel development, and autonomous interoperability — all of it version-controlled on a team GitHub with reviewed pull requests."
      />

      {/* ------------------------------------------------------ Software */}
      <section id="software" className="software-section">
        <div className="software-grid">
          {programmingCards.map((card) => (
            <article className="software-card" key={card.title} data-reveal>
              <div className="software-figure">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="software-tag">{card.tag}</p>
              <h3>{card.title}</h3>
              <p className="software-blurb">{card.blurb}</p>
            </article>
          ))}
        </div>

        <div className="control-block" data-reveal>
          <div className="control-intro">
            <h3>Optimal control</h3>
            <p>
              For Worlds we rebuilt the control stack around explicit
              mathematical models — identify the dynamics, simplify what can be
              linearised, write a cost function, then optimise it.
            </p>
          </div>
          <div className="control-grid">
            {controlWork.map((item) => (
              <article className="control-card" key={item.name}>
                <div className="control-figure">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <p className="control-result">{item.result}</p>
                <h4>{item.name}</h4>
                <p className="control-detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="practice-pair" data-reveal>
          <div className="ai-note">
            <p className="section-index">How we write code</p>
            <p className="ai-note-body">{codePractice}</p>
          </div>
          <div className="ai-note">
            <p className="section-index">How we use AI</p>
            <p className="ai-note-body">{aiPractice}</p>
          </div>
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
