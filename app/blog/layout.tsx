import type { ReactNode } from "react"
import type { Metadata } from "next"

import SiteShell from "@/components/site/shell"

export const metadata: Metadata = {
  title: "Field Notes — RoboKnights 8569",
  description:
    "Build updates, competition days, and engineering articles from RoboKnights FTC Team 8569."
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>
}
