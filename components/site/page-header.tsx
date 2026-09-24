import type { ReactNode } from "react"

/*
 * Standard header for an inner page: eyebrow, title, and an optional lede.
 * Carries the top padding that clears the fixed nav.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede
}: {
  eyebrow: string
  title: ReactNode
  lede?: string
}) {
  return (
    <header className="page-header" data-reveal>
      <p className="section-index">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p className="section-lede">{lede}</p>}
    </header>
  )
}
