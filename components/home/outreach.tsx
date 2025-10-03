import { RefObject } from "react"
import Image from "next/image"

export default function OutreachSection({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div id={"outreach"} ref={divRef} className="px-5 lg:px-36 py-10">
      <div className="flex gap-6 items-center">
        <div className="w-min bg-stone-800 px-4 pt-3 pb-9 rounded-full">
          <h2 className="writing-vertical-lr font-black text-5xl tracking-[-1.5rem] text-roboPink">
            OUTREACH
          </h2>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 lg:gap-4 basis-0 grow">
            <div className="bg-stone-800 p-4 rounded-2xl">
              <h3 className="font-bold text-2xl mb-2">Our Values</h3>
              <p className="text-sm lg:text-lg">
                <ul className="list-disc ml-6">
                  <li>
                    <i>Inspire</i> the next generation of innovators
                  </li>
                  <li className="font-bold">Inclusivity</li>
                  <ul className="list-disc ml-4">
                    <li>
                      Expanding <i>STEM accessibility</i> to students of all
                      backgrounds
                    </li>
                    <li>
                      Fostering a passion for robotics in{" "}
                      <i>diverse communities</i>
                    </li>
                  </ul>
                </ul>
              </p>
            </div>
            <div className="bg-stone-800 p-4 rounded-2xl">
              <h3 className="font-bold text-2xl mb-2">What We Do</h3>
              <p className="text-sm lg:text-lg">
                <ul className="list-disc ml-6">
                  <li>Mentorship</li>
                  <li>Providing hands-on learning opportunities</li>
                  <li>
                    Collaborating with local organizations and educational
                    institutions
                  </li>
                  <li>
                    Expose students to engineering, programming, and
                    problem-solving
                  </li>
                  <li className="font-bold">
                    Network with industry professionals
                  </li>
                  <ul className="list-disc ml-4">
                    <li>To refine our own knowledge</li>
                    <li>
                      To help others looking to develop their technical skills
                    </li>
                  </ul>
                </ul>
              </p>
            </div>
          </div>
          <img
            src={"/activity/outreach-1.png"}
            alt={"Outreach team working together"}
            className="aspect-video object-cover rounded-2xl w-[50%]"
          />
        </div>
      </div>
    </div>
  )
}
