"use client"

import { useEffect, useRef, useState } from "react"
import Navbar from "@/app/navbar"
import HomeContent from "@/app/home"
import Team from "@/app/team"
import ProgrammingSection from "@/app/programming"
import MechanicalSection from "@/app/mechanical"
import OutreachSection from "@/app/outreach"
import ContactUs from "@/app/contact"
import Footer from "@/app/footer"

export default function Home() {
  const navbarRef = useRef<HTMLDivElement | null>(null)
  const homeRef = useRef<HTMLDivElement | null>(null)
  const teamRef = useRef<HTMLDivElement | null>(null)
  const programmingRef = useRef<HTMLDivElement | null>(null)
  const mechanicalRef = useRef<HTMLDivElement | null>(null)
  const outreachRef = useRef<HTMLDivElement | null>(null)
  const contactRef = useRef<HTMLDivElement | null>(null)

  return (
    <main>
      <Navbar
        navbarRef={navbarRef}
        homePageRefs={{
          homeRef,
          teamRef,
          programmingRef,
          mechanicalRef,
          outreachRef,
          contactRef
        }}
      />
      <HomeContent divRef={homeRef} navbarRef={navbarRef} />
      <Team divRef={teamRef} />
      <ProgrammingSection divRef={programmingRef} />
      <MechanicalSection divRef={mechanicalRef} />
      <OutreachSection divRef={outreachRef} />
      <ContactUs divRef={contactRef} />
      <Footer navbarRef={navbarRef} />
    </main>
  )
}
