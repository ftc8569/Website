"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import Loader from "@/components/home/loader"

declare global {
  interface Window {
    __rkRevealFailsafe?: ReturnType<typeof setTimeout>
  }
}

/*
 * Site chrome. Lives in the (site) route group layout, so nav, footer and the
 * boot sequence stay mounted across client-side navigation — the splash only
 * replays on a genuine page load, never when moving between pages.
 */

const NAV_LINKS = [
  { href: "/robot", label: "Robot" },
  { href: "/software", label: "Software" },
  { href: "/outreach", label: "Outreach" },
  { href: "/team", label: "Team" }
]

export function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M5 12h13M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const updateNav = () => setScrolled(window.scrollY > 40)
    updateNav()
    window.addEventListener("scroll", updateNav, { passive: true })
    return () => window.removeEventListener("scroll", updateNav)
  }, [])

  // Re-run per route: each page mounts its own [data-reveal] nodes.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible")
        }),
      { threshold: 0.12 }
    )

    const attach = () =>
      document
        .querySelectorAll("[data-reveal]:not(.is-visible)")
        .forEach((node) => observer.observe(node))

    attach()
    const retry = setTimeout(attach, 400)

    // React is alive and observing, so the layout's blank-page failsafe
    // (which would un-arm the reveal animation) is no longer needed.
    clearTimeout(window.__rkRevealFailsafe)

    return () => {
      clearTimeout(retry)
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <Loader />
      <div className="launch-site">
        <nav
          className={`launch-nav ${scrolled ? "launch-nav--scrolled" : ""}`}
          aria-label="Primary navigation"
        >
          <Link className="launch-brand" href="/" aria-label="RoboKnights home">
            <Image
              src="/assets/logo.png"
              alt=""
              width={42}
              height={42}
              priority
            />
            <span>RK / 8569</span>
          </Link>
          <button
            className="launch-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="launch-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span className="sr-only">Toggle menu</span>
          </button>
          <div
            id="launch-menu"
            className={`launch-links ${menuOpen ? "launch-links--open" : ""}`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname.startsWith(link.href) ? "is-current" : undefined
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {children}

        <footer className="site-footer">
          <div className="site-footer-top">
            <div className="site-footer-brand">
              <Image src="/assets/logo.png" alt="" width={46} height={46} />
              <div>
                <p className="site-footer-name">RoboKnights</p>
                <p className="site-footer-sub">FTC Team 8569 · NCSSM Durham</p>
              </div>
            </div>
            <nav className="site-footer-links" aria-label="Footer">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href="/#contact">Contact</Link>
            </nav>
          </div>
          <div className="site-footer-bottom">
            <span>© {new Date().getFullYear()} RoboKnights 8569</span>
            <div>
              <a href="https://www.instagram.com/roboknights8569/">Instagram</a>
              <a href="https://github.com/ftc8569">GitHub</a>
              <a href="https://www.linkedin.com/company/ftc8569">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
