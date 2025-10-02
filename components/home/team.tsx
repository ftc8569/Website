import Image from "next/image"
import { ReactNode, RefObject, useEffect, useState } from "react"
import { parse } from "yaml"

export default function Team({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  const [team, setTeam] = useState<TeamData | null>(null)

  useEffect(() => {
    if (!team)
      fetch("/team/team.yml")
        .then((res) => res.text())
        .then((yaml) => {
          const teamData: TeamData = parse(yaml)
          setTeam(teamData)
        })
  }, [team])

  return (
    <div id={"team"} className="flex flex-col w-full lg:px-36" ref={divRef}>
      <div className="flex items-center justify-center">
        <h1 className="inline text-3xl lg:text-4xl p-3 text-roboPink font-extrabold text-center rounded-2xl mt-2 mb-4">
          Meet Our Team
        </h1>
      </div>
      <p className="px-5 text-sm lg:text-lg pb-5 text-center">
        The Roboknights are divided into three subteams, where each has a team
        lead who organizes tasks and helps everyone work together to keep the
        team running successfully.
        {/* Programming,
        Mechanical, and Outreach. Every team member is part of at least two
        subteams, helping in different areas. The Programming subteam  The Mechanical subteam focuses on building and fixing the robot to
        make sure it is capable and efficient. The Outreach subteam connects
        with the community, spreads awareness about STEM and FIRST, and helps
        find sponsors for our team. Each subteam  */}
      </p>
      <SubTeam name={"Programming Team"} team={team?.programmers}>
        We work on programming the robot to make sure it runs smoothly, and is
        able to complete the tasks required for this year's competition.
      </SubTeam>
      <SubTeam name={"Mechanical Team"} team={team?.mechanical}>
        We focus on designing, building, and fixing the robot to make sure it is
        capable and efficient.
      </SubTeam>
      <SubTeam name={"Outreach Team"} team={team?.outreach}>
        We connect with the community, spread awareness about STEM and FIRST,
        and help find sponsors for our team.
      </SubTeam>
      <SubTeam name={"Mentors"} team={team?.mentors} />
    </div>
  )
}

function SubTeam({
  name,
  team,
  children
}: {
  name: string
  team: TeamMember[] | undefined
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col py-2 w-full items-center rounded-2xl mb-5">
      {/* <div className="bg-white h-0.5 mb-12 rounded-xl w-[90%] lg:w-full"></div> */}
      <div
        className={`flex flex-col items-center justify-center ${children ? "mb-4" : "mb-0"}`}
      >
        <h2 className="inline text-xl lg:text-3xl p-2 lg:p-3 text-roboPink font-extrabold rounded-2xl">
          {name}
        </h2>
        {children && (
          <p className="max-w-[48rem] text-center text-gray-300">{children}</p>
        )}
      </div>
      <div className="flex flex-row justify-center gap-4 px-1 lg:px-10 flex-wrap">
        {team?.map((m) => (
          // eslint-disable-next-line react/jsx-key
          <MemberIcon name={m.name} role={m.role} src={m.src} key={m.name} />
        ))}
      </div>
    </div>
  )
}

function MemberIcon({ name, role, src }: TeamMember) {
  return (
    <div className="w-[45%] lg:w-[17%] flex flex-col items-center">
      <Image
        src={`/team/${src}`}
        alt={`Team Member: ${name}`}
        width={3024}
        height={4032}
        className="rounded-2xl object-scale-down mb-2"
        placeholder={"blur"}
        blurDataURL={"/team/blur.png"}
      />
      <p className="text-center text-lg font-semibold">{name}</p>
      <p className="text-center text-sm text-gray-300">{role}</p>
    </div>
  )
}

interface TeamMember {
  src: string
  name: string
  role: string
}

interface TeamData {
  programmers: TeamMember[]
  mechanical: TeamMember[]
  outreach: TeamMember[]
  mentors: TeamMember[]
}
