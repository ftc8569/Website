import { JSX, RefObject, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Connection, Dot } from "@/app/animation.worker"

export default function HomeContent({
  divRef,
  navbarRef
}: {
  divRef: RefObject<HTMLDivElement | null>
  navbarRef: RefObject<HTMLDivElement | null>
}) {
  const [images, setImages] = useState<JSX.Element[]>([])
  const [offset, setOffset] = useState(0)
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.visualViewport ? window.visualViewport.width : null)
    }
  }, [])

  useEffect(() => {
    if (navbarRef.current != null)
      setOffset(navbarRef.current.getBoundingClientRect().height) // Offset for perfect height on home screen (The white bar)

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
  }, [divRef])

  useEffect(() => {
    if (viewportWidth && viewportWidth < 1024) return

    /*
    Split this up into chunks to prevent the lag spike

    TODO: Utilize compression to reduce the size of the images
     */

    const chunks = [[0, 100], [100, 200], [200, 320]]

    for (let i = 0; i < chunks.length; i++) {
      setTimeout(() => {
        const imgs: JSX.Element[] = []
        for (let i = 1; i <= 320; i++) {
          let number = i.toString()
          if (number.length == 1) number = `000${number}`
          else if (number.length == 2) number = `00${number}`
          else if (number.length == 3) number = `0${number}`
          imgs.push(
            <Image
              src={`/robot/${number}.png`}
              alt={"Robot Render LOL"}
              width={1920}
              height={1920}
              className="sticky top-20 z-[-1]"
              style={i == 1 ? { display: "block" } : { display: "none" }}
              id={`robot-${i}`}
              key={number}
              priority
              placeholder={"blur"}
              blurDataURL={`/robot/0001.png`}
            />
          )
          setImages([...imgs])
        }
      }, i * 1000)
    }

  }, [])

  useEffect(() => {
    if (!canvasRef.current || !backgroundRef.current || !navbarRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if(!ctx) return

    canvas.width = backgroundRef.current.clientWidth
    canvas.height =
      backgroundRef.current.clientHeight -
      navbarRef.current.getBoundingClientRect().height

    const worker = new Worker(new URL('./animation.worker.ts', import.meta.url));

    worker.postMessage({
      type: 'init',
      width: canvas.width,
      height: canvas.height,
      numDots: 150
    });

    worker.onmessage = (e) => {
      const { dots, connections } = e.data;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot: Dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.closePath();
      });

      connections.forEach((conn: Connection) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(250,45,161,${conn.opacity})`;
        ctx.moveTo(conn.x1, conn.y1);
        ctx.lineTo(conn.x2, conn.y2);
        ctx.stroke();
        ctx.closePath();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      worker.postMessage({
        type: 'mouseMove',
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      worker.postMessage({
        type: 'click',
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    });

    function animate() {
      worker.postMessage({ type: 'animate' });
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      worker.terminate();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleContactUsClick = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })

  const handleBlogClick = () =>
    window.location.href = "/blog"

  return (
    <>
      <div
        id={"home"}
        className="w-full"
        ref={backgroundRef}
        style={{ height: `calc(100vh - ${offset}px)` }}
      >
        <canvas className="" ref={canvasRef} />
        <div className="absolute z-[1] top-1/3 left-1/12 -translate-x-1/12 -translate-y-1/3 noselect">
          <div className="w-[30rem] bg-stone-900 opacity-95 rounded-lg">
            <div className="flex flex-col p-3">
              <h1 className="text-2xl lg:text-6xl font-thin pl-2">8569</h1>
              <h1 className="text-4xl lg:text-5xl p-2 lg:p-3 bg-roboPink text-black rounded-2xl w-min mt-1 mb-4">
                RoboKnights
              </h1>
              <h1 className="text-2xl">
                Innovative, Creative, Competitive.
                <br />
                That's the RoboKnights.
              </h1>
              <div className="flex flex-row pt-4 gap-x-4">
                {[
                  { text: "Contact Us", func: handleContactUsClick },
                  { text: "Blog", func: handleBlogClick }
                ].map(({ text, func }, index) => (
                  <button key={index} onClick={func}>
                    <div className="flex flex-row p-3 bg-roboHotPink rounded-xl gap-x-1 align-middle">
                      <h1 className="text-2xl">{text}</h1>
                      <Image
                        src={`/icons/arrow-up-right.svg`}
                        alt="Arrow"
                        width={30}
                        height={30}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-white"></div>
      <div className="flex flex-row" ref={divRef}>
        <div className="flex-1 flex flex-col p-3 lg:p-10">
          <p className="text-sm lg:text-xl pl-2">
            Team 8569 is a competitive high-school robotics team based in
            Durham, North Carolina, dedicated to inspiring the next generation
            of innovators. Our students have the opportunity to develop valuable
            skills in engineering, programming, leadership, and collaboration.
            By designing, building, and programming robots to compete at the
            highest levels, our team fosters creativity, problem-solving, and
            teamwork. Through hands-on experience and mentorship, we aim to
            equip students with the knowledge and confidence to excel in STEM
            fields while building strong relationships within our community.
            Join us in shaping the future, one robot at a time.
          </p>
          <div className="bg-[#151515] p-2 rounded-2xl mt-4">
            <div className="flex items-center justify-center">
              <h1 className="inline text-2xl lg:text-3xl p-3 bg-roboPink text-black rounded-2xl mt-2 mb-4">
                North Carolina School of Science and Mathematics
              </h1>
            </div>
            <p className="text-sm lg:text-xl pl-2">
              The North Carolina School of Science and Mathematics (NCSSM) is a
              renowned public high school focused on STEM education. Team 8569,
              the RoboKnights, is an FTC (FIRST Tech Challenge) team housed at
              NCSSM, where students collaborate to design, build, and program
              robots. The team competes in FTC competitions, tackling challenges
              that require critical thinking and problem-solving skills.
              Supported by NCSSM's academic rigor, the RoboKnights nurture
              creativity and teamwork while exploring real-world engineering
              concepts. Their participation in FTC helps students develop
              valuable technical and leadership skills in preparation for future
              STEM careers.
            </p>
          </div>
          <div className="bg-[#151515] p-2 rounded-2xl mt-4">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl lg:text-3xl p-3 bg-roboPink text-black rounded-2xl inline mt-2 mb-4">
                FIRST Tech Challenge
              </h1>
            </div>
            <p className="text-sm lg:text-xl pl-2">
              FIRST Tech Challenge (FTC) provides high school students with
              hands-on experience in designing, building, and programming
              robots, offering a unique opportunity to apply STEM concepts in
              real-world scenarios. Through FTC, students develop critical
              thinking, problem-solving, and teamwork skills while competing in
              exciting and challenging robotics competitions. The program
              encourages creativity and innovation as students work together to
              solve complex engineering tasks. FTC also offers students access
              to scholarships, internships, and mentorship, opening doors to
              future education and career opportunities in STEM fields. Overall,
              FTC equips students with valuable technical and leadership skills,
              preparing them for success in both college and future careers.
            </p>
          </div>
        </div>
        <div className="hidden lg:block flex-1">{images}</div>
      </div>
    </>
  )
}