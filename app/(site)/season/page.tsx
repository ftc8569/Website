import type { Metadata } from "next"

import { seasonEvents, seasonName } from "@/components/home/season"
import PageHeader from "@/components/site/page-header"
import SeasonTimeline from "@/components/site/season-timeline"

export const metadata: Metadata = {
  title: "Season",
  description:
    "Team 8569's season so far, event by event — from kickoff to the Robot in 5 Weeks scrimmage."
}

export default function SeasonPage() {
  return (
    <main>
      <PageHeader
        image="/season/ri5w-huddle.jpg"
        tone="bright"
        eyebrow={`Season · ${seasonName}`}
        title={
          <>
            The season,
            <br />
            so far.
          </>
        }
        lede="Every event this season, in order."
      />
      <section className="season-section">
        <SeasonTimeline events={seasonEvents} />
      </section>
    </main>
  )
}
