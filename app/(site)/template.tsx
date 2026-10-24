import type { ReactNode } from "react"

// Templates remount on navigation while SiteShell (and its boot sequence) stays
// mounted. Native Link navigation and browser history keep their normal behavior.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="route-content" id="main-content" tabIndex={-1}>
      {children}
    </div>
  )
}
