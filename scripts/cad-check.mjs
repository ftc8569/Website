import assert from "node:assert/strict"
import { mkdir, writeFile } from "node:fs/promises"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import AxeBuilder from "@axe-core/playwright"

const baseURL = process.argv[2] ?? "http://localhost:8570"
await mkdir("output/playwright", { recursive: true })
const browser = await chromium.launch({ channel: "chrome" })
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  })
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto(baseURL, { waitUntil: "domcontentloaded" })
  await page.locator(".boot").waitFor({ state: "hidden" })
  const stage = page.locator(".robot3d-stage")
  await page
    .getByRole("status")
    .filter({ hasText: "Scroll to zoom" })
    .waitFor({ timeout: 30000 })
  await page.waitForTimeout(1600)
  assert.equal(
    await page.locator(".robot3d button, .machine-label").count(),
    0,
    "No CAD toolbar or overlapping labels"
  )
  await stage.focus()
  await page.keyboard.press("Home")
  await page.waitForTimeout(150)
  const canvas = stage.locator("canvas")
  // Isolate model pixels from the decorative animated backdrop for image
  // comparisons; restore the normal presentation for layout screenshots.
  const backdrop = await page.addStyleTag({
    content:
      ".hero-spotlight,.machine-halo,.machine-scan,.hero-orbit,.hero-grid { visibility: hidden !important; }"
  })
  const capture = async () => {
    const screenshot = await canvas.screenshot()
    const { width, height } = await sharp(screenshot).metadata()
    // Exclude the fixed navbar and focus outline, which sit over the outer
    // empty edges of the canvas, from comparisons of the robot itself.
    return sharp(screenshot)
      .extract({ left: 64, top: 112, width: width - 128, height: height - 144 })
      .png()
      .toBuffer()
  }
  const initial = await capture()
  const bounds = await stage.boundingBox()
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2
  }

  await page.mouse.move(center.x, center.y)
  const scroll = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, -150)
  await page.waitForTimeout(200)
  const zoomed = await capture()
  await writeFile("output/playwright/cad-initial.png", initial)
  await writeFile("output/playwright/cad-zoomed.png", zoomed)
  assert(!initial.equals(zoomed), "Wheel zoom visibly changes the model")
  assert.equal(
    await page.evaluate(() => window.scrollY),
    scroll,
    "Zoom gesture stays within viewer"
  )
  await page.mouse.wheel(0, 150)
  await page.waitForTimeout(200)
  const zoomedOut = await capture()
  assert(!zoomed.equals(zoomedOut), "Wheel zooms back out")
  await page.mouse.down()
  await page.mouse.move(center.x + 100, center.y + 30, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(100)
  const rotated = await capture()
  assert(!zoomedOut.equals(rotated), "Mouse drag visibly rotates robot")
  await page.keyboard.down("Shift")
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.mouse.move(center.x + 80, center.y - 40, { steps: 8 })
  await page.mouse.up()
  await page.keyboard.up("Shift")
  await page.waitForTimeout(100)
  assert(!rotated.equals(await capture()), "Shift-drag visibly moves robot")
  await page.mouse.dblclick(center.x, center.y)
  await page.waitForTimeout(100)
  const reset = await capture()
  await writeFile("output/playwright/cad-initial.png", initial)
  await writeFile("output/playwright/cad-reset.png", reset)
  const imageError = async (a, b) => {
    const first = await sharp(a).raw().toBuffer()
    const second = await sharp(b).raw().toBuffer()
    let error = 0
    for (let i = 0; i < first.length; i++)
      error += Math.abs(first[i] - second[i])
    return error / first.length
  }
  const resetError = await imageError(initial, reset)
  const rotatedError = await imageError(initial, rotated)
  assert(
    resetError < rotatedError * 0.2,
    "Double-click restores original model framing"
  )
  await stage.focus()
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("+")
  await page.keyboard.press("Shift+ArrowRight")
  await page.keyboard.press("Home")
  await page.mouse.move(40, 400)
  await page.mouse.wheel(0, 300)
  await page.waitForTimeout(200)
  assert(
    (await page.evaluate(() => window.scrollY)) > scroll,
    "Page scroll remains available outside viewer"
  )

  await backdrop.evaluate((el) => el.remove())
  for (const width of [375, 768, 900, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    const copy = await page.locator(".hero-copy").boundingBox()
    const viewport = await page.locator(".robot3d-viewport").boundingBox()
    const instruction = await page.locator(".robot3d-status").boundingBox()
    const hero = await page.locator(".launch-hero").boundingBox()
    assert(
      instruction.y >= viewport.y + viewport.height,
      `Instruction clears CAD stage at ${width}px`
    )
    assert(
      instruction.y + instruction.height <= hero.y + hero.height,
      `Instruction fits inside hero at ${width}px`
    )
    if (width <= 900)
      assert(
        viewport.y >= copy.y + copy.height + 24,
        `Copy and model have clear spacing at ${width}px`
      )
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      ),
      `No overflow at ${width}px`
    )
    const axe = await new AxeBuilder({ page }).include(".launch-site").analyze()
    if (axe.violations.length)
      console.log(
        JSON.stringify(
          axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary
            }))
          })),
          null,
          2
        )
      )
    assert.deepEqual(
      axe.violations.map((v) => v.id),
      [],
      `Accessibility at ${width}px`
    )
    await page.screenshot({
      path: `output/playwright/cad-${width}.png`,
      fullPage: false
    })
  }
  assert.deepEqual(errors, [], "No CAD runtime errors")
  console.log(
    "PASS: mouse rotation, wheel zoom both ways, pan, reset, keyboard, page scroll, spacing and accessibility at four widths"
  )
  await context.close()

  const touch = await browser.newContext({
    viewport: { width: 375, height: 900 },
    hasTouch: true,
    isMobile: true
  })
  const mobile = await touch.newPage()
  await mobile.goto(baseURL, { waitUntil: "domcontentloaded" })
  await mobile
    .getByRole("status")
    .filter({ hasText: "Scroll to zoom" })
    .waitFor({ timeout: 30000 })
  await mobile.locator(".robot3d-stage").scrollIntoViewIfNeeded()
  const mobileBounds = await mobile.locator(".robot3d-stage").boundingBox()
  const cdp = await touch.newCDPSession(mobile)
  const x = mobileBounds.x + mobileBounds.width / 2
  const y = mobileBounds.y + mobileBounds.height / 2
  const start = await mobile.evaluate(() => scrollY)
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }]
  })
  for (let i = 1; i <= 6; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - i * 20 }]
    })
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: []
  })
  await mobile.waitForTimeout(200)
  assert(
    (await mobile.evaluate(() => scrollY)) > start,
    "Vertical touch drag scrolls the page"
  )
  console.log("PASS: touch scrolling over viewer")
  await touch.close()

  const reduced = await browser.newContext({ reducedMotion: "reduce" })
  const quiet = await reduced.newPage()
  await quiet.goto(baseURL, { waitUntil: "domcontentloaded" })
  await quiet
    .getByRole("status")
    .filter({ hasText: "Scroll to zoom" })
    .waitFor({ timeout: 30000 })
  assert.equal(
    await quiet.locator(".robot3d-stage canvas").count(),
    1,
    "Reduced motion retains direct CAD interaction"
  )
  await reduced.close()

  const failed = await browser.newContext()
  await failed.route("**/models/worlds-bot.glb", (route) => route.abort())
  const fallback = await failed.newPage()
  await fallback.goto(baseURL, { waitUntil: "domcontentloaded" })
  await fallback
    .getByRole("status")
    .filter({ hasText: "Showing poster" })
    .waitFor({ timeout: 30000 })
  assert(await fallback.locator(".robot3d-poster").isVisible())
  assert.equal(
    await fallback.locator(".robot3d-stage").getAttribute("tabindex"),
    "-1"
  )
  console.log(
    "PASS: reduced-motion interaction and failed download poster fallback"
  )
  await failed.close()
} finally {
  await browser.close()
}
