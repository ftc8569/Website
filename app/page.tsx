'use client';

import {useRef} from "react";
import Navbar from "@/app/navbar";
import HomeContent from "@/app/home";
import Team from "@/app/team";
import ProgrammingSection from "@/app/programming";
import MechanicalSection from "@/app/mechanical";
import OutreachSection from "@/app/outreach";

export default function Home() {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const programmingRef = useRef<HTMLDivElement | null>(null);
  const mechanicalRef = useRef<HTMLDivElement | null>(null);
  const outreachRef = useRef<HTMLDivElement | null>(null);

  return (
    <main>
      <Navbar
        homeRef={homeRef}
        teamRef={teamRef}
        programmingRef={programmingRef}
        mechanicalRef={mechanicalRef}
        outreachRef={outreachRef} />
      <HomeContent divRef={homeRef}/>
      <Team divRef={teamRef}/>
      <ProgrammingSection divRef={programmingRef} />
      <MechanicalSection divRef={mechanicalRef} />
      <OutreachSection divRef={outreachRef} />
      <div className="h-[1000rem]"></div>
    </main>
  );
}