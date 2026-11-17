import Image from "next/image"

import type { SeasonEvent } from "@/components/home/season"
import { Stats } from "@/components/site/ui"

/*
 * One column of event tiles on a thin rail. Server-rendered: every number is
 * in the HTML as its final value, so nothing ever reads "0".
 */
/* At most six photos per event: they fill a 3-up or 2-up grid evenly. */
const photos = (event: SeasonEvent) =>
  [...(event.image ? [event.image] : []), ...(event.photos ?? [])].slice(0, 6)

export default function SeasonTimeline({
  events,
  next
}: {
  events: SeasonEvent[]
  next: { date?: string; title?: string }
}) {
  return (
    <ol className="timeline">
      {events.map((event) => (
        <li className="timeline-item" key={event.id} id={event.id} data-reveal>
          <span className="timeline-dot" aria-hidden="true" />
          <article className="tile timeline-tile">
            <p className="timeline-meta">
              <time>{event.date}</time>
              <span className="chip">{event.kind}</span>
            </p>
            <h2 className="timeline-title">{event.title}</h2>
            <p className="body">{event.body}</p>

            {event.highlight && (
              <div className="timeline-highlight">
                <p className="timeline-big num">{event.highlight.value}</p>
                <p className="timeline-big-label">
                  {event.highlight.label}
                  <span>{event.highlight.detail}</span>
                </p>
              </div>
            )}

            {event.stats && (
              <div className="timeline-stats">
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

            {photos(event).length > 0 && (
              <div
                className={`timeline-photos timeline-photos--${
                  photos(event).length % 3 === 0 ? 3 : 2
                }`}
              >
                {photos(event).map((photo) => (
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
      ))}
      <li className="timeline-item" id="next" data-reveal>
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
