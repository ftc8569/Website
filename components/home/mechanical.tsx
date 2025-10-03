import { RefObject } from "react"
import Image from "next/image"

export default function MechanicalSection({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      id={"mechanical"}
      ref={divRef}
      className="flex px-5 lg:px-36 py-10 xl:flex-row-reverse flex-col gap-4 xl:gap-6 items-center"
    >
      <div className="w-min bg-stone-800 py-2 px-4 xl:px-4 xl:pt-3 xl:pb-8 rounded-full">
        <h2 className="xl:writing-vertical-lr font-black text-3xl lg:text-5xl xl:tracking-[-1.5rem] text-roboPink xl:uppercase">
          Mechanical
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex lg:flex-row flex-col bg-stone-800 p-4 rounded-2xl gap-4">
          <img
            src={"/activity/mechanical-2.png"}
            alt={"Mechanical team collaborating together on the robot's design"}
            className="aspect-video object-cover rounded-2xl w-[40%] max-w-[32rem] min-w-[16rem] mx-auto"
          />
          <div>
            <h3 className="font-bold text-2xl mb-2">Master Sketches</h3>
            <p className="text-sm lg:text-lg mb-2">
              We have been working on a stable design process through master
              sketches, which have the benefit of:
              <ul className="list-disc ml-6">
                <li>
                  Providing a better <i>frame of reference</i> for:
                </li>
                <ul className="list-disc ml-5">
                  <li>parameters of the robot</li>
                  <li>parts we design</li>
                </ul>
                <li>Serving as a base for developing the 3D model</li>
                <li>
                  Helping us conclude how we want to tackle <i>specific</i>{" "}
                  problems
                </li>
              </ul>
            </p>
          </div>
        </div>
        <div className="bg-stone-800 gap-6 p-4 rounded-2xl flex lg:flex-row flex-col-reverse">
          <div>
            <h3 className="font-bold text-2xl mb-2">Parallel Work</h3>
            <p className="text-sm lg:text-lg mb-2">
              Following master sketches, we spilt into smaller
              groups/individuals so we can be <i>inclusive</i> and work more{" "}
              <i>efficiently</i> in parallel. For this, we usually go down one
              of 2 paths:
              <ol className="ml-6 list-decimal">
                <li>
                  If consensus <b>wasn't</b> reached on a part's function,{" "}
                  <i>different versions</i> can be worked on by members with
                  differing viewpoints.
                </li>
                <li>
                  If consensus <b>was reached</b>, the part can be split into
                  smaller <i>subparts</i> divided among the members.
                </li>
              </ol>
            </p>
          </div>
          <img
            src={"/activity/mechanical-1.png"}
            alt={"2 RoboKnights members working in parallel on the robot"}
            className="aspect-video object-cover rounded-2xl w-[35%] max-w-[32rem] min-w-[16rem] mx-auto"
          />
        </div>
      </div>
      {/* <div>
        <div className="flex flex-col lg:flex-row pt-5 gap-5 lg:gap-10">
          <img
            src={"/activity/mechanical-1.png"}
            alt={"Programmer locked in"}
            className="rounded-2xl aspect-video object-cover w-[40vw] max-w-[36rem]"
          />
        </div>
        <div className="flex flex-col lg:flex-row-reverse pt-5 gap-5 lg:gap-10">
          <Image
            src={"/activity/mechanical-2.png"}
            alt={"Programmer waiting for mech guy"}
            width={4032 / 8}
            height={3024 / 8}
            className="rounded-2xl aspect-video object-cover w-[40vw] max-w-[36rem]"
          />
          <p className="text-sm lg:text-lg">
             
          </p>
        </div>
      </div> */}
    </div>
  )
}
