import {MutableRefObject, useEffect, useRef, useState} from "react";
import Image from "next/image";
import styles from "@/app/navbar.module.css";

export default function Navbar(
  { homeRef, teamRef, programmingRef, mechanicalRef, outreachRef}:
    { homeRef: MutableRefObject<HTMLDivElement | null>, teamRef: MutableRefObject<HTMLDivElement | null>, programmingRef: MutableRefObject<HTMLDivElement | null>, mechanicalRef: MutableRefObject<HTMLDivElement | null>, outreachRef: MutableRefObject<HTMLDivElement | null> }) {
  const thisRef = useRef<HTMLDivElement | null>(null);
  const [navOffset, setNavOffset] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let offset = 0
    if(thisRef.current) {
      const rect = thisRef.current.getBoundingClientRect();
      offset = rect.height + 10;
    }
    setNavOffset(offset);
    const handleScroll = () => {
      const position = window.scrollY;
      /*
      This is the most cooked code I have ever written
      TODO: Fix whatever this is when in a state of clear thinking
       */
      if (homeRef.current && position <= (homeRef.current.getBoundingClientRect().bottom + position - offset)) setCurrent(0);
      else if((homeRef.current && position > (homeRef.current.getBoundingClientRect().bottom + position - offset)) &&
        (teamRef.current && position <= (teamRef.current.getBoundingClientRect().bottom + position - offset))) setCurrent(1);
      else if((teamRef.current && position > (teamRef.current.getBoundingClientRect().bottom + position - offset)) &&
        (programmingRef.current && position <= (programmingRef.current.getBoundingClientRect().bottom + position - offset))) setCurrent(2);
      else if((programmingRef.current && position > (programmingRef.current.getBoundingClientRect().bottom + position - offset)) &&
        (mechanicalRef.current && position <= (mechanicalRef.current.getBoundingClientRect().bottom + position - offset))) setCurrent(3);
      else if((mechanicalRef.current && position > (mechanicalRef.current.getBoundingClientRect().bottom + position - offset)) &&
        (outreachRef.current && position <= (outreachRef.current.getBoundingClientRect().bottom + position - offset))) setCurrent(4);
      else setCurrent(5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [current, homeRef, teamRef, programmingRef, mechanicalRef, outreachRef]);

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
        <NavbarItem title={"Our Team"} current={current == 1} topPixel={(teamRef.current ? teamRef.current?.offsetTop : 0) - navOffset}/>
        <NavbarItem title={"Programming"} current={current == 2} topPixel={(programmingRef.current ? programmingRef.current.offsetTop : 0) - navOffset}/>
        <NavbarItem title={"Mechanical"} current={current == 3} topPixel={(mechanicalRef.current ? mechanicalRef.current.offsetTop : 0) - navOffset}/>
        <NavbarItem title={"Outreach"} current={current == 4} topPixel={(outreachRef.current ? outreachRef.current.offsetTop : 0) - navOffset}/>
        <NavbarItem title={"Contact Us"} current={current == 5} topPixel={0}/>
      </div>
    </div>
  )
}

function NavbarItem({title, current, topPixel}: { title: string, current: boolean, topPixel: number }) {
  return (
    <button onClick={() => scroll({top: topPixel + 1, behavior: "smooth"})}>
      <p
        className={"text-xl mx-2 my-2 inline float-right " + styles.currentNav + " " + (current ? styles.currentNavAdded : styles.currentNavRemoved)}>
        {title}</p>
    </button>
  )
}