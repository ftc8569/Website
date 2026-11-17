/*
 * Structured site content.
 *
 * Sourcing rules (important — do not loosen these):
 *  - Everything here comes from the RoboKnights (#8569) States portfolio,
 *    which is entirely our own work.
 *  - POST-STATES robot and controls work is included and presented as ours.
 *    We co-developed the Worlds bot with our sister team SigmaCorns (#22377),
 *    so that engineering belongs to both teams equally.
 *  - Still off limits: SigmaCorns outreach, branding, people, mentors,
 *    sponsors, funding, and any PRE-States hardware (their scrimmage /
 *    qualifier / States-era subsystems, which we did not build).
 */

export type Stat = { value: string; label: string }

/*
 * Only numbers with a stated source and timeframe are published. The
 * Instagram figures are the team's count as of October 2026; the recruit
 * count is the 2026–27 intake. Face-to-face connections (2.5K+), teams
 * reached (13), teams mentored (4) and training hours (50+) were removed
 * until someone can point to where they came from.
 */
export const impactStats: Stat[] = [
  { value: "60K+", label: "Social media views, as of Oct 2026" },
  { value: "2.3K+", label: "Instagram followers, as of Oct 2026" },
  { value: "10", label: "New members in the 2026–27 season" }
]

/* ------------------------------------------------------------------ */
/* The machine                                                         */
/* ------------------------------------------------------------------ */

export const robotName = "Elite Ball Knowledge"

export const robotSpecs: Stat[] = [
  { value: "8", label: "Motors" },
  { value: "6", label: "Servos" },
  { value: "435", label: "RPM mecanum drive" },
  { value: "100+", label: "3D printed parts" },
  { value: "16", label: "CNC parts" },
  { value: "1.7s", label: "Shooter cycle" }
]

export const subsystems = [
  {
    name: "Shooter",
    detail:
      "Adjustable hood and weighted flywheel on a belt-driven turret that aims itself.",
    image: "/cad/shooter-hood.webp"
  },
  {
    name: "Spice Rack",
    detail:
      "Sorts artifacts by colour using a Geneva mechanism with a powered stick transfer.",
    image: "/cad/spicerack-v2.webp"
  },
  {
    name: "Intake",
    detail:
      "Two-layer compliant roller intake feeding a steep ramp straight into the rack.",
    image: "/cad/intake-v3.webp"
  },
  {
    name: "Drivetrain",
    detail:
      "Mecanum belt drive with dual odometry pods and a PTO that lifts the robot.",
    image: "/cad/chassis-side.webp"
  }
]

/* ------------------------------------------------------------------ */
/* Mechanical — visual iteration                                       */
/* ------------------------------------------------------------------ */

export type Iteration = {
  version: string
  title: string
  note: string
  image: string
}

export type IterationTrack = {
  id: string
  subsystem: string
  problem: string
  versions: Iteration[]
}

