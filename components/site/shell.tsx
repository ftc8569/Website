"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import Loader from "@/components/home/loader"
import SiteNavigation, { NAV_LINKS } from "@/components/site/navigation"

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
  const pathname = usePathname()

  // Arm reveals only after the observer exists; server/no-JS content is visible.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.01 }
    )
    const attach = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-visible)")
        .forEach((node) => {
          const bounds = node.getBoundingClientRect()
          if (
            reduced ||
            (bounds.top < window.innerHeight && bounds.bottom > 0)
          ) {
            node.classList.add("is-visible")
          } else observer.observe(node)
        })
    }
    attach()
    document.documentElement.classList.add("reveal-ready")
    const mutations = new MutationObserver(attach)
    mutations.observe(
      document.querySelector(".route-content") ?? document.body,
      { childList: true, subtree: true }
    )
    return () => {
      observer.disconnect()
      mutations.disconnect()
      document.documentElement.classList.remove("reveal-ready")
    }
  }, [pathname])

  return (
    <>
      <Loader />
      <div className="launch-site">
        <SiteNavigation />

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
              <Link href="/blog">Blog</Link>
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
