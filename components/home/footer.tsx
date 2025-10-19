import Image from "next/image"
import { RefObject, useEffect, useState } from "react"

export default function Footer({
  navbarRef
}: {
  navbarRef: RefObject<HTMLDivElement | null>
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
      style={{ paddingBottom: `${downOffset * 2}px` }}
    >
      <div className="flex flex-row justify-center">
        <div className="bg-roboGray w-full mx-2 lg:mx-10 p-[2px] rounded-xl"></div>
      </div>
      <div className="flex lg:flex-row flex-col gap-2 p-5 lg:px-10 items-center">
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
        <div className="flex-1 flex flex-row gap-x-2 justify-end">
          <Image
            src={`/icons/github.svg`}
            alt="GitHub"
            className={`hover:cursor-pointer`}
            onClick={() => window.open("https://github.com/ftc8569")}
            width={40}
            height={40}
          />
          <Image
            src={`/icons/linkedin.svg`}
            alt="LinkedIn"
            className={`hover:cursor-pointer`}
            onClick={() =>
              window.open("https://www.linkedin.com/company/ftc8569")
            }
            width={50}
            height={50}
          />
          <Image
            src={`/icons/instagram.svg`}
            alt="Instagram"
            className={`hover:cursor-pointer`}
            onClick={() =>
              window.open("https://www.instagram.com/roboknights8569/")
            }
            width={50}
            height={50}
          />
        </div>
      </div>
    </div>
  )
}