export const iterationTracks: IterationTrack[] = [
  {
    id: "intake",
    subsystem: "Intake",
    problem:
      "Getting an artifact off the floor and into a sorting slot without stalling or squashing it.",
    versions: [
      {
        version: "V1",
        title: "Active intake",
        note: "Faster than a four-bar claw, but bootleg wheels caught on the artifact notches and the ramp slope pressed balls flat.",
        image: "/cad/intake-v2.webp"
      },
      {
        version: "V2",
        title: "Compliant rollers",
        note: "Silicone rollers and a chain-driven compliant bar. A steeper ramp with guides aims the artifact at the slot.",
        image: "/cad/intake-v1.webp"
      },
      {
        version: "V3",
        title: "Two-layer compliant",
        note: "A second powered row with surgical tubing closes the gap above the rollers, so artifacts stop slipping and breaking colour detection.",
        image: "/cad/intake-v3.webp"
      }
    ]
  },
  {
    id: "spicerack",
    subsystem: "Spice Rack",
    problem:
      "The sorter has to stop dead every time the transfer fires — and a gear-driven spindexer never stopped in the same place twice.",
    versions: [
      {
        version: "V1",
        title: "Simple spindexer",
        note: "Minimal artifact support. Hard to start and stop cleanly; ended up a centimetre or two out of position and bounced balls back.",
        image: "/cad/spicerack-v1.webp"
      },
      {
        version: "V2",
        title: "Geneva mechanism",
        note: "A Geneva gear lets the motor run continuously while indexing to six fixed stops — under a millimetre of error, tuned to the intake and shooter.",
        image: "/cad/geneva.webp"
      }
    ]
  },
  {
    id: "transfer",
    subsystem: "Transfer",
    problem:
      "Moving a sorted artifact into the shooter fast enough to keep up with the Geneva.",
    versions: [
      {
        version: "V1",
        title: "Stick transfer",
        note: "Carried over from our Robot in 5 Weeks bot. Pushed the ball up mechanically, but reset too slowly to use the Geneva's full speed.",
        image: "/cad/transfer-stick.webp"
      },
      {
        version: "V2",
        title: "Servo wheel",
        note: "An Axon servo driving omni wheels. Right idea, not enough power — balls stalled in the dead space and stopped the rack.",
        image: "/cad/transfer-rollers.webp"
      },
      {
        version: "V3",
        title: "6000 RPM roller",
        note: "Motor swap plus a third roller to cover the dead space. Sorted balls now shoot in tandem — 2–5 second cycles including sorting.",
        image: "/cad/transfer-motor.webp"
      }
    ]
  }
]

/* Weighted design analysis — States portfolio, materials trade study. */
export const materialScores = [
  {
    material: "3D prints",
    score: 56.5,
    note: "Fast, cheap, light, repairable"
  },
  {
    material: "goBILDA",
    score: 46.5,
    note: "Strong and precise, always in stock"
  },
  {
    material: "Waterjet",
    score: 32.5,
    note: "Reserved for high-load structure"
  }
]

/* ------------------------------------------------------------------ */
/* Programming + simulation                                            */
/* ------------------------------------------------------------------ */

export const programmingCards = [
  {
    title: "Simulation",
    blurb:
      "We fully abstracted the robot's I/O so the same codebase runs on hardware and in simulation. It executes as a unit test — no Android dependencies — and renders in real time through a USD viewport on Storm and Metal, with CAD imported straight from STEP files. You can drive the simulated robot with a normal game controller.",
    image: "/figures/simulation-usd.jpg",
    tag: "Drive the robot when there is no robot"
  },
  {
    title: "Visual simulation",
    blurb:
      "A second, browser-based simulator built on the Jolt physics engine and Three.js. It runs in real time on any browser with accurate physics, which lets us verify autonomous paths and give drivers practice time when the robot is in pieces on the bench.",
    image: "/figures/sim-jolt.jpg",
    tag: "Jolt + Three.js, runs in any browser"
  },
  {
    title: "Physics model",
    blurb:
      "A useful simulator needs a model of the robot. Ours combines motor dynamics, mecanum kinematics, and projectile motion to approximate how the physical robot responds to control input and explore its limits before testing on hardware.",
    image: "/figures/mpc-optimizer.jpg",
    tag: "Motor dynamics, kinematics, projectile motion"
  },
  {
    title: "Driver automation",
    blurb:
      "A finite state machine drives the multi-step sequences — intaking, indexing, shooting. Kotlin's async functions let us schedule hardware tasks concurrently and wait for them to finish before transitioning, so a driver triggers an entire cycle with one button instead of coordinating four inputs under pressure.",
    image: "/figures/state-machine.jpg",
    tag: "One button, the whole cycle"
  },
  {
    title: "Optimal pathing",
    blurb:
      "We pose trajectories between waypoints as an optimisation problem with modeled motor constraints, with shorter traversal time as a goal. Inspired by FRC's Choreo, we built a web interface for creating and editing those paths, so tuning an auto does not mean editing numbers in source.",
    image: "/figures/optimal-pathing.jpg",
    tag: "We built the path editor too"
  },
  {
    title: "Localization",
    blurb:
      "PedroPathing handles autonomous trajectories. In TeleOp we fuse Pinpoint odometry with Limelight vision through a Kalman filter that weights each sensor by confidence, rejecting noisy vision while still taking global pose corrections.",
    image: "/figures/kalman.jpg",
    tag: "Odometry + vision, continuously corrected"
  },
  {
    title: "Vision + ML",
    blurb:
      "The Limelight reads AprilTags for localization and the motif pattern, and runs our own artifact classifier on its coprocessor. We label datasets with Meta's Segment Anything Model and train the lightweight competition model on Duke University's H200 GPU cluster.",
    image: "/figures/sam-tracking.jpg",
    tag: "SAM-labelled data, trained on Duke's H200s"
  },
  {
    title: "Camera-driven tuning",
    blurb:
      "A global shutter camera indexes the ramp and locates artifacts on the field. Paired with an OAK stereo camera, it also maps shooter RPM and hood angle to real shot trajectories automatically — so the shooter calibrates itself from observed arcs instead of guesswork.",
    image: "/figures/shooter-tuning.jpg",
    tag: "The shooter calibrates itself"
  },
  {
    title: "Unit-tested control",
    blurb:
      "Every optimised control loop is measured, not assumed. We compare current against previous and expected performance on each change, which is what makes it safe to keep rewriting the control stack mid-season.",
    image: "/figures/unit-testing.jpg",
    tag: "Measured, not assumed"
  }
]

