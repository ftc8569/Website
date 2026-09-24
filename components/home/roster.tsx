"use client"

import Image from "next/image"
import { useState } from "react"

/*
 * Roster. team.yml stays the single source of truth for members — adding a
 * person is a YAML entry plus a photo dropped in /public/team. The YAML is
 * parsed on the server (see app/page.tsx) and handed down as a prop.
 */

export type Member = { src: string; name: string; role: string }

export type TeamData = {
  programmers?: Member[]
  mechanical?: Member[]
  outreach?: Member[]
  mentors?: Member[]
}

const GROUPS: { key: keyof TeamData; label: string; blurb: string }[] = [
  {
    key: "mechanical",
    label: "Build / Design",
    blurb:
      "Fully designs the robot in CAD before a single part is cut, then optimises it for weight and strength."
  },
  {
    key: "programmers",
    label: "Programming",
    blurb:
      "Built FTC programming knowledge from scratch and used it for advanced control systems."
  },
  {
    key: "outreach",
    label: "Outreach",
    blurb:
      "Expands our network to learn, communicate, and spread STEM across communities."
  }
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
}

function MemberCard({ member }: { member: Member }) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className="member">
      <div className="member-photo">
        {failed ? (
          <span className="member-fallback">{initials(member.name)}</span>
        ) : (
          <Image
            src={`/team/${member.src}`}
            alt={member.name}
            fill
            sizes="220px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption>
        <p className="member-name">{member.name}</p>
        <p className="member-role">{member.role.trim()}</p>
      </figcaption>
    </figure>
  )
}

export default function Roster({ team }: { team: TeamData }) {
  const total = GROUPS.reduce(
    (sum, group) => sum + (team[group.key]?.length ?? 0),
    0
  )

  return (
    <div className="roster">
      {GROUPS.map((group) => {
        const members = team[group.key] ?? []
        if (!members.length) return null

        return (
          <div className="roster-group" key={group.key}>
            <div className="roster-group-head">
              <h3>{group.label}</h3>
              <span className="roster-count">
                {members.length.toString().padStart(2, "0")}
              </span>
              <p>{group.blurb}</p>
            </div>
            <div className="roster-grid">
              {members.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        )
      })}
      {total > 0 && (
        <p className="roster-total">
          {total} students. Three subteams. One machine.
        </p>
      )}
    </div>
  )
}
