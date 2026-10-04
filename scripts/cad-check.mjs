import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import { chromium } from "@playwright/test"

const baseURL = process.argv[2] ?? "http://localhost:8570"
await mkdir("output/playwright", { recursive: true })
const browser = await chromium.launch({ channel: "chrome" })
try {
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
    hasTouch: true
  })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto(baseURL)
  await page.locator(".boot").waitFor({ state: "hidden" })
  await page
    .getByRole("status")
    .filter({ hasText: "Drag to rotate" })
    .waitFor({ timeout: 30000 })
  const control = page.getByRole("button", { name: "Rotate robot right" })
  const before = await control.boundingBox()
  await page.waitForTimeout(800)
  const after = await control.boundingBox()
  assert(
    Math.abs(before.x - after.x) < 1 && Math.abs(before.y - after.y) < 1,
    "CAD controls remain stationary during model animation"
  )
  await page.locator(".robot3d-stage").focus()
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("+")
  await page.keyboard.press("Home")
  await control.tap()
  await page.getByRole("button", { name: "Zoom in", exact: true }).tap()
  await page.getByRole("button", { name: "Reset robot view" }).tap()
  assert.deepEqual(errors, [], "CAD controls do not throw runtime errors")
  assert.equal(await page.locator(".robot3d-stage canvas").count(), 1)
  await page.screenshot({ path: "output/playwright/cad-mobile.png" })
  console.log(
    "PASS: stationary mobile CAD controls, touch, keyboard, and reset"
  )
  await context.close()

  const failed = await browser.newContext()
  await failed.route("**/models/worlds-bot.glb", (route) => route.abort())
  const fallback = await failed.newPage()
  await fallback.goto(baseURL)
  await fallback
    .getByRole("status")
    .filter({ hasText: "Showing poster" })
    .waitFor({ timeout: 30000 })
  assert(await fallback.locator(".robot3d-poster").isVisible())
  assert(
    await fallback
      .getByRole("button", { name: "Zoom in", exact: true })
      .isDisabled()
  )
  console.log(
    "PASS: failed CAD download retains poster and disables unavailable controls"
  )
  await failed.close()
} finally {
  await browser.close()
}
