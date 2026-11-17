import Image from "next/image"
import type { IterationTrack } from "./content"

/*
 * Each subsystem is a left-to-right row of version tiles joined by thin
 * arrows, so V1 sits next to V3. On narrow screens the row scrolls sideways
 * inside its own container (scroll-snap), never the page.
 */
export default function Iteration({ tracks }: { tracks: IterationTrack[] }) {
  return (
    <div className="iterations">
      {tracks.map((track) => (
        <article className="iteration" key={track.id} data-reveal>
          <header className="iteration-head">
            <h3>{track.subsystem}</h3>
            <p className="body">{track.problem}</p>
          </header>
          <div
            className="iteration-rail"
            role="region"
            aria-label={`${track.subsystem} versions`}
            tabIndex={0}
          >
            <ol className="iteration-steps">
              {track.versions.map((version, index) => (
                <li className="iteration-step" key={version.version}>
                  {index > 0 && (
                    <span className="iteration-arrow" aria-hidden="true" />
                  )}
                  <div className="tile iteration-tile">
                    <div className="media media--4x3 media--render">
                      <Image
                        src={version.image}
                        alt={`${track.subsystem} ${version.version}: ${version.title}`}
                        fill
                        sizes="(max-width: 734px) 80vw, 320px"
                      />
                    </div>
                    <div className="iteration-copy">
                      <span className="chip chip--accent">
                        {version.version}
                      </span>
                      <h4>{version.title}</h4>
                      <p className="body">{version.note}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </article>
      ))}
    </div>
  )
}
