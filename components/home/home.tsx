import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Connection, Dot } from "@/components/home/animation.worker"
import RobotAnimation from "@/components/home/robotAnimation"
import { PiMapPinLineBold } from "react-icons/pi"
import { FaCalendarAlt } from "react-icons/fa"
import Dropdown from "../dropdown"

export default function HomeContent({
  divRef,
  navbarRef
}: {
  divRef: RefObject<HTMLDivElement | null>
  navbarRef: RefObject<HTMLDivElement | null>
}) {
  const [offset, setOffset] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)

  const handle_navbar_offset = useCallback(() => {
    if (
      navbarRef.current != null &&
      navbarRef.current.getBoundingClientRect().width >= 1280
    )
      setOffset(navbarRef.current.getBoundingClientRect().height) // Offset for perfect height on home screen (The white bar)
    else setOffset(0)
  }, [navbarRef])

  useEffect(() => {
    window.addEventListener("resize", handle_navbar_offset)
    return () => {
      window.removeEventListener("resize", handle_navbar_offset)
    }
  }, [handle_navbar_offset])

  useEffect(() => {
    handle_navbar_offset()

    const handleScroll = () => {
      if (!divRef.current || !backgroundRef.current) return
      let num =
        Math.floor(
          ((window.scrollY -
            backgroundRef.current.getBoundingClientRect().bottom -
            300) *
            320) /
            divRef.current.getBoundingClientRect().height
        ) + 1
      if (num < 1) num = 1
      if (num > 320) num = 320
      for (let i = 1; i < 321; i++) {
        const element = document.getElementById("robot-" + i)
        if (!element) return
        if (i == num) element.style.display = "block"
        else element.style.display = "none"
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [divRef, handle_navbar_offset])

  useEffect(() => {
    if (!canvasRef.current || !backgroundRef.current || !navbarRef.current)
      return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const worker = new Worker(new URL("./animation.worker.ts", import.meta.url))

    const update_canvas_size = () => {
      // @ts-expect-error it just works
      canvas.width = backgroundRef.current.clientWidth
      canvas.height =
        // @ts-expect-error it just works
        backgroundRef.current.clientHeight -
        // @ts-expect-error it just works
        navbarRef.current.getBoundingClientRect().height

      worker.postMessage({
        type: "resize",
        width: canvas.width,
        height: canvas.height
      })
    }

    update_canvas_size()

    worker.postMessage({
      type: "init",
      width: canvas.width,
      height: canvas.height,
      numDots: 200
    })

    worker.onmessage = (e) => {
      const { dots, connections } = e.data

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      dots.forEach((dot: Dot) => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = "#FFFFFF"
        ctx.fill()
        ctx.closePath()
      })

      connections.forEach((conn: Connection) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(250,45,161,${conn.opacity})`
        ctx.moveTo(conn.x1, conn.y1)
        ctx.lineTo(conn.x2, conn.y2)
        ctx.stroke()
        ctx.closePath()
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      worker.postMessage({
        type: "mouseMove",
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", update_canvas_size)

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect()
      worker.postMessage({
        type: "click",
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    })

    function animate() {
      worker.postMessage({ type: "animate" })
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      worker.terminate()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", update_canvas_size)
    }
  }, [navbarRef])

  const handleContactUsClick = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })

  //const handleBlogClick = () => (window.location.href = "/blog")

  function IntroCard() {
    return (
      <div className="example-3 w-full mx-4 lg:w-[30rem] rounded-lg">
        <div className="inner bg-stone-900">
          <div className="flex flex-col p-4">
            <div className="flex flex-row-reverse gap-x-2 w-full">
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
              <h1 className="text-2xl lg:text-5xl mr-auto pl-2">8569</h1>
            </div>
            <h1 className="text-4xl lg:text-6xl font-semibold py-2 lg:py-2 rounded-2xl w-min mt-1 mb-4">
              RoboKnights
            </h1>
            <h1 className="text-2xl">
              Innovative, Creative, Competitive.
              <br />
              That's the RoboKnights.
            </h1>
            <div className="flex flex-row pt-4 gap-x-4">
              {[
                { text: "Contact Us", func: handleContactUsClick }
                // { text: "Blog", func: handleBlogClick }
              ].map(({ text, func }, index) => (
                <button key={index} onClick={func}>
                  <div className="flex flex-row p-2 border-1 border-roboHotPink rounded-xl gap-x-1 align-middle bg-transparent hover:bg-roboHotPink hover:bg-opacity-10 transition-colors">
                    <h1 className="text-xl">{text}</h1>
                    <Image
                      src={`/icons/arrow-up-right.svg`}
                      alt="Arrow"
                      width={25}
                      height={25}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        id={"home"}
        className="w-full"
        ref={backgroundRef}
        style={{ height: `calc(100vh - ${offset}px)` }}
      >
        <canvas className="w-full h-full" ref={canvasRef} />
        <div className="absolute z-[1] top-1/3 left-1/12 -translate-x-1/12 -translate-y-1/3 noselect">
          <IntroCard />
        </div>
      </div>
      <div className="h-[1px] w-full bg-white"></div>
      <div className="flex flex-row" ref={divRef}>
        <div className="flex-1 flex flex-col p-3 lg:p-10">
          <div className="flex items-center justify-center">
            <h1 className="inline text-2xl text-center lg:text-3xl p-3 text-roboHotPink font-extrabold rounded-2xl my-2">
              RoboKnights - Team 8569
            </h1>
          </div>
          <div className="flex xl:flex-row flex-col-reverse justify-around items-center mt-2 gap-4">
            <div className="flex gap-2 items-center basis-0">
              <PiMapPinLineBold className="w-10 h-10" />
              <span className="text-2xl font-semibold w-max">
                Durham, NC at NCSSM
              </span>
            </div>
            <div className="flex gap-2 items-center basis-0">
              <FaCalendarAlt className="w-10 h-10" />
              <span className="text-2xl font-semibold w-max">Founded 2015</span>
            </div>
          </div>
          <p className="text-sm lg:text-lg pl-2 mt-6">
            We are an FTC (First Tech Challenge) team that is fully affiliated
            with NCSSM (along with Sigma Corns and Aperture Science), which
            originally started as a community team in the Triangle area.
            However, we continue to honor our roots by serving the community,
            partnering with local organizations to maximize impact and reach a
            broader audience. Our motto is “
            <b>Community Once, Community Forever!</b>”
            <br />
            <br />
            Our primary goal is to equip students with the knowledge and
            confidence to excel in STEM fields while fostering strong
            relationships within our community.
          </p>
          <span className="mx-auto px-2 font-bold my-6 text-xl">
            Join us in shaping the future, one robot at a time!
          </span>
          <br />
          <Dropdown title="What is NCSSM?">
            The North Carolina School of Science and Mathematics (NCSSM) is a
            public boarding high school focused on STEM education. Team 8569,
            the RoboKnights, is housed at NCSSM, where all students are able to
            collaborate to design, build, and program robots in a residential
            setting. Supported by the NCSSM foundation for funding, member
            recruitment, and overall support, NCSSM serves as the basis for
            RoboKnights. RoboKnights' participation depends on NCSSM's
            collaboration to develop students' technical and leadership skills
            in preparation for future STEM careers.
          </Dropdown>
        </div>
        <RobotAnimation />
      </div>
    </>
  )
}
