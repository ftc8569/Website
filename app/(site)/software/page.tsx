import type { Metadata } from "next"
import Image from "next/image"

import MathEquation from "@/components/site/math-equation"
import PageHeader from "@/components/site/page-header"
import {
  aiPractice,
  codePractice,
  controlWork,
  programmingCards
} from "@/components/home/content"

export const metadata: Metadata = {
  title: "Software",
  description:
    "Kotlin, command-based, simulated first: localization, vision, simulation and optimal control."
}

export default function SoftwarePage() {
  return (
    <main>
      <PageHeader
        image="/activity/programming.jpg"
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
              For the post-States Worlds robot, we modeled its motion and
              mechanisms, then used those models to shape planning and feedback
              control. The simplified objective below shows how a time-optimal
              trajectory can be written; it is an illustration, not a claim
              about the exact solver used on the robot.
            </p>
            <MathEquation
              label="Simplified time-optimal trajectory objective"
              formula={String.raw`\begin{aligned}
                \min_{N,\,u_0,\ldots,u_{N-1}}\quad & N\Delta t \\
                \text{subject to}\quad
                & N\in\mathbb{Z}_{>0},\\
                & x_{k+1}=f(x_k,u_k), \quad k=0,\ldots,N-1,\\
                & x_0=x_{\mathrm{start}}, \quad x_N\in\mathcal{X}_{\mathrm{goal}},\\
                & x_k\in\mathcal{X}, \quad u_k\in\mathcal{U}
              \end{aligned}`}
              description="N is the positive number of control steps and Δt is the timestep duration in seconds. At each step, x is the robot state, u is a motor command, and f is the motion model. X and U represent the modeled state and command limits; the goal set contains acceptable final poses and speeds."
            />
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
      </section>
    </main>
  )
}