/* Post-States control work on the Worlds bot, co-developed with #22377. */
export const controlWork = [
  {
    name: "Model Predictive Control",
    result: "Model-based trajectory planning",
    detail:
      "Uses a robot model to evaluate future motion and choose control inputs within modeled drivetrain limits. The trajectory objective favors shorter traversal time; the result depends on model accuracy and the chosen constraints.",
    image: "/figures/mpc-horizon.jpg"
  },
  {
    name: "Factor-graph localization",
    result: "Corrects accumulated odometry drift",
    detail:
      "A GTSAM factor graph combines odometry with Limelight AprilTag observations to update the robot's pose. Reliable tag observations can correct error accumulated by odometry.",
    image: "/figures/gtsam.jpg"
  },
  {
    name: "LTV path following",
    result: "Feedback along a reference path",
    detail:
      "We linearize the motion model around a reference path and use a Linear Time-Varying controller to update drive commands as the robot moves. Performance depends on how closely the model and reference match the robot's motion.",
    image: "/figures/ltv.jpg"
  },
  {
    name: "Global Lipschitz \u2014 Virtual Sort",
    result: "Chooses shot settings to separate landing points",
    detail:
      "With no mechanical sorter on the Worlds bot, the turret separates consecutive shots in flight. Given a Lipschitz bound on how launch settings change predicted landing position, the Shubert\u2013Piyavskii method searches for settings that maximize the gap between landing points.",
    image: "/figures/lipschitz.jpg"
  },
  {
    name: "LQR flywheel control",
    result: "Balances speed error and control effort",
    detail:
      "A Linear-Quadratic Regulator balances flywheel speed error against voltage effort in its cost. Its settling time and overshoot depend on the model, tuned weights, and motor voltage limits, so they need to be measured on the robot.",
    image: "/figures/lqr.jpg"
  }
]

export const codePractice =
  "Git for version control with conventional commits, so the history reads cleanly. Every pull request needs at least two human reviewers before it merges. We use agentic AI to accelerate development, but we architect the key systems and write the hard parts ourselves."

