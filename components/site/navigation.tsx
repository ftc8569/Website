"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export const NAV_LINKS = [
  { href: "/season", label: "Season" },
  { href: "/robot", label: "Robot" },
  { href: "/software", label: "Software" },
  { href: "/outreach", label: "Outreach" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" }
]

export default function SiteNavigation() {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null)
        toggleRef.current?.focus()
      }
    }
    const resize = () => {
      if (window.innerWidth > 833) setOpenPath(null)
    }
    document.addEventListener("keydown", keyboard)
    window.addEventListener("resize", resize)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", keyboard)
      window.removeEventListener("resize", resize)
      document.body.style.overflow = ""
    }
  }, [open])

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)
  const close = () => setOpenPath(null)

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="nav" aria-label="Primary">
        <div className="wrap--media nav-inner">
          <Link className="nav-brand" href="/" onClick={close}>
            <Image src="/assets/logo.png" alt="" width={24} height={24} />
            RoboKnights <span>8569</span>
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="nav-contact"
            href="/contact"
            aria-current={isCurrent("/contact") ? "page" : undefined}
          >
            Contact
          </Link>
          <button
            ref={toggleRef}
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div id="nav-menu" className="nav-menu" data-open={open} inert={!open}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                onClick={close}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="btn" href="/contact" onClick={close}>
          Contact us
        </Link>
      </div>
    </>
  )
}
