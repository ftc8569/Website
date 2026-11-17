/*
 * The driver-automation cycle as an SVG, so its strokes can draw themselves
 * on scroll. States follow the Software page copy: intake, index, shoot,
 * then back to idle. One button press starts the cycle.
 */
const STATES = [
  { id: "idle", label: "Idle", x: 70, y: 110 },
  { id: "intake", label: "Intake", x: 230, y: 40 },
  { id: "index", label: "Index", x: 390, y: 110 },
  { id: "shoot", label: "Shoot", x: 230, y: 180 }
]

export default function StateMachine() {
  return (
    <div className="media media--4x3 media--diagram">
      <svg
        viewBox="0 0 460 220"
        role="img"
        aria-labelledby="sm-title"
        data-draw
      >
        <title id="sm-title">
          State machine: one button press moves from idle to intake, index and
          shoot, then back to idle
        </title>
        <defs>
          <marker
            id="sm-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="#a1a1a6" />
          </marker>
        </defs>
        <g fill="none" stroke="#a1a1a6" strokeWidth="1.5">
          <path d="M112 92 Q150 50 182 46" markerEnd="url(#sm-arrow)" />
          <path d="M278 46 Q330 52 352 88" markerEnd="url(#sm-arrow)" />
          <path d="M352 132 Q320 172 278 176" markerEnd="url(#sm-arrow)" />
          <path d="M182 176 Q140 170 110 130" markerEnd="url(#sm-arrow)" />
        </g>
        {STATES.map((state) => (
          <g key={state.id}>
            <rect
              x={state.x - 46}
              y={state.y - 20}
              width="92"
              height="40"
              rx="20"
              fill="none"
              stroke={state.id === "idle" ? "#ff2d7a" : "#f5f5f7"}
              strokeWidth="1.5"
            />
            <text
              x={state.x}
              y={state.y + 5}
              textAnchor="middle"
              fill="#f5f5f7"
              fontSize="14"
              fontWeight="600"
              data-draw-label
            >
              {state.label}
            </text>
          </g>
        ))}
        <text
          x="70"
          y="70"
          textAnchor="middle"
          fill="#a1a1a6"
          fontSize="11"
          data-draw-label
        >
          one button
        </text>
      </svg>
    </div>
  )
}
