import type { Metadata } from "next"
import Image from "next/image"

import CodeTile from "@/components/site/code-tile"
import MathEquation from "@/components/site/math-equation"
import StateMachine from "@/components/site/state-machine"
import Tape from "@/components/site/tape"
import {
  aiPractice,
  codePractice,
  controlWork
} from "@/components/home/content"
import { LocalNav, PageHero, SectionHead } from "@/components/site/ui"

export const metadata: Metadata = {
  title: "Software",
  description:
    "Kotlin, command-based, simulated first: simulation, driver automation, path optimisation, localization and control on Team 8569's robots."
}

const GITHUB = "https://github.com/ftc8569"

type Feature = {
  id: string
  label: string
  title: string
  paragraphs: string[]
  details: string[]
  image: string
  alt: string
  /* Plots with light backgrounds sit on a light inset. */
  light?: boolean
}

const features: Feature[] = [
  {
    id: "simulation",
    label: "Simulation",
    title: "The same code runs on the robot and in simulation",
    paragraphs: [
      "We abstracted the robot's inputs and outputs so one codebase runs on hardware and in a simulator. The simulator runs as a unit test with no Android dependencies, and you can drive it with a normal game controller.",
      "It renders in real time in a USD viewport, with CAD imported straight from STEP files. That's how drivers practise when the robot is in pieces on the bench."
    ],
    details: [
      "A second simulator runs in the browser on the Jolt physics engine and Three.js. We use it to check autonomous paths.",
      "Both use a physics model that combines motor dynamics, mecanum kinematics and projectile motion, so we can find the robot's limits before testing on hardware."
    ],
    image: "/figures/simulation-usd.jpg",
    alt: "The simulated robot on the field in our USD viewport"
  },
  {
    id: "automation",
    label: "Driver automation",
    title: "One button runs the whole cycle",
    paragraphs: [
      "A finite state machine runs the multi-step sequences: intake, index, shoot. Kotlin's async functions run hardware tasks at the same time and wait for them to finish before moving on.",
      "The driver presses one button for a full cycle instead of juggling four inputs mid-match."
    ],
    details: [
      "Because each state waits for its hardware tasks to finish before the next one starts, the sequence holds together when a mechanism runs slow."
    ],
    image: "/figures/state-machine.jpg",
    alt: "State machine diagram for the intake, index and shoot cycle"
  },
  {
    id: "pathing",
    label: "Path optimisation",
    title: "We plan the fastest path, and built our own editor",
    paragraphs: [
      "We set up each trajectory between waypoints as an optimisation problem, with modelled motor limits and shortest travel time as the goal.",
      "Inspired by FRC's Choreo, we built a web editor for these paths, so tuning an autonomous doesn't mean editing numbers in source code."
    ],
    details: ["PedroPathing handles the autonomous trajectories on the robot."],
    image: "/figures/optimal-pathing.jpg",
    alt: "Optimised path drawn across the field in our path editor"
  },
  {
    id: "localization",
    label: "Localization",
    title: "Odometry and vision, corrected as the robot moves",
    paragraphs: [
      "In TeleOp a Kalman filter fuses Pinpoint odometry with Limelight vision. It weights each sensor by how much to trust it, so noisy vision readings get rejected but real corrections still land.",
      "On the Worlds robot a factor graph does the same job with AprilTag sightings."
    ],
    details: [
      "The Limelight reads AprilTags for position and the motif pattern, and runs our own artifact classifier on its coprocessor.",
      "We label training data with Meta's Segment Anything Model and train the competition model on Duke University's H200 GPU cluster."
    ],
    image: "/figures/kalman.jpg",
    alt: "Plot of odometry and vision estimates merged by the Kalman filter"
  },
  {
    id: "control",
    label: "Control",
    title: "We model the robot, then control it against the model",
    paragraphs: [
      "For the Worlds robot we modelled its motion and mechanisms, then used those models for planning and feedback control.",
      "Every control loop gets measured on each change against its previous and expected performance. That's what makes it safe to keep rewriting the control code mid-season."
    ],
    details: [
      "A global shutter camera and an OAK stereo camera watch real shots, so the shooter maps flywheel RPM and hood angle to arcs it actually observed."
    ],
    image: "/figures/unit-testing.jpg",
    alt: "Chart comparing measured control performance against the goal over time",
    light: true
  }
]

/* Verbatim excerpt (trimmed) from our 2025–26 robot code. */
const SHOOTER_FILE =
  "https://github.com/ftc8569/2025-Decode/blob/main/TeamCode/src/main/java/org/firstinspires/ftc/teamcode/common/subsystems/Shooter.kt"