export const aiPractice =
  "We use AI for repetitive code that needs little critical thinking. Every AI-written line is reviewed by the programmer who prompted it, then again in a PR review — two cycles of human review. Advanced systems have their architecture planned before AI touches them."

/* ------------------------------------------------------------------ */
/* The Worlds bot — post-States                                        */
/* ------------------------------------------------------------------ */

export const worldsIntro =
  "After the State Championship we stopped iterating and started over. We built the Worlds robot with our sister team SigmaCorns #22377, and it trades the spindexer and the lift for a single straight-shoot path. Cycle time dropped from 8 seconds to 2.5."

export const worldsHeadline: Stat[] = [
  { value: "2.5s", label: "Cycle time, down from 8s" },
  { value: "2×", label: "Scoring rate vs. States" },
  { value: "3", label: "Artifacts held" },
  { value: "360°", label: "Shoot-on-the-move turret" }
]

export const worldsSystems = [
  {
    name: "Merged storage + transfer",
    detail:
      "We retired the spindexer entirely and rebuilt storage and transfer as one belted path. Four inner rollers hold a constant 8 mm of compression, four layers of gecko wheels hand off to the shooter, and the whole assembly runs on two 1150 RPM motors over GT2 belts — so the artifact path is identical every single cycle.",
    image: "/worlds/transfer-path.webp"
  },
  {
    name: "Flywheel shooter",
    detail:
      "Two 6000 RPM motors driving two steel flywheels, with a dynamically integrated hood through 36° of travel and 10 mm of compression. Steel over aluminium bought us RPM stability and sub-second recovery between shots.",
    image: "/worlds/turret-shooter.webp"
  },
  {
    name: "Bearing stack turret",
    detail:
      "A bearing stack on the top plate lets the turret spin without friction from anything below it. We swapped the 435 RPM motor for two Axon servos and freed a motor for the rest of the robot.",
    image: "/worlds/bearing-turret.webp"
  },
  {
    name: "Vectoring intake",
    detail:
      "Curved guides jammed on multi-artifact pickups. V3 uses right-biased vectoring wheels and a shallower compliant ramp, with dead wheels at each end that let artifacts go while the intake keeps running.",
    image: "/worlds/intake-v3.webp"
  },
  {
    name: "FEA-optimised chassis",
    detail:
      "Finite element analysis on the drivetrain plates showed us where material was doing nothing, so we pocketed it out. The chassis is 15.2″ × 14.5″, with the battery and four motors low in the base.",
    image: "/worlds/fea.webp"
  },
  {
    name: "Ranking-point strategy",
    detail:
      "We scored each ranking point against its mechanical cost and committed to the goal RP. That let us cut the lift and the brake from the robot.",
    image: "/worlds/bot-full.webp"
  }
]

/* ------------------------------------------------------------------ */
/* Outreach — RoboKnights' own programs only                           */
/* ------------------------------------------------------------------ */

/* `image` is optional: the portfolio has no photo of every event. */
export type OutreachProgram = {
  title: string
  subtitle: string
  body: string
  image?: string
}

