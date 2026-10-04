"use client"

import Image from "next/image"
import Link, { useLinkStatus } from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export const NAV_LINKS = [
  { href: "/robot", label: "Robot" },
  { href: "/software", label: "Software" },
  { href: "/outreach", label: "Outreach" },
  { href: "/team", label: "Team" }
]

function NavigationFeedback() {
  const { pending } = useLinkStatus()
  return pending ? (
    <span className="navigation-pending" role="status">
      <span className="sr-only">Loading page</span>
    </span>
  ) : null
}

export default function SiteNavigation() {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const menuOpen = openPath === pathname
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const dismiss = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenPath(null)
    }
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null)
        toggleRef.current?.focus()
      }
    }
    const resize = () => {
      if (window.innerWidth > 900) setOpenPath(null)
    }
    document.addEventListener("pointerdown", dismiss)
    document.addEventListener("keydown", keyboard)
    window.addEventListener("resize", resize)
    return () => {
      document.removeEventListener("pointerdown", dismiss)
      document.removeEventListener("keydown", keyboard)
      window.removeEventListener("resize", resize)
    }
  }, [menuOpen])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav
        ref={navRef}
        className={`launch-nav ${scrolled || menuOpen ? "launch-nav--scrolled" : ""}`}
        aria-label="Primary navigation"
      >
        <Link
          className="launch-brand"
          href="/"
          aria-label="RoboKnights home"
          onClick={() => setOpenPath(null)}
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={42}
            height={42}
            priority
          />
          <span>RK / 8569</span>
          <NavigationFeedback />
        </Link>
        <button
          ref={toggleRef}
          className="launch-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="launch-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setOpenPath(menuOpen ? null : pathname)}
        >
          <span />
          <span />
        </button>
        <div
          id="launch-menu"
          className={`launch-links ${menuOpen ? "launch-links--open" : ""}`}
        >
          {NAV_LINKS.map((link) => {
            const current =
              pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={current ? "is-current" : undefined}
                onClick={() => setOpenPath(null)}
              >
                {link.label}
                <NavigationFeedback />
              </Link>
            )
          })}
          <Link
            href="/#contact"
            className="launch-contact-link"
            onClick={() => setOpenPath(null)}
          >
            Contact
            <NavigationFeedback />
          </Link>
        </div>
      </nav>
    </>
  )
}
