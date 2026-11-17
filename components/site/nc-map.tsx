/*
 * A simplified outline of North Carolina with a dot for each place our
 * outreach copy names. Coordinates are real longitude/latitude, projected
 * with a plain equirectangular scale. Dots pop in on scroll (data-pop).
 */
const OUTLINE: [number, number][] = [
  [-84.32, 35.0],
  [-84.32, 35.21],
  [-83.9, 35.53],
  [-83.1, 35.78],
  [-82.6, 36.0],
  [-82.0, 36.25],
  [-81.68, 36.59],
  [-75.87, 36.55],
  [-75.7, 36.2],
  [-75.5, 35.6],
  [-75.53, 35.25],
  [-76.0, 35.05],
  [-76.5, 34.7],
  [-77.4, 34.5],
  [-77.9, 33.85],
  [-78.55, 33.86],
  [-79.67, 34.8],
  [-80.8, 34.82],
  [-80.93, 35.1],
  [-82.4, 35.2],
  [-83.1, 35.0]
]

const PLACES = [
  {
    name: "Durham",
    note: "NCSSM, Durham Main Library, Museum of Life & Science, Bull City FLL",
    lon: -78.9,
    lat: 35.99,
    anchor: "start" as const,
    dx: 12,
    dy: 18
  },
  {
    name: "Greensboro",
    note: "Triad Technos, FLL 71079",
    lon: -79.79,
    lat: 36.07,
    anchor: "end" as const,
    dx: -12,
    dy: -10
  },
  {
    name: "Raleigh",
    note: "3rd Southeast Raleigh qualifier",
    lon: -78.64,
    lat: 35.78,
    anchor: "start" as const,
    dx: 12,
    dy: 30
  }
]

const project = (lon: number, lat: number) => ({
  x: (lon + 84.6) * 62 + 10,
  y: (36.85 - lat) * 74 + 10
})

export default function NcMap() {
  const path =
    OUTLINE.map(([lon, lat], index) => {
      const { x, y } = project(lon, lat)
      return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(" ") + " Z"

  return (
    <figure className="nc-map">
      <svg viewBox="0 0 590 240" role="img" aria-labelledby="nc-title" data-pop>
        <title id="nc-title">
          Map of North Carolina marking Durham, Greensboro and Raleigh, where
          our outreach has taken place
        </title>
        <path
          d={path}
          fill="#141416"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {PLACES.map((place) => {
          const { x, y } = project(place.lon, place.lat)
          return (
            <g key={place.name} data-dot>
              <circle cx={x} cy={y} r="12" fill="rgba(255,45,122,0.18)" />
              <circle cx={x} cy={y} r="5" fill="#ff2d7a" />
              <text
                x={x + place.dx}
                y={y + place.dy}
                textAnchor={place.anchor}
                fill="#f5f5f7"
                fontSize="14"
                fontWeight="600"
              >
                {place.name}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>
        <ul className="nc-legend">
          {PLACES.map((place) => (
            <li key={place.name}>
              <strong>{place.name}</strong> {place.note}
            </li>
          ))}
          <li>
            <strong>Further away</strong> Design reviews with teams in Brazil
            and Romania
          </li>
        </ul>
      </figcaption>
    </figure>
  )
}
