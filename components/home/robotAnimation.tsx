//import { JSX, useEffect, useState } from "react"
import Image from "next/image"

export default function RobotAnimation() {
  // const [images, setImages] = useState<JSX.Element[]>([])
  // const [viewportWidth, setViewportWidth] = useState<number | null>(null)

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setViewportWidth(
  //       window.visualViewport ? window.visualViewport.width : null
  //     )
  //   }

  //   if (viewportWidth && viewportWidth < 1024) return

  //   /*
  //   Split this up into chunks to prevent the lag spike

  //   TODO: Utilize compression to reduce the size of the images
  //    */

  //   const chunks = [
  //     [0, 100],
  //     [100, 200],
  //     [200, 320]
  //   ]

  //   for (let i = 0; i < chunks.length; i++) {
  //     setTimeout(() => {
  //       const imgs: JSX.Element[] = []
  //       for (let i = 1; i <= 320; i++) {
  //         let number = i.toString()
  //         if (number.length == 1) number = `000${number}`
  //         else if (number.length == 2) number = `00${number}`
  //         else if (number.length == 3) number = `0${number}`
  //         imgs.push(
  //           <Image
  //             src={`/robot/${number}.png`}
  //             alt={"Robot Render LOL"}
  //             width={1920}
  //             height={1920}
  //             className="sticky top-20 z-[-1]"
  //             style={i == 1 ? { display: "block" } : { display: "none" }}
  //             id={`robot-${i}`}
  //             key={number}
  //             priority
  //             placeholder={"blur"}
  //             blurDataURL={`/robot/0001.png`}
  //           />
  //         )
  //         setImages([...imgs])
  //       }
  //     }, i * 1000)
  //   }
  // }, [])

  // return <div className="hidden lg:block flex-1">{images}</div>
  return (
    <div className="hidden lg:block my-15 w-[45%] px-10">
      <Image
        src={`/team.jpg`}
        alt={"Robot Render"}
        width={1920}
        height={1920}
        className="z-[-1] rounded-2xl"
        priority
      />
    </div>
  )
}
