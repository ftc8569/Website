"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/*
 * Hero robot: interactive 3D, with a rendered poster as the floor.
 *
 * The poster is NOT a spinner — it is the real product. It ships in the HTML,
 * paints immediately, and is what everyone sees if three.js is slow, if WebGL
 * is unavailable, if the GLB 404s, or if the dynamic import throws. The 3D is
 * an enhancement layered on top and faded in only once it has actually
 * rendered a frame. Nothing here can leave a hole in the hero.
 *
 * The model is a 1.53 MB Draco-compressed GLB (297k tris, 57 materials) built
 * from the Onshape export of the Worlds robot. Camera values match the angle
 * the poster was rendered at, so the crossfade lands in place.
 */

// From the poster render, so 3D and placeholder line up exactly.
const CAMERA = { x: 1.6805, y: 1.0581, z: 1.6805, fov: 36.24 }

export default function RobotViewer() {
  const mount = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const node = mount.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let disposed = false
    let cleanup: (() => void) | undefined

    const start = async () => {
      try {
        const [THREE, { GLTFLoader }, { DRACOLoader }, { RoomEnvironment }] =
          await Promise.all([
            import("three"),
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/loaders/DRACOLoader.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js")
          ])
        if (disposed) return

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.86
        // Parts casting onto each other is what stops a CAD assembly reading
        // as a flat sticker. This is the single biggest realism win here.
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 100)
        camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z)
        camera.lookAt(0, 0, 0)

        // Neutral studio IBL so the 57 CAD colours read as materials, not flats.
        const pmrem = new THREE.PMREMGenerator(renderer)
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
        // Low ambient: a high IBL fill is what was washing the model out. The
        // environment is here for reflections, not for lighting the whole thing.
        scene.environmentIntensity = 0.3

        // Three-point rig. The key carries the shadows and the form.
        const key = new THREE.DirectionalLight(0xfff4e8, 2.35)
        key.position.set(2.6, 3.6, 2.2)
        key.castShadow = true
        key.shadow.mapSize.set(2048, 2048)
        key.shadow.bias = -0.0009
        key.shadow.normalBias = 0.012
        const sc = key.shadow.camera
        sc.near = 0.5
        sc.far = 12
        sc.left = sc.bottom = -1.1
        sc.right = sc.top = 1.1
        sc.updateProjectionMatrix()
        scene.add(key)

        const fill = new THREE.DirectionalLight(0xbfd4ff, 0.4)
        fill.position.set(-2.8, 0.7, 1.9)
        scene.add(fill)

        const rim = new THREE.DirectionalLight(0xff2b87, 0.95)
        rim.position.set(-2.2, 1.6, -3.2)
        scene.add(rim)

        const resize = () => {
          const w = node.clientWidth
          const h = node.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        resize()
        // The stage can be laid out after init (fonts, image decode, layout
        // shifts), so track it rather than sizing once.
        const ro = new ResizeObserver(resize)
        ro.observe(node)
        node.appendChild(renderer.domElement)

        const draco = new DRACOLoader().setDecoderPath("/draco/")
        const loader = new GLTFLoader().setDRACOLoader(draco)

        const gltf = await loader.loadAsync("/models/worlds-bot.glb")
        if (disposed) {
          renderer.dispose()
          draco.dispose()
          return
        }

        /*
         * The MTL carried `Ns 0`, which converts to roughness 1.0 — completely
         * matte, no specular, which is why it read as faded. Tighten roughness
         * and add a little metalness so the machined parts catch a highlight.
         * Colours are left exactly as exported.
         */
        gltf.scene.traverse((o) => {
          const m = o as THREE.Mesh
          if (!m.isMesh) return
          m.castShadow = true
          m.receiveShadow = true
          const mats = Array.isArray(m.material) ? m.material : [m.material]
          mats.forEach((raw) => {
            const mat = raw as THREE.MeshStandardMaterial
            if (!mat || !("roughness" in mat)) return
            mat.roughness = 0.42
            mat.metalness = 0.15
            mat.envMapIntensity = 0.85
          })
        })

        const pivot = new THREE.Group()
        pivot.add(gltf.scene)
        scene.add(pivot)

        // Pause work when the hero is scrolled away or the tab is hidden.
        let onScreen = true
        const io = new IntersectionObserver(
          ([e]) => {
            onScreen = e.isIntersecting
          },
          { rootMargin: "120px" }
        )
        io.observe(node)

        let pointerX = 0
        let pointerY = 0
        const onPointer = (event: PointerEvent) => {
          const r = node.getBoundingClientRect()
          pointerX = ((event.clientX - r.left) / r.width - 0.5) * 2
          pointerY = ((event.clientY - r.top) / r.height - 0.5) * 2
        }
        window.addEventListener("pointermove", onPointer, { passive: true })
        window.addEventListener("resize", resize)

        let raf = 0
        let t = 0
        let tiltX = 0
        let tiltY = 0
        const clock = new THREE.Clock()

        const tick = () => {
          raf = requestAnimationFrame(tick)
          const dt = clock.getDelta()
          if (!onScreen || document.hidden) return

          t += dt
          // Sway around the poster's 3/4 angle instead of spinning a full turn.
          // A continuous rotation parks the robot at unflattering rear angles
          // half the time; this keeps the hero shot always readable.
          const sway = Math.sin(t * 0.32) * 0.42

          // Ease toward the pointer rather than snapping to it.
          tiltY += (pointerX * 0.2 - tiltY) * 0.045
          tiltX += (pointerY * 0.1 - tiltX) * 0.045

          pivot.rotation.y = sway + tiltY
          pivot.rotation.x = tiltX
          pivot.position.y = Math.sin(t * 0.55) * 0.012

          renderer.render(scene, camera)
        }
        tick()

        // Only reveal once a real frame exists, so there is never a blank flash.
        requestAnimationFrame(() => {
          if (!disposed) setLive(true)
        })

        cleanup = () => {
          cancelAnimationFrame(raf)
          io.disconnect()
          ro.disconnect()
          window.removeEventListener("pointermove", onPointer)
          window.removeEventListener("resize", resize)
          renderer.dispose()
          draco.dispose()
          pmrem.dispose()
          gltf.scene.traverse((o) => {
            const m = o as THREE.Mesh
            if (m.isMesh) {
              m.geometry?.dispose()
              const mat = m.material
              if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
              else mat?.dispose()
            }
          })
          renderer.domElement.remove()
        }
      } catch {
        // Poster stays. The hero is never empty.
      }
    }

    // Defer past first paint so the 3D never competes with the hero rendering.
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => start(), { timeout: 2200 })
        : window.setTimeout(start, 600)

    return () => {
      disposed = true
      if ("cancelIdleCallback" in window && typeof idle === "number") {
        window.cancelIdleCallback(idle)
      } else {
        clearTimeout(idle as number)
      }
      cleanup?.()
    }
  }, [])

  return (
    <div className={`robot3d ${live ? "robot3d--live" : ""}`}>
      <Image
        className="robot3d-poster"
        src="/models/worlds-bot-poster.webp"
        alt="The RoboKnights Worlds competition robot"
        width={1600}
        height={1600}
        priority
        sizes="(max-width: 900px) 100vw, 62vw"
      />
      <div className="robot3d-stage" ref={mount} aria-hidden="true" />
    </div>
  )
}
