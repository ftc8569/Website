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

      {/* <p className="text-sm lg:text-lg">
        Robots are cool because they combine advanced technology with real-world
        applications, performing tasks with incredible precision and efficiency.
        They can handle dangerous or repetitive jobs that humans would find
        difficult or boring, like exploring space or assembling intricate
        machinery. Robots also demonstrate the power of artificial intelligence,
        learning and adapting to new environments and challenges. Their ability
        to interact with people and their surroundings opens up exciting
        possibilities in fields like healthcare, education, and entertainment.
        Ultimately, robots embody the future of innovation, blending science
        fiction with reality in a way that sparks imagination and curiosity.
      </p> */}
      <Team divRef={teamRef} />
      <div className="flex items-center justify-center">
        <h1 className="inline text-3xl lg:text-4xl p-3 text-roboHotPink font-extrabold rounded-2xl mt-12 mb-8">
          What We Do
        </h1>
      </div>
      <ProgrammingSection divRef={programmingRef} />
      <MechanicalSection divRef={mechanicalRef} />
      <OutreachSection divRef={outreachRef} />
      <ContactUs divRef={contactRef} />
      <Footer navbarRef={navbarRef} />
    </main>
  )
}
