import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { ReCaptchaProvider } from "next-recaptcha-v3"
import type { ReactNode } from "react"
import DevTools from "@/components/site/dev-tools"
import "./globals.css"
import "katex/dist/katex.min.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-poppins"
})

export const viewport: Viewport = { colorScheme: "dark" }
export const metadata: Metadata = {
  title: {
    default: "RoboKnights | FTC Team 8569",
    template: "%s | RoboKnights 8569"
  },
  description:
    "Student-built robots, software, and community outreach from FTC Team 8569 at the North Carolina School of Science and Mathematics in Durham.",
  icons: { icon: "/favicon.png" }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body>
        <DevTools />
        {siteKey ? (
          <ReCaptchaProvider reCaptchaKey={siteKey}>
            {children}
          </ReCaptchaProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
