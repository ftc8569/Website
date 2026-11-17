import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

/*
 * Shared building blocks for the dark design system. Every page composes
 * these instead of inventing its own card, stat or header styles.
 */

export const CONTACT_EMAIL = "ftcteam8569@roboknights.net"

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/ftc8569" },
  { label: "Instagram", href: "https://www.instagram.com/roboknights8569/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ftc8569" }
]

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
  as: Heading = "h2"
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  align?: "center" | "left"
  as?: "h1" | "h2"
}) {
  return (
    <header
      className={`section-head${align === "left" ? " section-head--left" : ""}`}
      data-reveal
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading className="headline">{title}</Heading>
      {sub && <p className="subhead">{sub}</p>}
    </header>
  )
}

/* Inner-page hero: full-bleed colour photo with a bottom gradient. */
export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  imagePosition = "center",
  tall,
  children
}: {
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
  image: string
  imagePosition?: string
  tall?: boolean
  children?: ReactNode
}) {
  return (
    <header className={`page-hero${tall ? " page-hero--tall" : ""}`}>
      <div className="page-hero-media" aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: imagePosition }}
        />
      </div>
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {sub && <p className="subhead">{sub}</p>}
        {children}
      </div>
    </header>
  )
}

/* Text-only page header for pages without a hero photo. */
export function PageHead({
  eyebrow,
  title,
  sub
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
}) {
  return (
    <header className="page-head">
      <div className="wrap">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {sub && <p className="subhead">{sub}</p>}
      </div>
    </header>
  )
}

/* Apple-style sticky in-page nav that sits under the main bar. */
export function LocalNav({
  title,
  links,
  action
}: {
  title: string
  links: { href: string; label: string }[]
  action?: { href: string; label: string; external?: boolean }
}) {
  return (
    <nav className="localnav" aria-label={`${title} sections`}>
      <div className="wrap--media localnav-inner">
        <span className="localnav-title">{title}</span>
        <ul className="localnav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        {action &&
          (action.external ? (
            <a
              className="localnav-action more"
              href={action.href}
              target="_blank"
              rel="noreferrer"
            >
              {action.label}
            </a>
          ) : (
            <Link className="localnav-action more" href={action.href}>
              {action.label}
            </Link>
          ))}
      </div>
    </nav>
  )
}

export type Stat = { value: string; label: string }

/* Numbers are rendered as final values in the HTML. Nothing counts up. */
export function Stats({
  items,
  strip,
  cols
}: {
  items: Stat[]
  strip?: boolean
  cols?: number
}) {
  return (
    <dl
      className={`stats${strip ? " stats--strip" : ""}`}
      style={{ ["--cols" as string]: cols ?? items.length }}
    >
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd className="num">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function MoreLink({
  href,
  children,
  external
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  if (external || href.startsWith("http") || href.startsWith("mailto:"))
    return (
      <a
        className="more"
        href={href}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer" }
          : {})}
      >
        {children}
      </a>
    )
  return (
    <Link className="more" href={href}>
      {children}
    </Link>
  )
}

/* Neutral placeholder for anyone without a photo. */
export function Silhouette() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <rect width="100" height="100" fill="#1d1d20" />
      <circle cx="50" cy="40" r="16" fill="#3a3a3e" />
      <path d="M20 92c3-20 15-31 30-31s27 11 30 31z" fill="#3a3a3e" />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}
