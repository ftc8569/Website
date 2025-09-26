import { RefObject } from "react"
import Image from "next/image"

export default function OutreachSection({
  divRef
}: {
  divRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div id={"outreach"} ref={divRef} className="px-5 lg:px-36 py-10">
      <div className="flex items-center justify-center">
        <h1 className="inline text-3xl lg:text-4xl p-3 text-roboPink font-extrabold rounded-2xl mt-2 mb-4">
          Outreach Team
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row pt-5 gap-5 lg:gap-10">
        <img
          src={"/activity/outreach-1.png"}
          alt={"Programmer locked in"}
          className="rounded-2xl aspect-video object-cover w-[40vw] max-w-[36rem]"
        />
        <p className="text-sm lg:text-lg">
          The RoboKnights outreach team is dedicated to expanding STEM
          accessibility and fostering a passion for robotics within diverse
          communities. Through a combination of mentorship, hands-on learning
          opportunities, and professional networking, the team strives to
          inspire the next generation of innovators. By collaborating with local
          organizations and educational institutions, RoboKnights works to
          provide students with meaningful exposure to engineering, coding, and
          problem-solving. Outreach efforts emphasize inclusivity, ensuring that
          students from all backgrounds have the resources and encouragement
          needed to explore STEM fields. The team also engages with industry
          professionals and mentors to refine its own knowledge while extending
          support to those looking to develop their technical skills.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row-reverse pt-5 gap-5 lg:gap-10">
        <img
          src={"/activity/outreach-2.png"}
          alt={"Programmer waiting for mech guy"}
          className="rounded-2xl aspect-video object-cover w-[30vw] max-w-[32rem]"
        />
        <p className="text-sm lg:text-lg">
          The RoboKnights outreach team is dedicated to expanding STEM
          accessibility and fostering a passion for robotics within diverse
          communities. Through a combination of mentorship, hands-on learning
          opportunities, and professional networking, the team strives to
          inspire the next generation of innovators. By collaborating with local
          organizations and educational institutions, RoboKnights works to
          provide students with meaningful exposure to engineering, coding, and
          problem-solving. Outreach efforts emphasize inclusivity, ensuring that
          students from all backgrounds have the resources and encouragement
          needed to explore STEM fields. The team also engages with industry
          professionals and mentors to refine its own knowledge while extending
          support to those looking to develop their technical skills.
        </p>
      </div>
    </div>
  )
}
