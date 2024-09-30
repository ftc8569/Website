import {MutableRefObject, useEffect, useState} from "react";
import Image from "next/image";

export default function HomeContent({ divRef }: { divRef: MutableRefObject<HTMLDivElement | null >}) {
  const [image, setImage] = useState<string>("0001");

  useEffect(() => {
    const handleScroll = () => {
      if(!divRef.current) return;
      let num = Math.floor(((window.scrollY)*320)/(divRef.current.getBoundingClientRect().height-270))+1
      if(num < 1) num = 1
      if(num > 320) num = 320
      let number = num.toString()
      if(number.length == 1) number = `000${number}`
      else if(number.length == 2) number = `00${number}`
      else if(number.length == 3) number = `0${number}`
      setImage(number);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [divRef])

  return (
    <div className="flex flex-row" ref={divRef}>
      <div className="flex-1 flex flex-col p-10">
        <h1 className="text-3xl font-thin">Team 8569</h1>
        <h1 className="text-6xl p-4 bg-roboPink text-black rounded-2xl w-min mt-1 mb-4">RoboKnights</h1>
        <p className="text-xl pl-2">Team 8569 is a competitive high-school robotics team
          based in Durham, North Carolina, dedicated to inspiring
          the next generation of innovators. Our students have
          the opportunity to develop valuable skills in engineering,
          programming, leadership, and collaboration. By designing,
          building, and programming robots to compete at the highest
          levels, our team fosters creativity, problem-solving,
          and teamwork. Through hands-on experience and mentorship,
          we aim to equip students with the knowledge and confidence
          to excel in STEM fields while building strong relationships
          within our community. Join us in shaping the future, one
          robot at a time.</p>
        <div className="bg-[#151515] p-2 rounded-2xl mt-4">
          <div className="flex items-center justify-center">
            <h1 className="inline text-3xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">North Carolina School of
              Science and Mathematics</h1>
          </div>
          <p className="text-xl pl-2">The North Carolina School of
            Science and Mathematics (NCSSM) is a renowned public high
            school focused on STEM education. Team 8569, the RoboKnights,
            is an FTC (FIRST Tech Challenge) team housed at NCSSM, where
            students collaborate to design, build, and program robots.
            The team competes in FTC competitions, tackling challenges
            that require critical thinking and problem-solving skills.
            Supported by NCSSM's academic rigor, the RoboKnights nurture
            creativity and teamwork while exploring real-world engineering
            concepts. Their participation in FTC helps students develop
            valuable technical and leadership skills in preparation for
            future STEM careers.</p>
        </div>
        <div className="bg-[#151515] p-2 rounded-2xl mt-4">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl p-3 bg-roboPink text-black rounded-2xl inline mt-2 mb-4">FIRST Tech Challenge</h1>
          </div>
          <p className="text-xl pl-2">FIRST Tech Challenge (FTC)
            provides high school students with hands-on experience in designing,
            building, and programming robots, offering a unique opportunity
            to apply STEM concepts in real-world scenarios. Through FTC,
            students develop critical thinking, problem-solving, and teamwork
            skills while competing in exciting and challenging robotics
            competitions. The program encourages creativity and innovation
            as students work together to solve complex engineering tasks. FTC
            also offers students access to scholarships, internships, and
            mentorships, opening doors to future education and career opportunities
            in STEM fields. Overall, FTC equips students with valuable technical
            and leadership skills, preparing them for success in both college
            and future careers.</p>
        </div>
      </div>
      <div className="flex-1">
        <Image
          src={`/robot/${image}.png`}
          alt={"Robot Render LOL"}
          width={1920}
          height={1080}
          className="sticky top-20 z-[-1]"
        />
      </div>
    </div>
  )
}