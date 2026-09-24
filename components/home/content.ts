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

export const impactStats: Stat[] = [
  { value: "60K+", label: "Social media impacts" },
  { value: "2.5K+", label: "Face-to-face connections" },
  { value: "13", label: "Teams reached" },
  { value: "4", label: "Teams mentored" },
  { value: "50+", label: "Hours of training" },
  { value: "10", label: "Members recruited" }
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
      "Adjustable hood, weighted flywheel, and a belt-driven turret for auto-aim.",
    image: "/cad/shooter-hood.jpg"
  },
  {
    name: "Spice Rack",
    detail:
      "Sorts artifacts by colour using a Geneva mechanism with a powered stick transfer.",
    image: "/cad/spicerack-v2.jpg"
  },
  {
    name: "Intake",
    detail:
      "Two-layer compliant roller intake feeding a steep ramp straight into the rack.",
    image: "/cad/intake-compliant.jpg"
  },
  {
    name: "Drivetrain",
    detail:
      "Mecanum belt drive, dual odometry pods, and a PTO that lifts the whole robot.",
    image: "/cad/chassis-side.jpg"
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
      "Getting an artifact off the floor and into a sorting slot without stalling, deforming, or jamming it.",
    versions: [
      {
        version: "V1",
        title: "Active intake",
        note: "Faster than a four-bar claw, but bootleg wheels caught on the artifact notches and the ramp slope pressed balls flat.",
        image: "/cad/intake-v1.jpg"
      },
      {
        version: "V2",
        title: "Compliant rollers",
        note: "Silicone rollers and a chain-driven compliant bar. Steeper, flatter ramp with guides to aim the ball at the slot.",
        image: "/cad/intake-v2.jpg"
      },
      {
        version: "V3",
        title: "Two-layer compliant",
        note: "A second powered row with surgical tubing closes the gap above the rollers, so artifacts stop slipping and breaking colour detection.",
        image: "/cad/intake-v3.jpg"
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
        image: "/cad/spicerack-v2.jpg"
      },
      {
        version: "V2",
        title: "Geneva mechanism",
        note: "A Geneva gear lets the motor run continuously while indexing to six fixed stops — under a millimetre of error, tuned to the intake and shooter.",
        image: "/cad/geneva.jpg"
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
        note: "Pushed the ball up mechanically. Reset too slowly to use the Geneva's full speed.",
        image: "/cad/transfer-motor.jpg"
      },
      {
        version: "V2",
        title: "Servo wheel",
        note: "An Axon servo driving omni wheels. Right idea, not enough power — balls stalled in the dead space and stopped the rack.",
        image: "/cad/transfer-rollers.jpg"
      },
      {
        version: "V3",
        title: "6000 RPM roller",
        note: "Motor swap plus a third roller to cover the dead space. Sorted balls now shoot in tandem — 2–5 second cycles including sorting.",
        image: "/cad/intake-chain.jpg"
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
      "Before either simulator is trustworthy it needs a real model. We derived ours from motor dynamics, mecanum kinematics, and projectile motion, so the simulated robot responds to control input the way the physical one actually does — and we can find the edges of its capability without breaking anything.",
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
      "Trajectories between waypoints are solved as an optimisation problem: the time-optimal path the robot can actually achieve within its motor constraints. Inspired by FRC's Choreo, we built a web interface for creating and editing those paths, so tuning an auto does not mean editing numbers in source.",
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
    result: "15% more efficient",
    detail:
      "Computes the optimal path by minimising total traversal time inside the robot's real physical limits — measured against conventional followers like PedroPathing.",
    image: "/figures/mpc-horizon.jpg"
  },
  {
    name: "Factor-graph localization",
    result: "75% less drift",
    detail:
      "GTSAM sensor fusion folds Limelight AprilTag detections into the pose estimate, cutting long-term precision error against odometry alone.",
    image: "/figures/gtsam.jpg"
  },
  {
    name: "LTV path following",
    result: "Runs every timestep",
    detail:
      "Full MPC is too heavy for the onboard processor, so we pre-compute optimal headings offline and collapse the nonlinear problem into a Linear Time-Varying one.",
    image: "/figures/ltv.jpg"
  },
  {
    name: "Global Lipschitz \u2014 Virtual Sort",
    result: "Sorting without a sorter",
    detail:
      "With no mechanical sorting on the Worlds bot, we sort consecutive shots mid-air with the turret. We bound how much a ball's arc changes the shooter state to find the Lipschitz constant, then use the Shubert\u2013Piyavskii method to maximise the landing gap between shots.",
    image: "/figures/lipschitz.jpg"
  },
  {
    name: "LQR flywheel control",
    result: "Sub-second recovery",
    detail:
      "A Linear-Quadratic Regulator drives the flywheel to speed as fast as possible while suppressing overshoot and voltage spikes.",
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
  "After the State Championship we stopped iterating and started over. Built jointly with our sister team SigmaCorns #22377, the Worlds robot trades the spindexer and the lift for a single straight-shoot path — lighter, simpler, and built around one question: how fast can one artifact get from the floor to the goal?"

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
    image: "/worlds/transfer-path.jpg"
  },
  {
    name: "Flywheel shooter",
    detail:
      "Two 6000 RPM motors driving two steel flywheels, with a dynamically integrated hood through 36° of travel and 10 mm of compression. Steel over aluminium bought us RPM stability and sub-second recovery between shots.",
    image: "/worlds/shooter.jpg"
  },
  {
    name: "Bearing stack turret",
    detail:
      "A bearing stack on the top plate lets the turret spin without friction from anything below it. We swapped the 435 RPM motor for two Axon servos and freed a motor for the rest of the robot.",
    image: "/worlds/turret.jpg"
  },
  {
    name: "Vectoring intake",
    detail:
      "Curved guides were jamming on multi-artifact pickups, so V3 replaced them with right-biased vectoring wheels, a shallower compliant ramp, and dead wheels at each end that release artifacts while the intake keeps running.",
    image: "/worlds/intake-v3.jpg"
  },
  {
    name: "FEA-optimised chassis",
    detail:
      "Finite element analysis on the drivetrain plates showed us exactly where material was doing nothing. The 15.2″ × 14.5″ result is lighter and faster, with Gripforce wheels, pocketed sideplates, and the battery and four motors low in the base for stability.",
    image: "/worlds/fea.jpg"
  },
  {
    name: "Ranking-point strategy",
    detail:
      "We scored each ranking point against its mechanical cost and committed to the goal RP. That decision let us cut the lift and the brake outright — a lighter, less complex robot aimed squarely at winning matches.",
    image: "/worlds/drivetrain.jpg"
  }
]

/* ------------------------------------------------------------------ */
/* Outreach — RoboKnights' own programs only                           */
/* ------------------------------------------------------------------ */

export const outreachPrograms = [
  {
    title: "Triad Technos",
    subtitle: "FLL 71079 · Greensboro, NC",
    body: "We started an FLL team from nothing — found a coach, interviewed members, ran parent info nights, ordered sets, and mentored them from basic Spike code to competition-ready programs. They competed at the Cannon High School qualifier.",
    image: "/outreach/event-members.jpg"
  },
  {
    title: "Kids Knight Out",
    subtitle: "Museum of Life & Science",
    body: "We demonstrate the robot to classes of twenty young students, explain the mechanisms, and let them drive it through interactive games. The questions kept coming, so we now host monthly sessions.",
    image: "/outreach/museum-demo.jpg"
  },
  {
    title: "GlobalKnights",
    subtitle: "Brazil · Romania",
    body: "We reached out to ParaTech (#9302) in Brazil and BraveBots (#19141) and Brute Force (#22491) in Romania over Instagram, then ran introductions, design reviews, and programming exchanges after the five-week scrimmage.",
    image: "/outreach/field-demo.jpg"
  },
  {
    title: "Open House",
    subtitle: "with the ZebraCorns, FRC 900",
    body: "On FRC Kickoff day we co-hosted an open house for students, prospective FIRST members, and families — we let people drive our robot and presented on how to get into FTC.",
    image: "/outreach/library-kids.jpg"
  },
  {
    title: "Durham Main Library",
    subtitle: "Family STEM event",
    body: "We presented the robot and our season to local families, connected students with FIRST sign-ups, and found heavy interest in a one-to-two week technical skills summer camp.",
    image: "/outreach/science-board.jpg"
  },
  {
    title: "Volunteering",
    subtitle: "Bull City FLL · Raleigh Qualifier",
    body: "We judged at the Bull City FLL Scrimmage and worked the 3rd Southeast Raleigh qualifier as pit runners, judging queuers, field attendants, and field resetters.",
    image: "/outreach/volunteers.jpg"
  }
]

export const mentoredTeams = [
  {
    number: "71079",
    name: "Triad Technos",
    note: "FLL — founded and mentored"
  },
  {
    number: "23303",
    name: "Metallic@",
    note: "Programming, mechanical, outreach"
  },
  {
    number: "16328",
    name: "Trial N' Error",
    note: "Parametric CAD, swerve build"
  },
  { number: "9789", name: "Platinum Ringleaders", note: "FRC design review" },
  { number: "9302", name: "ParaTech", note: "Brazil — programming exchange" },
  { number: "19141", name: "BraveBots", note: "Romania — design review" }
]

/* ------------------------------------------------------------------ */
/* Partners — condensed                                                */
/* ------------------------------------------------------------------ */

export const sponsors = [
  { name: "Gene Haas Foundation", src: "/logos/genehaas.png" },
  { name: "NCSSM Foundation", src: "/logos/ncssm-foundation.png" },
  { name: "monday.com", src: "/logos/monday.png" },
  { name: "goBILDA", src: "/logos/gobilda.png" },
  { name: "Rubrik", src: "/logos/rubrik.png" },
  { name: "Shelby Dental Care Center", src: "/logos/shelbydental.png" }
]

export const collaborators = [
  { name: "Google", src: "/logos/google.png" },
  { name: "Intel", src: "/logos/intel.png" },
  { name: "IBM", src: "/logos/ibm.png" },
  { name: "MIT", src: "/logos/mit.png" },
  { name: "Duke University", src: "/logos/duke.png" },
  { name: "UNC Chapel Hill", src: "/logos/unc.png" },
  { name: "NC State", src: "/logos/ncstate.png" },
  { name: "WarmHub", src: "/logos/warmhub.png" }
]

/* Mentors, kept deliberately small — names and affiliations only. */
export const mentors = [
  {
    name: "Robyn Stephens",
    org: "Powered Research",
    src: "/team/mentors/robyn.jpg"
  },
  { name: "Eric Liu", org: "WarmHub", src: "/team/mentors/eric.jpg" },
  { name: "Carl Ryden", org: "WarmHub", src: "/team/mentors/carl.jpg" },
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
    src: "/gallery/team-robots.jpg",
    alt: "The team in front of a lit ROBOTS sign"
  },
  {
    src: "/gallery/robot-field-1.jpg",
    alt: "Elite Ball Knowledge on the competition field"
  },
  {
    src: "/gallery/competition-pit.jpg",
    alt: "The team with the robot in the pits"
  },
  {
    src: "/gallery/field-demo.jpg",
    alt: "Demonstrating the robot to students"
  },
  { src: "/gallery/robot-field-2.jpg", alt: "Intake loading an artifact" },
  { src: "/gallery/mechanical.jpg", alt: "Mechanical subteam at work" },
  { src: "/gallery/volunteers.jpg", alt: "Volunteering at an FLL scrimmage" },
  {
    src: "/gallery/museum-demo.jpg",
    alt: "Robot demo at the Museum of Life & Science"
  },
  { src: "/gallery/robot-field-3.jpg", alt: "The robot scoring an artifact" },
  { src: "/gallery/club-fair.jpg", alt: "Recruiting at the NCSSM club fair" },
  { src: "/gallery/programming.jpg", alt: "Programming subteam at work" },
  {
    src: "/gallery/competition-gym.jpg",
    alt: "The team at a competition venue"
  }
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
    label: "CTRL ALT FTC",
    href: "https://www.ctrlaltftc.com/",
    detail:
      "The controls resource our programmers learn from and contribute to \u2014 it reaches FTC programmers worldwide."
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
