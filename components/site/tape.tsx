import type { CSSProperties } from "react"

/*
 * A strip of gaffer tape with torn ends and a faint paper texture. Purely
 * decorative: one per page, placed on an edge away from text.
 */
export default function Tape({
  color = "pink",
  width = 132,
  style
}: {
  color?: "pink" | "white"
  width?: number
  style?: CSSProperties
}) {
  const fill = color === "pink" ? "#e8457f" : "#e9e6df"
  const id = `tape-${color}`
  return (
    <span
      className="tape"
      aria-hidden="true"
      style={{ ["--tape-w" as string]: `${width}px`, ...style }}
    >
      <svg viewBox="0 0 132 30" preserveAspectRatio="none">
        <defs>
          <filter id={`${id}-paper`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.4"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0"
              result="grain"
            />
            <feComposite in="grain" in2="SourceGraphic" operator="in" />
            <feBlend in2="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
        <path
          d="M3 2 L7 0 L10 3 L13 1 L16 2 L116 1 L119 3 L122 0 L126 2 L129 1 L131 4 L129 8 L132 12 L129 16 L131 21 L128 25 L130 29 L126 27 L122 30 L118 28 L16 29 L12 27 L9 30 L5 28 L1 29 L3 24 L0 20 L3 15 L1 10 L4 6 Z"
          fill={fill}
          fillOpacity={color === "pink" ? 0.92 : 0.88}
          filter={`url(#${id}-paper)`}
        />
      </svg>
    </span>
  )
}
