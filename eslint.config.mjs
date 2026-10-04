import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettier,
  { rules: { "react/no-unescaped-entities": "off" } },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "output/**",
    "public/draco/**",
    "next-env.d.ts"
  ])
])
