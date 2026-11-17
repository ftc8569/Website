"use client"

import Image from "next/image"
import { useState } from "react"

/*
 * Drag to compare the sideplate's plain geometry with its stress map. Both
 * sides are the same FEA export; the left one is shown without the colour
 * scale so the cut-outs read as the part itself.
 */
export default function FeaSlider() {
  const [split, setSplit] = useState(50)
  return (
    <div className="fea" style={{ ["--split" as string]: `${split}%` }}>
      <div className="fea-frame">
        <Image
          className="fea-stress"
          src="/worlds/fea.webp"
          alt="Finite element stress map of the drivetrain sideplate, blue for low stress through red for high"
          fill
          sizes="(max-width: 734px) 100vw, 400px"
        />
        <Image
          className="fea-plain"
          src="/worlds/fea.webp"
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 734px) 100vw, 400px"
        />
        <span className="fea-handle" aria-hidden="true" />
        <span className="fea-tag fea-tag--left" aria-hidden="true">
          Plate
        </span>
        <span className="fea-tag fea-tag--right" aria-hidden="true">
          Stress
        </span>
      </div>
      <label className="sr-only" htmlFor="fea-range">
        Compare the plain sideplate with its stress map
      </label>
      <input
        id="fea-range"
        className="fea-range"
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(event) => setSplit(Number(event.target.value))}
      />
    </div>
  )
}
