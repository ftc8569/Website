import type { Metadata } from "next"
import "./globals.css"
import { ReCaptchaProvider } from "next-recaptcha-v3"
import type { Viewport } from "next"
import { ReactNode } from "react"

export const viewport: Viewport = {
  colorScheme: "only light"
}

export const metadata: Metadata = {
  title: "RoboKnights",
  description:
    "FTC Team 8569 RoboKnights housed at North Carolina School of Science and Math"
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
    >
      {/*
       * suppressHydrationWarning: the inline script below adds `reveal-ready`
       * to <html> before React hydrates, so the server and client markup
       * intentionally differ on this element.
       */}
      <html lang="en" suppressHydrationWarning>
        <head>
          {/*
           * Arms the scroll-reveal animation before first paint, and sets a
           * failsafe that un-arms it if React never gets far enough to take
           * over. Without this, a slow or failed hydration leaves every
           * [data-reveal] section at opacity 0 — i.e. a blank site.
           * LaunchExperience clears the timer once its observer is attached.
           */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){var d=document.documentElement;d.classList.add('reveal-ready');" +
                "window.__rkRevealFailsafe=setTimeout(function(){d.classList.remove('reveal-ready')},4000)})()"
            }}
          />
        </head>
        <body>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          {children}
        </body>
      </html>
    </ReCaptchaProvider>
  )
}
