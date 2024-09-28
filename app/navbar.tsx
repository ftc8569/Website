import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import styles from "@/app/navbar.module.css";

export default function Navbar({homeBottom}: { homeBottom: number }) {
  const thisRef = useRef<HTMLDivElement | null>(null);
  const [navOffset, setNavOffset] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let offset = 0
    if(thisRef.current) {
      const rect = thisRef.current.getBoundingClientRect();
      offset = rect.height*2;
    }
    setNavOffset(offset);
    const handleScroll = () => {
      const position = window.scrollY;
      if (position < (homeBottom - offset)) setCurrent(0);
      else setCurrent(1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [current, homeBottom]);

  return (
    <div className="sticky top-0 flex flex-row w-full bg-roboHotPink justify-between items-center px-4 py-1" ref={thisRef}>
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
        <NavbarItem title={"Home"} current={current == 0} topPixel={0}/>
        <NavbarItem title={"Our Team"} current={current == 1} topPixel={homeBottom-navOffset}/>
        <NavbarItem title={"Software"} current={false} topPixel={0}/>
        <NavbarItem title={"Hardware"} current={false} topPixel={0}/>
        <NavbarItem title={"Contact Us"} current={false} topPixel={0}/>
      </div>
    </div>
  )
}

function NavbarItem({title, current, topPixel}: { title: string, current: boolean, topPixel: number }) {
  return (
    <button onClick={() => scroll({top: topPixel, behavior: "smooth"})}>
      <p
        className={"text-xl mx-2 my-2 inline float-right " + styles.currentNav + " " + (current ? styles.currentNavAdded : styles.currentNavRemoved)}>
        {title}</p>
    </button>
  )
}