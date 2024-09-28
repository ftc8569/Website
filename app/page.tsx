'use client';

import {useEffect, useRef, useState} from "react";
import Navbar from "@/app/navbar";
import HomeContent from "@/app/home";
import Team from "@/app/team";

export default function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const [homeBottom, setHomeBottom] = useState(0);
  const [teamBottom, setTeamBottom] = useState(0);

  useEffect(() => {
    if (homeRef.current != null) {
      const rect = homeRef.current.getBoundingClientRect();
      setHomeBottom(rect.bottom);
    }

    if(teamRef.current != null) {
      const rect = teamRef.current.getBoundingClientRect();
      setTeamBottom(rect.bottom);
    }
  }, [teamBottom]);

  return (
    <main>
      <Navbar homeBottom={homeBottom} teamBottom={teamBottom}/>
      <HomeContent divRef={homeRef}/>
      <Team divRef={teamRef}/>
      <div className="h-[1000rem]"></div>
    </main>
  );
}