import type { Metadata } from "next"

import {
  nextEvent,
  seasonEvents,
  seasonName,
  seasonYears
} from "@/components/home/season"
import SeasonTimeline from "@/components/site/season-timeline"
import { LocalNav, PageHero } from "@/components/site/ui"

export const metadata: Metadata = {
  title: "Season",
  description:
    "Team 8569's 2026–27 BioBuzz season, event by event, from our kickoff talks to the Robot in 5 Weeks scrimmage."
}

export default function SeasonPage() {
  return (
    <main>
      <PageHero
        image="/season/ri5w-huddle.jpg"
        imagePosition="center 35%"
        eyebrow={`${seasonYears} season · ${seasonName}`}
        title="This season so far"
        sub="Every event, in order, with what happened."
      />
      <LocalNav
        title="Season"
        links={[
          { href: "#kickoff", label: "Sep 13" },
          { href: "#ri5w", label: "Oct 18" },
          { href: "#next", label: "Next" }
        ]}
      />
      <section className="section tex-field-section">
        <div className="wrap">
          <SeasonTimeline events={seasonEvents} next={nextEvent} />
        </div>
      </section>
    </main>
  )
}
