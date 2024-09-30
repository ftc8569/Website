import type { Metadata } from "next";
import "./globals.css";
import {ReCaptchaProvider} from "next-recaptcha-v3";

  export const metadata: Metadata = {
  title: "RoboKnights",
  description: "FTC Team 8569 RoboKnights housed at North Carolina School of Science and Math"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReCaptchaProvider>
      <html lang="en">
          <body
            className={`bg-roboGray font-montserrat`}
          >
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"/>
            {children}
          </body>
      </html>
    </ReCaptchaProvider>
  );
}
