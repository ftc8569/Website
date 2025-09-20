import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        roboHotPink: "var(--roboHotPink)",
        roboGray: "var(--roboGray)",
        roboPink: "var(--roboPink)"
      },
      spacing: {
        "1/12": 100 / 12 + "%"
      },
      translate: {
        "1/12": 100 / 12 + "%"
      }
    }
  },
  plugins: []
}
export default config
