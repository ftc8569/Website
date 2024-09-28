'use client';

import {useEffect, useRef, useState} from "react";
import Navbar from "@/app/navbar";
import HomeContent from "@/app/home";
import Team from "@/app/team";

export default function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const [homeBottom, setHomeBottom] = useState(0);

  useEffect(() => {
    if (homeRef.current != null) {
      const rect = homeRef.current.getBoundingClientRect();
      setHomeBottom(rect.bottom);
    }
  }, [homeBottom]);

  return (
    <main>
      <Navbar homeBottom={homeBottom}/>
      <HomeContent divRef={homeRef}/>
      <Team />
      <div className="h-[1000rem]"></div>
    </main>
  );
}