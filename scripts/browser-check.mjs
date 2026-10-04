import assert from "node:assert/strict"
import { mkdir, writeFile } from "node:fs/promises"
import { chromium } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const baseURL = process.argv[2] ?? "http://localhost:8569"
const artifactDir = `output/playwright/${new URL(baseURL).port}`
await mkdir(artifactDir, { recursive: true })
const browser = await chromium.launch({ channel: "chrome", headless: true })
const results = []
const routes = ["/", "/robot", "/software", "/outreach", "/team", "/blog"]

try {
  for (const width of [375, 768, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 }
    })
    const page = await context.newPage()
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    for (const route of routes) {
      const response = await page.goto(`${baseURL}${route}`, {
        waitUntil: "domcontentloaded"
      })
      assert.equal(response.status(), 200, `${route} HTTP status`)
      await page.locator(".boot").waitFor({ state: "hidden", timeout: 15000 })
      await page.locator("main h1").waitFor()
      await page.waitForFunction(
        () => document.documentElement.classList.contains("reveal-ready"),
        { timeout: 60000 }
      )
      assert.equal(
        await page.locator("main h1").count(),
        1,
        `${route} has one h1`
      )
      const nav = page.getByRole("navigation", { name: "Primary navigation" })
      assert.equal(await nav.count(), 1, `${route} has one primary navigation`)
      if (width <= 900) {
        const toggle = page.getByRole("button", { name: "Open navigation" })
        await toggle.click()
        await page.getByRole("button", { name: "Close navigation" }).waitFor()
        await page.keyboard.press("Escape")
        assert.equal(await toggle.getAttribute("aria-expanded"), "false")
        assert(
          await toggle.evaluate((el) => el === document.activeElement),
          "Escape restores toggle focus"
        )
        await nav
          .getByRole("link", { name: "Robot", exact: true })
          .waitFor({ state: "hidden" })
      }
      if (routes.indexOf(route) > 0 && route !== "/blog") {
        assert.equal(
          await nav.locator('[aria-current="page"]').getAttribute("href"),
          route
        )
      }
      for (const section of await page.locator("[data-reveal]").all()) {
        await section.scrollIntoViewIfNeeded()
      }
      await page.waitForTimeout(1100)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth
      )
      assert(
        overflow <= 1,
        `${route} overflows ${width}px viewport by ${overflow}px`
      )
      const axe = await new AxeBuilder({ page })
        .include(".launch-site")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
      const violations = axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary
        }))
      }))
      results.push({
        width,
        route,
        title: await page.title(),
        overflow,
        violations
      })
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
      await page.screenshot({
        path: `${artifactDir}/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
        fullPage: true,
        animations: "disabled"
      })
      console.log(
        `${width}px ${route}: ${violations.length} accessibility issues`
      )
    }
    // Real client navigation, persistent intro, browser history, and contact hash.
    await page.goto(`${baseURL}/`)
    await page.locator(".boot").waitFor({ state: "hidden" })
    if (width <= 900)
      await page.getByRole("button", { name: "Open navigation" }).click()
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Software", exact: true })
      .click()
    await page.waitForURL("**/software")
    assert.equal(
      await page.locator(".boot").count(),
      0,
      "intro does not replay during navigation"
    )
    assert.equal(
      await page.locator(".katex-error").count(),
      0,
      "equations have no parser error"
    )
    assert(
      (await page.locator(".katex-mathml math").count()) > 0,
      "accessible MathML is rendered"
    )
    await page.goBack()
    await page.waitForURL(`${baseURL}/`)
    if (width <= 900)
      await page.getByRole("button", { name: "Open navigation" }).click()
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Contact", exact: true })
      .click()
    await page.waitForURL("**/#contact")
    await page.waitForTimeout(1000)
    const anchorTop = await page
      .locator("#contact")
      .evaluate((el) => el.getBoundingClientRect().top)
    assert(
      anchorTop >= 68 && anchorTop < 750,
      `contact clears fixed nav: ${anchorTop}`
    )
    assert.deepEqual(errors, [], "no browser runtime errors")
    await context.close()
  }
  const fallback = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 }
  })
  const page = await fallback.newPage()
  await page.goto(`${baseURL}/software`)
  await page.waitForTimeout(2800)
  assert(await page.locator("main h1").isVisible(), "no-JS content is visible")
  assert(
    (await page.locator(".katex-mathml math").count()) > 0,
    "math is server-rendered"
  )
  await fallback.close()
  const reduced = await browser.newContext({ reducedMotion: "reduce" })
  const reducedPage = await reduced.newPage()
  await reducedPage.goto(baseURL)
  assert.equal(
    await reducedPage.locator(".boot").isVisible(),
    false,
    "reduced motion skips intro"
  )
  assert.equal(
    await reducedPage
      .locator(".route-content")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none"
  )
  await reduced.close()
  const request = await browser.newContext()
  const invalidContact = await request.request.post(
    `${baseURL}/api/contact-us`,
    { data: { email: "bad" } }
  )
  assert.equal(
    invalidContact.status(),
    400,
    "invalid contact is rejected without sending mail"
  )
  await request.close()
} finally {
  await writeFile(
    `${artifactDir}/browser-results.json`,
    JSON.stringify(results, null, 2)
  )
  await browser.close()
}

const violations = results.flatMap((r) => r.violations)
assert.equal(
  violations.length,
  0,
  `See ${artifactDir}/browser-results.json for accessibility failures`
)
console.log(
  `PASS: routes, navigation/history/hash, responsiveness, math, motion, no-JS, and invalid contact at ${baseURL}`
)
