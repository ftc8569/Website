import Image from "next/image";

export default function Team() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-center">
        <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Meet Our Team</h1>
      </div>
      <p className="px-64 text-xl pb-5">An FTC (FIRST Tech Challenge) team is typically structured with students
        taking on various roles, such as programmers, builders, designers, and team
        managers, to collaboratively build and program a robot. Each team operates
        under a leadership system, often with a captain and sub-team leads, ensuring
        that tasks are distributed efficiently. The team’s goal is to design, build,
        and code a robot capable of completing specific challenges in regional and
        national competitions. Beyond robotics, FTC teams emphasize critical skills
        such as problem-solving, teamwork, and project management. Participation in
        an FTC team helps students develop both technical abilities and leadership
        skills, preparing them for future careers in STEM.</p>
      <div className="flex flex-col py-4 max-w-max content-center mx-auto rounded-2xl mb-5">
        <div className="bg-roboHotPink h-1 mb-4 rounded-xl"></div>
        <div className="flex items-center justify-center">
          <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Programming Team</h1>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 px-10">
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
        </div>
      </div>
      <div className="flex flex-col py-4 max-w-max content-center mx-auto rounded-2xl mb-5">
        <div className="bg-roboHotPink h-1 mb-4 rounded-xl"></div>
        <div className="flex items-center justify-center">
          <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Mechanical Team</h1>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 px-10">
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
        </div>
      </div>
      <div className="flex flex-col py-4 max-w-max content-center mx-auto rounded-2xl">
        <div className="bg-roboHotPink h-1 mb-4 rounded-xl"></div>
        <div className="flex items-center justify-center">
          <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Outreach Team</h1>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 px-10">
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
        </div>
        <div className="bg-roboHotPink h-1 mt-12 rounded-xl"></div>
      </div>
      <div className="flex flex-col py-2 max-w-max content-center mx-auto rounded-2xl mb-5">
        <div className="flex items-center justify-center">
          <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mb-4">Mentors</h1>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 px-10">
          <IconPicture name={"Chase"} src={"chase"}/>
          <IconPicture name={"Chase"} src={"chase"}/>
        </div>
      </div>
    </div>
  )
}

function IconPicture({name, src}: { name: string, src: string }) {
  return (
    <Image
      src={`/team/${src}.png`}
      alt={`Team Member: ${name}`}
      width={3024 / 12}
      height={4032 / 12}
      className="rounded-2xl"
    />
  )
}