/*
 * This season, in order. Add new events to the end of `seasonEvents`; the
 * season page renders them as a scroll-through timeline.
 */

export type SeasonPhoto = {
  src: string
  alt: string
  /*
   * Mosaic tile shape: wide spans two columns, tall two rows, big both.
   * The order in `photos` is chosen so the tiles pack with no gaps.
   */
  span?: "wide" | "tall" | "big"
}

export type SeasonStat = { value: string; label: string }

export type SeasonEvent = {
  id: string
  date: string
  kind: string
  title: string
  body: string
  image?: SeasonPhoto
  points?: string[]
  /* A headline number, counted up when the event scrolls into view. */
  highlight?: { value: number; label: string; detail: string }
  stats?: SeasonStat[]
  photos?: SeasonPhoto[]
  credit?: string
}

export const seasonName = "2026–27 · BIOBUZZ"

export const seasonEvents: SeasonEvent[] = [
  {
    id: "kickoff",
    date: "Sep 13",
    kind: "NCFTC kickoff talk",
    title: "Digital Alliance",
    body: "Our robotics networking talk at the 2026 NCFTC kickoff: how FTC teams can reach sponsors and mentors online.",
    image: {
      src: "/season/kickoff-digital-alliance.jpg",
      alt: "Two RoboKnights members presenting the Digital Alliance slide 'Match the platform' at kickoff"
    },
    points: [
      "LinkedIn — fastest replies",
      "Instagram — best for local",
      "Email — lowest reply rate"
    ]
  },
  {
    id: "kickoff-mechanical",
    date: "Sep 13",
    kind: "NCFTC kickoff talk",
    title: "Mechanical Optimization",
    body: "Our second kickoff talk: iterating a robot sideplate with stress analysis, from early versions to the final design.",
    photos: [
      {
        src: "/season/kickoff-mech-sideplate.jpg",
        alt: "A RoboKnights presenter pointing to sideplate stress, displacement, and safety factor results",
        span: "big"
      },
      {
        src: "/season/kickoff-mech-presenters.jpg",
        alt: "Two RoboKnights presenters at the podium during the Mechanical Optimization talk"
      },
      {
        src: "/season/kickoff-mech-final.jpg",
        alt: "A RoboKnights presenter comparing the final sideplate version with version 2"
      }
    ]
  },
  {
    id: "ri5w",
    date: "Oct 18",
    kind: "Scrimmage",
    title: "Robot in 5 Weeks scrimmage",
    body: "The new robot's first matches — and the top score of the day.",
    highlight: {
      value: 106,
      label: "Event high score",
      detail: "Q6 with 5064 · won 106–39"
    },
    stats: [
      { value: "3rd", label: "of 7 teams" },
      { value: "76.67", label: "avg points · event best" },
      { value: "80", label: "hive points in one match" }
    ],
    photos: [
      {
        src: "/season/ri5w-high-score.jpg",
        alt: "Scoreboard showing the red alliance of 8569 and 5064 winning 106 to 39, marked event high score",
        span: "wide"
      },
      {
        src: "/season/ri5w-robot-red.jpg",
        alt: "The 8569 robot on the field with a red number plate",
        span: "tall"
      },
      {
        src: "/season/ri5w-rankings.jpg",
        alt: "Final qualification rankings with 8569 in third",
        span: "wide"
      },
      {
        src: "/season/ri5w-robot-field.jpg",
        alt: "The 8569 robot with a blue number plate on the field",
        span: "tall"
      },
      {
        src: "/season/ri5w-match.jpg",
        alt: "Drive teams lined up behind the field during a match",
        span: "tall"
      },
      {
        src: "/season/ri5w-number-plate.jpg",
        alt: "Close-up of the red 8569 number plate"
      },
      {
        src: "/season/ri5w-roboknights-shirt.jpg",
        alt: "A RoboKnights member in an 8569 shirt watching the field"
      }
    ],
    credit: "Photos by Neil"
  }
]
