/*
 * A real excerpt of our robot code with light Kotlin highlighting. Lines are
 * highlighted one after another as the tile scrolls through the viewport
 * (see data-codelines in components/motion/motion-root.tsx). Nothing types.
 */
/* One pass over the raw source, so markup is never re-matched. */
const TOKENS =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(val|var|if|else|fun|class|override|return|true|false|null)\b|(-?\b\d+(?:\.\d+)?\b)|\b([a-z]\w*)(?=\()/g

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

function highlight(line: string) {
  let html = ""
  let last = 0
  for (const match of line.matchAll(TOKENS)) {
    const index = match.index ?? 0
    html += escape(line.slice(last, index))
    const [token, comment, string, keyword, number, fn] = match
    const kind = comment
      ? "tok-com"
      : string
        ? "tok-str"
        : keyword
          ? "tok-key"
          : number
            ? "tok-num"
            : fn
              ? "tok-fn"
              : ""
    html += kind
      ? `<span class="${kind}">${escape(token)}</span>`
      : escape(token)
    last = index + token.length
  }
  return html + escape(line.slice(last))
}

export default function CodeTile({
  file,
  href,
  lines
}: {
  file: string
  href: string
  lines: string[]
}) {
  return (
    <figure className="code-tile tile">
      <figcaption className="code-head">
        <span className="code-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <a href={href} target="_blank" rel="noreferrer">
          {file}
        </a>
      </figcaption>
      <pre className="code-body" data-codelines tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <span
              className="code-line"
              data-line
              key={index}
              dangerouslySetInnerHTML={{ __html: highlight(line) || " " }}
            />
          ))}
        </code>
      </pre>
    </figure>
  )
}
