"use client";

import Navbar from "@/app/navbar"
import { useRef } from "react"

export default function Blog() {

  const navbarRef = useRef<HTMLDivElement | null>(null)

  return (
    <main>
      <Navbar navbarRef={navbarRef} homePageRefs={null}/>
      <div className="w-1/3 bg-roboHotPink rounded-lg mt-32 ml-10">
        <h1 className="text-6xl p-3 pl-10">RoboKnights Blog</h1>
        <h1 className="text-3xl p-3 pl-10">Where you can hear the minds of great thinkers and doers</h1>
      </div>
    </main>
  )
}