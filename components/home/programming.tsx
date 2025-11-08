import { RefObject } from "react"
import Image from "next/image"

export default function ProgrammingSection({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div id={"programming"} ref={divRef} className="px-5 lg:px-36 pb-10">
      {/* <div className="flex items-center justify-center">
        <h1 className="inline text-3xl lg:text-4xl p-3 text-roboPink font-extrabold rounded-2xl mt-2 mb-4">
          Programming Team
        </h1>
      </div> */}
      <div className="flex xl:flex-row flex-col gap-2 xl:gap-6 items-center">
        <div className="w-min bg-stone-800 pt-2 pb-2 px-4 xl:px-4 xl:pt-3 xl:pb-8 rounded-full">
          <h2 className="xl:writing-vertical-lr font-black text-3xl lg:text-5xl xl:tracking-[-1.5rem] text-roboPink xl:uppercase">
            Programming
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row pt-5 gap-4 lg:gap-4 items-center">
            <img
              src={"/activity/programming-1.png"}
              alt={"Programmer waiting for mech guy"}
              className="aspect-video object-cover rounded-2xl xl:w-[40%] w-full max-w-[32rem]"
            />
            <div className="bg-stone-800 p-4 rounded-2xl">
              <h3 className="font-bold text-2xl mb-2">
                Control &amp; Autonomous
              </h3>
              <p className="text-sm lg:text-lg mb-2">
                We have been working to develop advanced control systems and{" "}
                <i>PID controllers</i> for our arm mechanism, which have greatly
                improved our control and maneuverability.
                <br />
                <br />
                We are also working on devloping <i>full robot simulations</i>,
                to speed up development and enable asynchronous work.
              </p>
            </div>
          </div>
          <div className="bg-stone-800 p-4 rounded-2xl flex lg:flex-row flex-col-reverse gap-3">
            <div>
              <h3 className="font-bold text-2xl mb-2">Computer Vision</h3>
              <p className="text-sm lg:text-lg mb-2">
                We also have been working with computer vision-utilizing{" "}
                <i>OpenCV and a Limelight 3A</i>.
              </p>
              <p className="text-sm lg:text-lg">Our system can:</p>
              <ul className="list-disc ml-6">
                <li>Distinguish between sample (block) colors</li>
                <li>Identify block edges</li>
                <li>
                  Estimate block position to a <i>~0.5cm accuracy</i>
                </li>
                <li>
                  Runs efficiently at <i>60fps</i>
                </li>
              </ul>
            </div>
            <img
              src={"/activity/programming-2.png"}
              alt={"Programmer locked in"}
              className="rounded-2xl aspect-video object-contain w-[25vw]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
