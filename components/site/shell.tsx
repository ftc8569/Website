"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import SiteNavigation, { NAV_LINKS } from "@/components/site/navigation"
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/components/site/ui"

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Fade-up reveals. Armed only after the observer exists, so content is
  // visible with no JavaScript and under reduced motion.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -40px 0px" }
    )
    const attach = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-visible)")
        .forEach((node) => {
          const bounds = node.getBoundingClientRect()
          if (bounds.top < window.innerHeight && bounds.bottom > 0)
            node.classList.add("is-visible")
          else observer.observe(node)
        })
    }
    attach()
    document.documentElement.classList.add("reveal-ready")
    const mutations = new MutationObserver(attach)
    mutations.observe(
      document.getElementById("main-content") ?? document.body,
      {
        childList: true,
        subtree: true
      }
    )
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [pathname])

  return (
    <>
      <SiteNavigation />
      {children}
      <footer className="footer">
        <div className="wrap--media">
          <div className="footer-top">
            <div>
              <p className="footer-name">RoboKnights</p>
              <p className="footer-sub">FTC Team 8569 · NCSSM, Durham NC</p>
              <a className="footer-email" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <h2>Explore</h2>
                <ul>
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-col">
                <h2>Follow</h2>
                <ul>
                  {SOCIAL_LINKS.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="footer-bottom">
            © {new Date().getFullYear()} RoboKnights, FTC Team 8569
          </p>
        </div>
      </footer>
    </>
  )
}
