"use client"

import Image from "next/image"
import { useState } from "react"

import { Silhouette } from "@/components/site/ui"

/*
 * Roster. team.yml stays the single source of truth for members: adding a
 * person is a YAML entry plus a photo dropped in /public/team. The YAML is
 * parsed on the server (app/(site)/team/page.tsx) and handed down as a prop.
 */

export type Member = {
  src: string
  name: string
  role: string
  /* Optional object-position for the square crop, e.g. "50% 20%". */
  focus?: string
}

export type TeamData = {
  programmers?: Member[]
  mechanical?: Member[]
  outreach?: Member[]
  mentors?: Member[]
}

const GROUPS: {
  key: keyof TeamData
  label: string
  short: string
  blurb: string
}[] = [
  {
    key: "mechanical",
    label: "Mechanical",
    short: "Mechanical",
    blurb:
      "Designs the robot in CAD, then builds it from 3D-printed, goBILDA and CNC-cut parts."
  },
  {
    key: "programmers",
    label: "Programming",
    short: "Programming",
    blurb:
      "Writes the Kotlin robot code, the simulators and the autonomous paths."
  },
  {
    key: "outreach",
    label: "Outreach",
    short: "Outreach",
    blurb: "Runs our FLL mentoring, robot demos and social accounts."
  }
]

const isCaptain = (member: Member) =>
  member.role.trim().toLowerCase() === "captain"

/*
 * Some source photos are full-length shots rather than headshots, so their
 * square crop needs to sit higher up the frame.
 */
const FOCUS: Record<string, string> = {
  "nicholas.png": "50% 15%",
  "abhinav.png": "50% 15%",
  "alaina.png": "50% 15%",
  "tanay.png": "50% 20%",
  "blake.png": "50% 28%",
  "yug.png": "50% 25%",
  "christian.png": "50% 25%",
  "ishaan.png": "50% 25%"
}

function MemberCard({ member }: { member: Member }) {
  const [failed, setFailed] = useState(!member.src)

  return (
    <figure className="person">
      <div className="media media--square" data-sharpen>
        {failed ? (
          <Silhouette />
        ) : (
          <Image
            src={`/team/${member.src}`}
            alt={member.name}
            fill
            sizes="(max-width: 734px) 50vw, 280px"
            style={{
              objectPosition: member.focus ?? FOCUS[member.src] ?? "50% 35%"
            }}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption>
        <p className="person-name">{member.name}</p>
        <p className="person-role">{member.role.trim()}</p>
      </figcaption>
    </figure>
  )
}

export default function Roster({ team }: { team: TeamData }) {
  const total = GROUPS.reduce(
    (sum, group) => sum + (team[group.key]?.length ?? 0),
    0
  )

  // Captains are pulled out of their subteams and shown first.
  const captains = GROUPS.flatMap((group) =>
    (team[group.key] ?? []).filter(isCaptain).map((member) => ({
      ...member,
      role: `Captain · ${group.short}`
    }))
  )

  const groups = [
    {
      key: "captains",
      label: "Captains",
      blurb: "Lead the mechanical and programming subteams and set priorities.",
      members: captains
    },
    ...GROUPS.map((group) => ({
      key: group.key,
      label: group.label,
      blurb: group.blurb,
      members: (team[group.key] ?? []).filter((member) => !isCaptain(member))
    }))
  ]

  if (total === 0)
    return (
      <p className="body" role="status" style={{ textAlign: "center" }}>
        Roster information is currently unavailable.
      </p>
    )

  return (
    <div className="roster">
      {groups.map(
        (group) =>
          group.members.length > 0 && (
            <section className="roster-group" key={group.key} data-reveal>
              <header className="roster-head">
                <h3>{group.label}</h3>
                <p className="body">{group.blurb}</p>
              </header>
              <div className="grid grid--4 roster-grid">
                {group.members.map((member) => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </div>
            </section>
          )
      )}
      <p className="roster-total">{total} students across three subteams.</p>
    </div>
  )
}
