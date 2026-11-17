import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ReCaptchaProvider } from "next-recaptcha-v3"
import type { ReactNode } from "react"
import DevTools from "@/components/site/dev-tools"
import "./globals.css"
import "katex/dist/katex.min.css"

// SF Pro is used where the OS provides it; Inter is the fallback elsewhere.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#000" }
export const metadata: Metadata = {
  metadataBase: new URL("https://roboknights.net"),
  title: {
    default: "RoboKnights | FTC Team 8569",
    template: "%s | RoboKnights 8569"
  },
  description:
    "FTC Team 8569 at the North Carolina School of Science and Mathematics in Durham. Eighteen students designing, machining and coding a competition robot.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    siteName: "RoboKnights 8569",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/activity/robot-header.jpg",
        width: 2400,
        height: 1605,
        alt: "The 8569 robot on the competition field"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/activity/robot-header.jpg"]
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
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
