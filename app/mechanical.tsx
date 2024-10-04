import { MutableRefObject } from "react"
import Image from "next/image"

export default function MechanicalSection({
  divRef
}: {
  divRef: MutableRefObject<HTMLDivElement | null>
}) {
  return (
    <div ref={divRef} className="px-5 lg:px-36 py-10">
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
          Robots are cool because they combine advanced technology with
          real-world applications, performing tasks with incredible precision
          and efficiency. They can handle dangerous or repetitive jobs that
          humans would find difficult or boring, like exploring space or
          assembling intricate machinery. Robots also demonstrate the power of
          artificial intelligence, learning and adapting to new environments and
          challenges. Their ability to interact with people and their
          surroundings opens up exciting possibilities in fields like
          healthcare, education, and entertainment. Ultimately, robots embody
          the future of innovation, blending science fiction with reality in a
          way that sparks imagination and curiosity.
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
          Carbon fiber is an incredibly strong yet lightweight material that has
          revolutionized industries ranging from aerospace to sports equipment.
          Its high strength-to-weight ratio makes it ideal for applications
          where both durability and weight reduction are critical. Carbon
          fiber’s resistance to corrosion and ability to withstand extreme
          temperatures add to its versatility, allowing it to be used in harsh
          environments. Despite being lighter than steel, it is significantly
          stronger, making it a go-to material for cutting-edge engineering
          designs. Whether in aircraft, automobiles, or high-performance bikes,
          carbon fiber continues to transform modern technology with its
          remarkable properties.
        </p>
      </div>
    </div>
  )
}
