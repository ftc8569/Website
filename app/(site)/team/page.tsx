import { readFile } from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { parse } from "yaml"

import TeamView from "@/components/site/team-view"
import type { TeamData } from "@/components/home/roster"

export const metadata: Metadata = {
  title: "Team — RoboKnights 8569",
  description: "The students, mentors, sponsors and partners behind Team 8569."
}

/*
 * team.yml is read here rather than fetched in the browser so the roster is in
 * the initial HTML — no empty section while a request is in flight, and no way
 * for a failed fetch to blank out the team.
 */
async function loadTeam(): Promise<TeamData> {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "team", "team.yml"),
      "utf8"
    )
    return (parse(file) as TeamData) ?? {}
  } catch {
    return {}
  }
}

export default async function TeamPage() {
  const team = await loadTeam()
  return <TeamView team={team} />
}
