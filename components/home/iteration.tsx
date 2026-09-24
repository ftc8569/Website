"use client"

import Image from "next/image"
import type { IterationTrack } from "./content"

/*
 * Iteration tracks are laid out as a literal left-to-right progression rather
 * than a tabbed switcher — seeing V1 next to V3 is the whole point.
 */

export default function Iteration({ tracks }: { tracks: IterationTrack[] }) {
  return (
    <div className="iterations">
      {tracks.map((track) => (
        <article className="iteration" key={track.id} data-reveal>
          <header className="iteration-head">
            <h3>{track.subsystem}</h3>
            <p>{track.problem}</p>
          </header>

          <ol className="iteration-steps">
            {track.versions.map((version, index) => (
              <li className="iteration-step" key={version.version}>
                <div className="iteration-figure">
                  <Image
                    src={version.image}
                    alt={`${track.subsystem} ${version.version} — ${version.title}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 30vw"
                    className="object-contain"
                  />
                  <span className="iteration-badge">{version.version}</span>
                </div>
                <h4>{version.title}</h4>
                <p>{version.note}</p>
                {index < track.versions.length - 1 && (
                  <span className="iteration-arrow" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  )
}
