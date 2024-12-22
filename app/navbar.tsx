import React, { RefObject, useEffect, useState } from "react"
import Image from "next/image"
import styles from "@/app/navbar.module.css"

export default function Navbar({
  navbarRef,
  homeRef,
  teamRef,
  programmingRef,
  mechanicalRef,
  outreachRef,
  contactRef
}: {
  navbarRef: RefObject<HTMLDivElement | null>
  homeRef: RefObject<HTMLDivElement | null>
  teamRef: RefObject<HTMLDivElement | null>
  programmingRef: RefObject<HTMLDivElement | null>
  mechanicalRef: RefObject<HTMLDivElement | null>
  outreachRef: RefObject<HTMLDivElement | null>
  contactRef: RefObject<HTMLDivElement | null>
}) {
  const [current, setCurrent] = useState(0)
  const [background, setBackground] = useState(false) // false = transparent, true = blurry

  useEffect(() => {
    let offset = 0
    if (navbarRef.current) {
      const rect = navbarRef.current.getBoundingClientRect()
      offset = rect.height + 10
    }
    const handleScroll = () => {
      const position = window.scrollY

      if(position > 0) setBackground(true)
      else setBackground(false)

      /*
      This is the most cooked code I have ever written
      TODO: Fix whatever this is when in a state of clear thinking
       */
      if (
        homeRef.current &&
        position <=
          homeRef.current.getBoundingClientRect().bottom + position - offset
      )
        setCurrent(0)
      else if (
        homeRef.current &&
        position >
          homeRef.current.getBoundingClientRect().bottom + position - offset &&
        teamRef.current &&
        position <=
          teamRef.current.getBoundingClientRect().bottom + position - offset
      )
        setCurrent(1)
      else if (
        teamRef.current &&
        position >
          teamRef.current.getBoundingClientRect().bottom + position - offset &&
        programmingRef.current &&
        position <=
          programmingRef.current.getBoundingClientRect().bottom +
            position -
            offset
      )
        setCurrent(2)
      else if (
        programmingRef.current &&
        position >
          programmingRef.current.getBoundingClientRect().bottom +
            position -
            offset &&
        mechanicalRef.current &&
        position <=
          mechanicalRef.current.getBoundingClientRect().bottom +
            position -
            offset
      )
        setCurrent(3)
      else if (
        mechanicalRef.current &&
        position >
          mechanicalRef.current.getBoundingClientRect().bottom +
            position -
            offset &&
        outreachRef.current &&
        position <=
          outreachRef.current.getBoundingClientRect().bottom + position - offset
      )
        setCurrent(4)
      else setCurrent(5)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [
    current,
    navbarRef,
    homeRef,
    teamRef,
    programmingRef,
    mechanicalRef,
    outreachRef
  ])

  return (
    <div
      className="fixed bottom-0 lg:sticky lg:top-0 flex flex-row w-full justify-between
      items-center px-4 py-1 z-[2] transition-all duration-[750ms]"
      ref={navbarRef}
      style={{background: background ? "rgba(39,39,39,0.98)" : "rgba(0,0,0,0)"}}
    >
      <div className="hidden lg:flex flex-row">
        <Image
          src="/stickerlogo.png"
          alt="Sticker Logo"
          width={50}
          height={50}
          priority
        />
        <h1 className="text-4xl font-semibold pl-4">RoboKnights</h1>
      </div>
      <div className="flex flex-row flex-wrap space-x-2 lg:space-x-8">
        <NavbarItem title={"Home"} current={current == 0} ref={
          new class implements React.RefObject<HTMLDivElement | null> {
          current: HTMLDivElement | null = null
        }} />
        <NavbarItem
          title={"Team"}
          current={current == 1}
          ref={teamRef}
        />
        <NavbarItem
          title={"Programming"}
          current={current == 2}
          ref={programmingRef}
        />
        <NavbarItem
          title={"Mechanical"}
          current={current == 3}
          ref={mechanicalRef}
        />
        <NavbarItem
          title={"Outreach"}
          current={current == 4}
          ref={outreachRef}
        />
        <NavbarItem
          title={"Contact Us"}
          current={current == 5}
          ref={contactRef}
        />
      </div>
    </div>
  )
}

function NavbarItem({
  title,
  current,
  ref
}: {
  title: string
  current: boolean
  ref: RefObject<HTMLDivElement | null>
}) {
  return (
    <button onClick={
      () => scroll({
        top: (ref.current != null ? ref.current.offsetTop : 0) + 1,
        behavior: "smooth"
      })
    }>
      <p
        className={
          "text-xs lg:text-xl my-2 inline float-right " +
          styles.currentNav +
          " " +
          (current ? styles.currentNavAdded : styles.currentNavRemoved)
        }
      >
        {title}
      </p>
    </button>
  )
}