export const outreachPrograms: OutreachProgram[] = [
  {
    title: "Triad Technos",
    subtitle: "FLL 71079 · Greensboro, NC",
    body: "We started this FLL team from nothing. We found a coach, interviewed members, ran parent info nights and ordered the sets, then mentored them from basic Spike code to competition-ready programs. They competed at the Cannon High School qualifier.",
    image: "/outreach/triad-technos.jpg"
  },
  {
    title: "Kids Knight Out",
    subtitle: "Museum of Life & Science",
    body: "We show the robot to classes of twenty young students and let them drive it in games. The questions kept coming, so we now host monthly sessions.",
    image: "/outreach/library-kids.jpg"
  },
  {
    title: "GlobalKnights",
    subtitle: "Brazil · Romania",
    body: "We messaged ParaTech (#9302) in Brazil and BraveBots (#19141) and Brute Force (#22491) in Romania on Instagram. After the five-week scrimmage we started design reviews and programming exchanges with them.",
    image: "/outreach/globalknights.jpg"
  },
  {
    title: "Open House",
    subtitle: "with the ZebraCorns, FRC 900",
    body: "On FRC Kickoff day we co-hosted an open house for students and families. Visitors drove our robot, and we presented on how to get into FTC.",
    image: "/outreach/museum-demo.jpg"
  },
  {
    title: "Durham Main Library",
    subtitle: "Family STEM event",
    body: "We showed the robot and our season to local families and pointed students to FIRST sign-ups. A lot of parents asked about a one-to-two week technical skills summer camp.",
    image: "/outreach/event-members.jpg"
  },
  {
    title: "Volunteering",
    subtitle: "Bull City FLL · Raleigh Qualifier",
    body: "We judged at the Bull City FLL Scrimmage. At the 3rd Southeast Raleigh qualifier we ran the pits, queued teams for judging and reset the field.",
    image: "/outreach/volunteers.jpg"
  }
]

/*
 * Sustainability — from the States portfolio's Sustainability page. NCSSM is
 * a two-year school, so half the team turns over every year.
 */
export const sustainability = [
  {
    title: "Recruitment",
    body: "We run a booth at the NCSSM club fair with live robot demos and interview every applicant. Any experience level is welcome, and this season brought in ten new members."
  },
  {
    title: "Robot in 5 Weeks",
    body: "At the Robot in 5 Weeks scrimmage our seniors step back and new members build a robot end to end. Our last Ri5W bot placed 5th in qualification matches, and its stick transfer became V1 of our States robot."
  },
  {
    title: "Knowledge continuity",
    body: "Our documentation carries what we know through each year's turnover. New members earn NCSSM Fabrication Lab certification and own real design decisions in their first season."
  },
  {
    title: "Sustainable funding",
    body: "NCSSM, our mentors and foundation grants, including one from the Gene Haas Foundation, fund the program."
  }
]

/* Instagram count as of October 2026. */
export const socialStats: Stat[] = [
  { value: "2.3K+", label: "Instagram followers" },
  { value: "60K+", label: "Social media impacts" },
  { value: "6", label: "Years posting" }
]

/* ------------------------------------------------------------------ */
/* Partners — condensed                                                */
/* ------------------------------------------------------------------ */

/*
 * Organisation homepages. Shelby Dental Care Center and WarmHub have no link
 * because we couldn't confirm the right address. TODO: add them.
 */
export type Org = { name: string; src: string; href?: string }

export const sponsors: Org[] = [
  {
    name: "Gene Haas Foundation",
    src: "/logos/genehaas.png",
    href: "https://ghaasfoundation.org"
  },
  {
    name: "NCSSM Foundation",
    src: "/logos/ncssm-foundation.png",
    href: "https://www.ncssm.edu"
  },
  { name: "monday.com", src: "/logos/monday.png", href: "https://monday.com" },
  {
    name: "goBILDA",
    src: "/logos/gobilda.png",
    href: "https://www.gobilda.com"
  },
  { name: "Rubrik", src: "/logos/rubrik.png", href: "https://www.rubrik.com" },
  { name: "Shelby Dental Care Center", src: "/logos/shelbydental.png" }
]

export const collaborators: Org[] = [
  { name: "Google", src: "/logos/google.png", href: "https://www.google.com" },
  { name: "Intel", src: "/logos/intel.png", href: "https://www.intel.com" },
  { name: "IBM", src: "/logos/ibm.png", href: "https://www.ibm.com" },
  { name: "MIT", src: "/logos/mit.png", href: "https://www.mit.edu" },
  { name: "Duke University", src: "/logos/duke.png", href: "https://duke.edu" },
  {
    name: "UNC Chapel Hill",
    src: "/logos/unc.png",
    href: "https://www.unc.edu"
  },
  { name: "NC State", src: "/logos/ncstate.png", href: "https://www.ncsu.edu" },
  { name: "WarmHub", src: "/logos/warmhub.png" }
]

