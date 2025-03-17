import { RefObject } from "react"
import Image from "next/image"

export default function MechanicalSection({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div id={"mechanical"} ref={divRef} className="px-5 lg:px-36 py-10">
      <div className="flex items-center justify-center">
        <h1 className="inline text-3xl lg:text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">
          Mechanical Team
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row pt-5 gap-5 lg:gap-10">
        <Image
          src={"/activity/mechanical-1.png"}
          alt={"Programmer locked in"}
          width={4032 / 8}
          height={3024 / 8}
          className="rounded-2xl"
        />
        <p className="text-sm lg:text-xl">
          Robots are cool because they combine advanced technology
          with real-world applications, performing tasks with
          incredible precision and efficiency. They can handle
          dangerous or repetitive jobs that humans would find difficult
          or boring, like exploring space or assembling intricate
          machinery. Robots also demonstrate the power of artificial
          intelligence, learning and adapting to new environments and
          challenges. Their ability to interact with people and their
          surroundings opens up exciting possibilities in fields like
          healthcare, education, and entertainment. Ultimately, robots
          embody the future of innovation, blending science fiction
          with reality in a way that sparks imagination and curiosity.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row-reverse pt-5 gap-5 lg:gap-10">
        <Image
          src={"/activity/mechanical-2.png"}
          alt={"Programmer waiting for mech guy"}
          width={4032 / 8}
          height={3024 / 8}
          className="rounded-2xl"
        />
        <p className="text-sm lg:text-xl">
          As for our design, the biggest thing we’ve been working on
          developing for a stable design process is the ability to
          make master sketches. This generally serves to help give
          us a better frame of reference as to the parameters of
          the robot and various parts as we design, however, more
          specifically, it serves to develop into the actual 3D
          modeling of the robot as the team concludes how we want
          to tackle a specific problem. As for the rest of the design,
          once we have the master sketches completed, we tend to take
          a more parallel computing-style approach. This affords us
          multiple liberties, as if we haven’t come to a consensus among
          the team as to how a part should function, then we can have team
          members from either side design a different part; or, if they do,
          then we can split that part into different subparts, which not
          only allows everyone to contribute, but ensures a faster uptime.
        </p>
      </div>
    </div>
  )
}
