import {MutableRefObject} from "react";
import Image from "next/image";

export default function ProgrammingSection({ divRef }: { divRef: MutableRefObject<HTMLDivElement | null> }) {
  return (
    <div ref={divRef} className="px-36 py-10">
      <div className="flex items-center justify-center">
        <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Programming Team</h1>
      </div>
      <div className="flex flex-row pt-5">
        <Image
          src={"/activity/programming-1.png"}
          alt={"Programmer waiting for mech guy"}
          width={4032/6}
          height={1754/6}
          className="rounded-2xl"
        />
        <p className="pl-10 text-xl">
          Java is an amazing programming language known for its
          platform independence, allowing developers to "write
          once, run anywhere." Its robust memory management,
          strong type system, and exception handling make it
          highly reliable and less prone to runtime errors.
          Java's extensive ecosystem of libraries and frameworks,
          like Spring and Hibernate, supports efficient development
          for web, desktop, and enterprise applications. It is also
          the backbone of Android app development, powering millions
          of mobile applications worldwide. With its versatility,
          performance, and scalability, Java remains a top choice
          for developers across industries.</p>
      </div>
      <div className="flex flex-row pt-5">
        <p className="pr-10 text-xl">
          The programming team has been working to create computer vision
          scripts that utilize OpenCV and Limelight 3A. The camera can
          distinguish between the different color samples(blocks) and
          identify their edges. Furthermore, it can estimate the sample's
          position down to a margin of error of only about half a centimeter.
          All this processing is done in real time, achieving 60 frames per
          second, allowing for automated, accurate intake. </p>
        <Image
          src={"/activity/programming-2.png"}
          alt={"Programmer locked in"}
          width={1362/2}
          height={1020/2}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}