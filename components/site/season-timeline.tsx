import Image from "next/image"

import type { SeasonEvent } from "@/components/home/season"
import Tape from "@/components/site/tape"
import { Stats } from "@/components/site/ui"

/* At most six grid photos per event: they fill a 3-up or 2-up grid evenly. */
const gridPhotos = (event: SeasonEvent) => (event.photos ?? []).slice(0, 6)

/*
 * One column of event tiles on a thin rail. Server-rendered: every number is
 * in the HTML as its final value, so nothing ever reads "0".
 */
export default function SeasonTimeline({
  events,
  next
}: {
  events: SeasonEvent[]
  next: { date?: string; title?: string }
}) {
  return (
    <ol className="timeline">
      {events.map((event, index) => {
        const lead = event.lead ?? event.image
        const grid = gridPhotos(event)
        return (
          <li className="timeline-item" key={event.id} id={event.id} data-slide>
            <span className="timeline-dot" aria-hidden="true" />
            <article className="tile timeline-tile">
              {index === 0 && (
                <Tape
                  color="pink"
                  style={{
                    top: -12,
                    right: 40,
                    ["--tape-r" as string]: "5deg"
                  }}
                />
              )}
              <p className="timeline-meta">
                <time>{event.date}</time>
                <span className="chip">{event.kind}</span>
              </p>
              <h2 className="timeline-title">{event.title}</h2>
              <p className="body">{event.body}</p>

              {lead && (
                <div className="media media--16x9 timeline-lead" data-parallax>
                  <Image
                    src={lead.src}
                    alt={lead.alt}
                    fill
                    sizes="(max-width: 1028px) 100vw, 900px"
                    style={{ objectPosition: lead.position ?? "center" }}
                  />
                </div>
              )}

              {event.highlight && (
                <div className="timeline-highlight">
                  {event.scoreboard && (
                    <div className="timeline-scoreboard" aria-hidden="true">
                      <Image
                        src={event.scoreboard}
                        alt=""
                        fill
                        sizes="600px"
                        style={{ objectPosition: "50% 40%" }}
                      />
                    </div>
                  )}
                  <p className="timeline-big num">{event.highlight.value}</p>
                  <p className="timeline-big-label">
                    {event.highlight.label}
                    <span>{event.highlight.detail}</span>
                  </p>
                </div>
              )}

              {event.stats && (
                <div className="timeline-stats" data-odometer>
                  <Stats items={event.stats} />
                </div>
              )}

              {event.findings && (
                <table className="findings">
                  <caption className="sr-only">
                    What each platform was best for
                  </caption>
                  <thead>
                    <tr>
                      {event.findings.map((row) => (
                        <th scope="col" key={row.channel}>
                          {row.channel}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {event.findings.map((row) => (
                        <td key={row.channel}>{row.result}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}

              {grid.length > 0 && (
                <div
                  className={`timeline-photos timeline-photos--${
                    grid.length % 3 === 0 ? 3 : 2
                  }`}
                >
                  {grid.map((photo) => (
                    <div className="media media--4x3" key={photo.src}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 734px) 50vw, 300px"
                        style={{ objectPosition: photo.position ?? "center" }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {event.credit && (
                <p className="caption timeline-credit">{event.credit}</p>
              )}
            </article>
          </li>
        )
      })}
      <li className="timeline-item" id="next" data-slide>
        <span className="timeline-dot timeline-dot--open" aria-hidden="true" />
        <article className="tile timeline-tile">
          <p className="timeline-meta">
            <time>{next.date ?? "Next"}</time>
            <span className="chip">Next event</span>
          </p>
          <h2 className="timeline-title">{next.title ?? "Next event"}</h2>
          <p className="body">
            {next.title
              ? "We'll post what happened here afterwards."
              : "We'll add the next event after it happens."}
          </p>
        </article>
      </li>
    </ol>
  )
}
