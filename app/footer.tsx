import Image from "next/image"
import { MutableRefObject, useEffect, useState } from "react"

export default function Footer({
  navbarRef
}: {
  navbarRef: MutableRefObject<HTMLDivElement | null>
}) {
  const [downOffset, setDownOffset] = useState(0)

  useEffect(() => {
    if (
      navbarRef.current &&
      window.visualViewport &&
      window.visualViewport.width < 1024
    )
      setDownOffset(navbarRef.current.getBoundingClientRect().height)
  }, [navbarRef, downOffset])

  return (
    <div
      className="bg-[#151515] w-full"
      style={{ paddingBottom: `${downOffset}px` }}
    >
      <div className="flex flex-row justify-center">
        <div className="bg-roboGray w-full mx-2 lg:mx-10 p-[2px] rounded-xl"></div>
      </div>
      <div className="flex flex-row p-5 lg:px-10 items-center">
        <div className="flex-1 flex items-center justify-start">
          <Image
            src="/stickerlogo.png"
            alt="RoboKnights Logo"
            width={1198 / 16}
            height={1008 / 16}
            className="object-scale-down"
          />
          <h1 className="pl-1 lg:pl-5 text-2xl lg:text-4xl font-semibold">
            RoboKnights
          </h1>
        </div>
        <div className="flex-1 w-0 lg:w-full"></div>
        <div className="flex-1 flex flex-row justify-end">
          <a
            href="https://www.instagram.com/roboknights8569/"
            target="_blank"
            className="pr-3"
          >
            <Image
              src="/icons/instagram.svg"
              alt="Instagram Icon"
              width={800 / 16}
              height={800 / 16}
            />
          </a>
          <a href="https://github.com/ftc8569" target="_blank" className="pr-3">
            <Image
              src="/icons/github.svg"
              alt="Github Icon"
              width={800 / 16}
              height={800 / 16}
            />
          </a>
        </div>
      </div>
    </div>
  )
}
