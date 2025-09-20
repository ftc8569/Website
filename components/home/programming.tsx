import { RefObject } from "react"
import Image from "next/image"

export default function ProgrammingSection({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div id={"programming"} ref={divRef} className="px-5 lg:px-36 py-10">
      <div className="flex items-center justify-center">
        <h1 className="inline text-3xl lg:text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">
          Programming Team
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row pt-5 gap-5 lg:gap-10">
        <Image
          src={"/activity/programming-1.png"}
          alt={"Programmer waiting for mech guy"}
          width={4032 / 6}
          height={1754 / 6}
          className="object-contain rounded-2xl"
        />
        <p className="text-sm lg:text-xl">
          This year we have been working to develop advanced control systems to
          improve the robot's performance. Our team has been working on PID controllers
          for the control of our arm mechanism and it has greatly improved our control
          and maneuverability. We are also working on using Choreo, ported to FTC, to improve
          pathing and speed up our autos.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row-reverse pt-5 gap-5 lg:gap-10">
        <Image
          src={"/activity/programming-2.png"}
          alt={"Programmer locked in"}
          width={1362 / 2}
          height={1020 / 2}
          className="rounded-2xl"
        />
        <p className="text-sm lg:text-xl">
          The programming team has been working to create computer vision
          scripts that utilize OpenCV and Limelight 3A. The camera can
          distinguish between the different color samples(blocks) and identify
          their edges. Furthermore, it can estimate the sample's position down
          to a margin of error of only about half a centimeter. All this
          processing is done in real time, achieving 60 frames per second,
          allowing for automated, accurate intake.{" "}
        </p>
      </div>
    </div>
  )
}
