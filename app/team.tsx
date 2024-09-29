import Image from "next/image";
import {MutableRefObject, useEffect, useState} from "react";
import {parse} from "yaml";

export default function Team({ divRef }: { divRef: MutableRefObject<HTMLDivElement | null> }) {
  const [team, setTeam] = useState<TeamData | null>(null);

  useEffect(() => {
    if(!team) fetch("/team/team.yml")
      .then(res => res.text())
      .then(yaml => {
        const teamData: TeamData = parse(yaml)
        setTeam(teamData)
      })
  }, [team]);

  return (
    <div className="flex flex-col w-full px-36" ref={divRef}>
      <div className="flex items-center justify-center">
        <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Meet Our Team</h1>
      </div>
      <p className="px-32 text-xl pb-5">An FTC (FIRST Tech Challenge) team is typically structured with students
        taking on various roles, such as programmers, builders, designers, and team
        managers, to collaboratively build and program a robot. Each team operates
        under a leadership system, often with a captain and sub-team leads, ensuring
        that tasks are distributed efficiently. The team’s goal is to design, build,
        and code a robot capable of completing specific challenges in regional and
        national competitions. Beyond robotics, FTC teams emphasize critical skills
        such as problem-solving, teamwork, and project management. Participation in
        an FTC team helps students develop both technical abilities and leadership
        skills, preparing them for future careers in STEM.</p>
      <SubTeam name={"Programming Team"} team={team?.programmers} />
      <SubTeam name={"Mechanical Team"} team={team?.mechanical} />
      <SubTeam name={"Outreach Team"} team={team?.outreach} />
      <SubTeam name={"Mentors"} team={team?.mentors} />
    </div>
  )
}

function SubTeam({ name, team }: { name: string, team: { src: string, name: string, role: string }[] | undefined }) {
  return (
    <div className="flex flex-col py-2 w-full content-center mx-auto rounded-2xl mb-5">
      <div className="bg-roboHotPink h-1 mb-12 rounded-xl w-full"></div>
      <div className="flex items-center justify-center">
        <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mb-4">{name}</h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 px-10">
        {
          team?.map(m =>
            // eslint-disable-next-line react/jsx-key
            (<MemberIcon name={m.name} role={m.role} src={m.src}/>))
        }
      </div>
    </div>
  )
}

function MemberIcon({name, role, src}: { name: string, role: string, src: string }) {
  return (
    <div className="flex flex-col">
      <Image
        src={`/team/${src}`}
        alt={`Team Member: ${name}`}
        width={3024 / 12}
        height={4032 / 12}
        className="rounded-2xl"
      />
      <p className="text-center text-lg font-semibold">{name}</p>
      <p className="text-center text-sm text-gray-300">{role}</p>
    </div>
  )
}

interface TeamData {
  programmers: {
    src: string,
    name: string,
    role: string
  }[],
  mechanical: {
    src: string,
    name: string,
    role: string
  }[],
  outreach: {
    src: string,
    name: string,
    role: string
  }[],
  mentors: {
    src: string,
    name: string,
    role: string
  }[]
}