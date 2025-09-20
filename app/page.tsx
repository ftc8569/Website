"use client"

import { useRef } from "react"
import Navbar from "@/components/navbar"
import HomeContent from "@/components/home/home"
import Team from "@/components/home/team"
import ProgrammingSection from "@/components/home/programming"
import MechanicalSection from "@/components/home/mechanical"
import OutreachSection from "@/components/home/outreach"
import ContactUs from "@/components/home/contact"
import Footer from "@/components/home/footer"

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