/*
 * Mentors, kept deliberately small — names and affiliations only. Lead
 * mentors are featured on their own row above the rest. `src` is optional:
 * without a photo the card falls back to initials.
 */
export type Mentor = { name: string; org?: string; src?: string }

export const leadMentors: Mentor[] = [
  {
    name: "Robyn Stephens",
    org: "Powered Research",
    src: "/team/mentors/robyn.jpg"
  },
  { name: "Carl Ryden", org: "WarmHub", src: "/team/mentors/carl.jpg" },
  { name: "Ashley Ryden" }
]

export const mentors: Mentor[] = [
  { name: "Eric Liu", org: "WarmHub", src: "/team/mentors/eric.jpg" },
  { name: "Angela Ireland", org: "Rubrik", src: "/team/mentors/angela.jpg" },
  { name: "Shikha Srivastava", org: "IBM", src: "/team/mentors/shikha.jpg" },
  { name: "Ben Caunt", org: "WarmHub", src: "/team/mentors/benc.jpg" },
  {
    name: "Garrett Love",
    org: "Dean of Engineering",
    src: "/team/mentors/garrett.jpg"
  },
  { name: "Beren", org: "Intel", src: "/team/mentors/beren.jpg" },
  { name: "Captain Snow", org: "FabLab Lead", src: "/team/mentors/snow.jpg" },
  { name: "Eliot", org: "Valence Robotics", src: "/team/mentors/eliot.jpg" },
  { name: "Joseph", org: "FIRST Alumni", src: "/team/mentors/joseph.jpg" }
]

/* ------------------------------------------------------------------ */
/* Photo marquee                                                       */
/* ------------------------------------------------------------------ */

export const galleryImages = [
  { src: "/gallery/bot-full.jpg", alt: "The Worlds robot, fully assembled" },
  {
    src: "/gallery/robot-on-field.jpg",
    alt: "Elite Ball Knowledge on the competition field"
  },
  {
    src: "/gallery/field-demo.jpg",
    alt: "Demonstrating the robot to students in Hunt Lobby"
  },
  { src: "/gallery/robot-field-1.jpg", alt: "Intake loading an artifact" },
  {
    src: "/gallery/whiteboard.jpg",
    alt: "Working through a design on the whiteboard"
  },
  {
    src: "/gallery/competition-pit.jpg",
    alt: "Mentoring Trial N' Error, FTC 16328"
  },
  {
    src: "/gallery/robot-field-2.jpg",
    alt: "The robot collecting an artifact"
  },
  {
    src: "/gallery/museum-team.jpg",
    alt: "The team at the Museum of Life & Science"
  },
  { src: "/gallery/build-session.jpg", alt: "A build session in the lab" },
  { src: "/gallery/robot-field-3.jpg", alt: "The robot scoring an artifact" },
  {
    src: "/gallery/robot-sign.jpg",
    alt: "The robot under the ROBOTS sign at the museum"
  },
  {
    src: "/gallery/competition-gym.jpg",
    alt: "Mentoring Metallic@, FTC 23303"
  },
  { src: "/gallery/practice-field.jpg", alt: "Practice on our lab field" },
  { src: "/gallery/robot-closeup.jpg", alt: "The 8569 robot up close" }
]

/* ------------------------------------------------------------------ */
/* Outbound links                                                      */
/* ------------------------------------------------------------------ */

export const resourceLinks = [
  {
    label: "GitHub",
    href: "https://github.com/ftc8569",
    detail: "Our robot code, in the open — Kotlin, command-based, PR reviewed."
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/roboknights8569/",
    detail: "Six years of season updates, builds, and competition days."
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/ftc8569",
    detail:
      "One of the first NC teams on LinkedIn. We publish engineering articles there."
  }
]
