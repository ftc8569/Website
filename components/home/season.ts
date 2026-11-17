/*
 * This season, in order. Add new events to the end of `seasonEvents`; the
 * season page renders them as a scroll-through timeline.
 */

export type SeasonPhoto = {
  src: string
  alt: string
  /* CSS object-position for the 4:3 crop, so faces and scores stay in frame. */
  position?: string
}

export type SeasonStat = { value: string; label: string }

export type SeasonEvent = {
  id: string
  date: string
  kind: string
  title: string
  body: string
  image?: SeasonPhoto
  /* Large photo shown above the grid. */
  lead?: SeasonPhoto
  /* Small comparison table: what each channel was good for. */
  findings?: { channel: string; result: string }[]
  /* A headline number. Rendered as its final value; never animated from 0. */
  highlight?: { value: string; label: string; detail: string }
  stats?: SeasonStat[]
  photos?: SeasonPhoto[]
  credit?: string
  /* Photo shown faintly behind the headline number. */
  scoreboard?: string
}

export const seasonName = "BioBuzz"
export const seasonYears = "2026–27"

/* Shown as the last tile. Set `date` and `title` once the event is scheduled. */
export const nextEvent: { date?: string; title?: string } = {}

export const seasonEvents: SeasonEvent[] = [
  {
    id: "kickoff",
    date: "Sep 13",
    kind: "NCFTC kickoff talk",
    title: "Digital Alliance",
    body: "At the 2026 NCFTC kickoff we gave a talk on how FTC teams can reach sponsors and mentors online, and which platform to use for what.",
    image: {
      src: "/season/kickoff-digital-alliance.jpg",
      alt: "Two RoboKnights members presenting the Digital Alliance slide 'Match the platform' at kickoff"
    },
    findings: [
      { channel: "LinkedIn", result: "Fastest replies" },
      { channel: "Instagram", result: "Best for local contacts" },
      { channel: "Email", result: "Lowest reply rate" }
    ]
  },
  {
    id: "kickoff-mechanical",
    date: "Sep 13",
    kind: "NCFTC kickoff talk",
    title: "Mechanical Optimization",
    body: "Our second kickoff talk walked through a robot sideplate we iterated with stress analysis, from the early versions to the final design.",
    lead: {
      src: "/season/kickoff-mech-title.webp",
      alt: "Two RoboKnights presenters beside the title slide, Mechanical Optimization for FTC Design",
      position: "50% 40%"
    },
    photos: [
      {
        src: "/season/kickoff-mech-results.webp",
        alt: "A presenter pointing at the stress plots for the final sideplate version",
        position: "50% 40%"
      },
      {
        src: "/season/kickoff-mech-bracket.webp",
        alt: "A presenter pointing at a simulated bracket coloured by stress",
        position: "50% 35%"
      },
      {
        src: "/season/kickoff-mech-safety.webp",
        alt: "A presenter pointing at the sideplate safety-factor results",
        position: "50% 40%"
      },
      {
        src: "/season/kickoff-mech-deformation.webp",
        alt: "A presenter explaining the sideplate deformation scale",
        position: "50% 35%"
      },
      {
        src: "/season/kickoff-mech-sideplate.jpg",
        alt: "A presenter pointing at the sideplate stress, displacement and safety-factor plots",
        position: "50% 25%"
      },
      {
        src: "/season/kickoff-mech-assembly.webp",
        alt: "Our two presenters explaining assembly mates in CAD",
        position: "40% 45%"
      },
      {
        src: "/season/kickoff-mech-final.jpg",
        alt: "A presenter comparing the stress plots for the final sideplate and version 2",
        position: "50% 30%"
      }
    ]
  },
  {
    id: "ri5w",
    date: "Oct 18",
    kind: "Scrimmage",
    title: "Robot in 5 Weeks scrimmage",
    body: "Our new robot played its first matches and posted the top score of the day.",
    highlight: {
      value: "106",
      label: "Top score of the event",
      detail: "Qualification 6 with 5064, won 106–39"
    },
    stats: [
      { value: "3rd", label: "of 7 teams" },
      { value: "76.67", label: "average points, event best" },
      { value: "80", label: "hive points in one match" }
    ],
    lead: {
      src: "/season/ri5w-robot-red.jpg",
      alt: "Our robot with its red number plate on the field at the scrimmage",
      position: "50% 62%"
    },
    scoreboard: "/season/ri5w-high-score.jpg",
    photos: [
      {
        src: "/season/ri5w-high-score.jpg",
        alt: "Field scoreboard: red alliance 8569 and 5064 win 106 to 39, flagged as the event high score",
        position: "50% 40%"
      },
      {
        src: "/season/ri5w-rankings.jpg",
        alt: "Final qualification rankings with 8569 in third",
        position: "50% 30%"
      },
      {
        src: "/season/ri5w-robot-field.jpg",
        alt: "Our robot with a blue number plate on the field",
        position: "50% 60%"
      },
      {
        src: "/season/ri5w-match.jpg",
        alt: "Drive teams behind the glass during a match, with our robot at lower right",
        position: "70% 85%"
      },
      {
        src: "/season/ri5w-number-plate.jpg",
        alt: "Close-up of the red 8569 number plate"
      },
      {
        src: "/season/ri5w-roboknights-shirt.jpg",
        alt: "Back of a RoboKnights member in a black 8569 shirt",
        position: "50% 60%"
      }
    ],
    credit: "Photos by Neil"
  }
]
