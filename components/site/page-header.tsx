import type { ReactNode } from "react"
import Image from "next/image"

/*
 * Standard header for an inner page: eyebrow, title, and an optional lede.
 * Carries the top padding that clears the fixed nav. An optional background
 * image sits behind the copy, darkened so the type stays legible.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  image
}: {
  eyebrow: string
  title: ReactNode
  lede?: string
  image?: string
}) {
  return (
    <header
      className={`page-header${image ? " page-header--image" : ""}`}
      data-reveal
    >
      {image && (
        <>
          <div className="page-header-bg" aria-hidden="true">
            <Image src={image} alt="" fill priority sizes="100vw" />
          </div>
          <div className="page-header-shade" aria-hidden="true" />
        </>
      )}
      <p className="section-index">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p className="section-lede">{lede}</p>}
    </header>
  )
}