const SHOOTER_LINES = [
  "// Shooter RPM = 102.14973x^2 + 81.22682x + 2739.19625 (x is distance from goal in meters)",
  "val actualRPM = hardware.shooterRPM() * Constants.ShooterConstants.gearRatio",
  "",
  "val output = pidController.calculate(actualRPM, if (isRunning) { targetRPM } else if (idleMode) { Constants.ShooterConstants.idleRPM } else { 0.0 }).coerceIn(-1.0, 1.0)",
  "",
  "// less than 3% RPM Error",
  "isUpToSpeed = (actualRPM - targetRPM).absoluteValue / targetRPM > 0.03",
  "",
  "if (!idleMode) {",
  "    // adjust hood based on shooter testing data",
  "    val rpmDifference = actualRPM - targetRPM",
  "    val hoodOffset = rpmDifference * -0.0004",
  "    hardware.hood = (targetHood + hoodOffset).clamp(",
  "        Constants.ShooterConstants.hoodFullUp,",
  "        Constants.ShooterConstants.hoodFullDown",
  "    )",
  "}"
]

const RESEARCH = [
  "Model Predictive Control",
  "Factor-graph localization",
  "LTV path following"
]

export default function SoftwarePage() {
  const research = controlWork.filter((item) => RESEARCH.includes(item.name))

  return (
    <main>
      <PageHero
        image="/activity/programming.jpg"
        imagePosition="center 40%"
        eyebrow="Software"
        title="Kotlin, command-based, simulated first."
        sub="We rewrote our Java code in Kotlin so several of us can work at once, and every change goes through a reviewed pull request."
      >
        <div className="actions">
          <a className="btn" href={GITHUB} target="_blank" rel="noreferrer">
            Our code on GitHub
          </a>
        </div>
      </PageHero>

      <LocalNav
        title="Software"
        links={[
          { href: "#simulation", label: "Simulation" },
          { href: "#automation", label: "Automation" },
          { href: "#pathing", label: "Pathing" },
          { href: "#localization", label: "Localization" },
          { href: "#control", label: "Control" }
        ]}
        action={{ href: GITHUB, label: "GitHub", external: true }}
      />

      <section className="section tex-cad">
        <div className="wrap--media features">
          <Tape
            color="white"
            style={{ top: -14, left: "8%", ["--tape-r" as string]: "-3deg" }}
          />
          {features.map((feature, index) => (
            <article
              className={`feature${index % 2 ? " feature--flip" : ""}`}
              id={feature.id}
              key={feature.id}
              data-reveal
            >
              {feature.id === "automation" ? (
                <StateMachine />
              ) : (
                <div
                  className={`media media--4x3 ${feature.light ? "media--light" : "media--render"}`}
                >
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    sizes="(max-width: 834px) 100vw, 640px"
                  />
                </div>
              )}
              <div className="feature-copy">
                <p className="eyebrow">{feature.label}</p>
                <h2>{feature.title}</h2>
                {feature.paragraphs.map((text) => (
                  <p className="body" key={text}>
                    {text}
                  </p>
                ))}
                <details className="details">
                  <summary>Details</summary>
                  {feature.details.map((text) => (
                    <p className="body" key={text}>
                      {text}
                    </p>
                  ))}
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--surface" id="optimal-control">
        <div className="wrap">
          <SectionHead
            eyebrow="Optimal control"
            title="Writing the fastest path as a problem a solver can answer"
            sub="This is how a time-optimal trajectory can be written. It's an illustration, not the exact solver on the robot."
          />
          <div data-reveal data-terms>
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
              description="N is the number of control steps and Δt is the length of each step in seconds. At each step, x is the robot state, u is the motor command and f is the motion model. X and U are the modelled state and command limits, and the goal set holds the acceptable final poses and speeds."
            />
          </div>
        </div>
        <div className="wrap--media" style={{ marginTop: 72 }}>
          <div className="grid grid--3">
            {research.map((item) => (
              <article className="tile tile--media" key={item.name} data-reveal>
                <div
                  className={`media media--16x9 ${
                    item.image.includes("ltv")
                      ? "media--render"
                      : "media--light"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={`${item.name} plot`}
                    fill
                    sizes="(max-width: 734px) 100vw, 400px"
                  />
                </div>
                <div className="tile-copy">
                  <p className="tile-sub" style={{ marginTop: 0 }}>
                    {item.result}
                  </p>
                  <h3 style={{ marginTop: 6 }}>{item.name}</h3>
                  <p className="body" style={{ marginTop: 10 }}>
                    {item.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tex-cad">
        <div className="wrap">
          <SectionHead
            eyebrow="From the code"
            title="How the shooter picks its speed"
            sub="A trimmed excerpt from Shooter.kt in last season's robot code. Distance to the goal sets the target RPM from a curve we fitted to test shots, and the hood corrects for any RPM error."
          />
          <div data-reveal>
            <CodeTile
              file="Shooter.kt · 2025-Decode"
              href={SHOOTER_FILE}
              lines={SHOOTER_LINES}
            />
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="wrap--media grid grid--2">
          <article className="tile" data-reveal>
            <h3>How we write code</h3>
            <p className="body" style={{ marginTop: 12 }}>
              {codePractice}
            </p>
          </article>
          <article className="tile" data-reveal>
            <h3>How we use AI</h3>
            <p className="body" style={{ marginTop: 12 }}>
              {aiPractice}
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
