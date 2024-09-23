import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoboKnights",
  description: "FTC Team 8569 RoboKnights housed at North Carolina School of Science and Math",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-roboGray`}
      >
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png"/>
        {children}
      </body>
    </html>
  );
}
