import {MutableRefObject} from "react";
import Image from "next/image";

export default function OutreachSection({ divRef }: { divRef: MutableRefObject<HTMLDivElement | null> }) {
  return (
    <div ref={divRef} className="px-36 py-10">
      <div className="flex items-center justify-center">
        <h1 className="inline text-4xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">Outreach Team</h1>
      </div>
      <div className="flex flex-row pt-5">
        <Image
          src={"/activity/outreach-1.png"}
          alt={"Programmer locked in"}
          width={2896 / 8}
          height={2042 / 8}
          className="rounded-2xl"
        />
        <p className="pl-10 text-xl">
          Pink pants make a bold fashion statement, offering a vibrant
          and confident way to express individuality. Their bright
          color stands out, allowing wearers to break away from
          traditional neutrals and embrace a more playful style.
          Pink pants can symbolize creativity and self-assurance,
          making them an important piece in a modern wardrobe.
          They also provide versatility, working well in both casual
          and formal settings when paired with the right accessories
          and clothing. Ultimately, pink pants showcase the power
          of color in fashion, proving that clothing can be a reflection
          of personal identity and confidence.</p>
      </div>
      <div className="flex flex-row pt-5">
        <p className="pr-10 text-xl">
          Legos hold a unique significance as both a beloved toy
          and a powerful educational tool. These colorful interlocking
          bricks inspire creativity and imagination in children
          and adults alike, allowing them to build everything
          from simple structures to complex designs. Beyond fun,
          Legos also teach important problem-solving skills,
          encouraging users to think spatially and work through
          challenges. In classrooms and STEM programs, Legos
          have become an essential tool for introducing students
          to engineering, programming, and robotics through
          hands-on learning. The versatility and timeless appeal
          of Legos make them an enduring symbol of innovation,
          creativity, and the joy of building.</p>
        <Image
          src={"/activity/outreach-2.png"}
          alt={"Programmer waiting for mech guy"}
          width={968 / 2}
          height={812 / 2}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}