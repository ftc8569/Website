"use client"

import type { RefObject } from "react"
import SiteNavigation from "@/components/site/navigation"

type NavbarProps = {
  navbarRef: RefObject<HTMLDivElement | null>
  homePageRefs: {
    homeRef: RefObject<HTMLDivElement | null>
    teamRef: RefObject<HTMLDivElement | null>
    programmingRef: RefObject<HTMLDivElement | null>
    mechanicalRef: RefObject<HTMLDivElement | null>
    outreachRef: RefObject<HTMLDivElement | null>
    contactRef: RefObject<HTMLDivElement | null>
  } | null
}

// Retain the legacy signature while routing every consumer through the same
// working destinations and accessible mobile controls as the redesigned site.
export default function Navbar({ navbarRef }: NavbarProps) {
  return (
    <div className="launch-site" ref={navbarRef}>
      <SiteNavigation />
    </div>
  )
}
