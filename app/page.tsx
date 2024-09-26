'use client';

import Image from "next/image";
import styles from "./index.module.css"
import {useEffect, useState} from "react";

export default function Home() {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      if(position < 200) setCurrent(0);
      else setCurrent(1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [current]);

  return (
    <main>
      <div className="sticky top-0 flex flex-row w-full bg-roboHotPink justify-between items-center px-4 py-1">
        <div className="flex flex-row">
          <Image
            src="/stickerlogo.png"
            alt="Sticker Logo"
            width={50}
            height={50}
          />
          <h1 className="text-4xl font-semibold pl-4">RoboKnights</h1>
        </div>
        <div className="flex flex-row flex-wrap space-x-4">
          <NavbarItem title={"Home"} current={current == 0} topPixel={0} />
          <NavbarItem title={"Our Team"} current={current == 1} topPixel={0} />
          <NavbarItem title={"Software"} current={false} topPixel={0} />
          <NavbarItem title={"Hardware"} current={false} topPixel={0} />
          <NavbarItem title={"Contact Us"} current={false} topPixel={0} />
        </div>
      </div>
      <div className="flex flex-row h-[2000px]">
        <div className="flex-1 flex flex-col p-10">
          <h1 className="text-3xl font-thin">Team 8569</h1>
          <h1 className="text-6xl p-4 bg-roboPink text-black rounded-2xl w-min mt-1 mb-4">RoboKnights</h1>
          <p className="text-xl">Team 8569 is a competitive high-school robotics team
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
        </div>
        <div className="flex-1">

        </div>
      </div>
    </main>
  );
}

function NavbarItem({title, current, topPixel}: {title: string, current: boolean, topPixel: number}) {
  return (
    <button onClick={() => scroll({top: topPixel, behavior: "smooth"})}>
      <p className={"text-xl mx-2 my-2 inline float-right " + styles.currentNav + " " + (current ? styles.currentNavAdded : styles.currentNavRemoved)}>
        {title}</p>
    </button>
  )
}
