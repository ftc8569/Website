import katex from "katex"

import styles from "./math-equation.module.css"

type MathEquationProps = {
  label: string
  formula: string
  description: string
}

/** Render a trusted, source-authored equation with KaTeX's accessible MathML. */
export default function MathEquation({
  label,
  formula,
  description
}: MathEquationProps) {
  const rendered = katex.renderToString(formula, {
    displayMode: true,
    output: "htmlAndMathml",
    strict: "warn",
    trust: false
  })

  return (
    <figure className={styles.figure} aria-label={label}>
      <div
        className={styles.viewport}
        tabIndex={0}
        role="math"
        aria-label={`${label}: ${description}`}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
      <figcaption className={styles.caption}>{description}</figcaption>
    </figure>
  )
}
