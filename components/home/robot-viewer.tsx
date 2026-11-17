"use client"

import Image from "next/image"
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent
} from "react"
import type {
  Group,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget
} from "three"
import type { DRACOLoader as DRACOLoaderInstance } from "three/examples/jsm/loaders/DRACOLoader.js"
import "./robot-viewer.css"

/*
 * The poster is the reliable first frame and remains visible whenever WebGL,
 * the model, or the user's device cannot provide the interactive view.
 */
const CAMERA = { x: 1.6805, y: 1.0581, z: 1.6805, fov: 36.24 }
const MIN_ZOOM = 0.65
const DEFAULT_ZOOM = 1
const MAX_ZOOM = 1.8
const ZOOM_STEP = 0.15

type ViewerControls = {
  rotate: (horizontal: number, vertical?: number) => void
  zoom: (amount: number) => boolean
  pan: (horizontal: number, vertical: number) => void
  reset: () => void
}

type DragState = {
  pointerId: number
  startX: number
  startY: number
  lastX: number
  lastY: number
  dragging: boolean
  touch: boolean
  pan: boolean
}

export default function RobotViewer() {
  const mount = useRef<HTMLDivElement>(null)
  const viewerControls = useRef<ViewerControls | null>(null)
  const drag = useRef<DragState | null>(null)
  const [live, setLive] = useState(false)
  const [status, setStatus] = useState("")
  const [failed, setFailed] = useState(false)
  const [touched, setTouched] = useState(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchDistance = useRef(0)

  useEffect(() => {
    const node = mount.current
    if (!node) return

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )

    let disposed = false
    let onScreen = false
    let raf = 0
    let cleanup: (() => void) | undefined
    let updateVisibility = () => {}

    // Keep the still image on reduced motion and on slow or data-saving
    // connections: the 3D model is a 1.6 MB download plus the Draco decoder.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string }
      }
    ).connection
    if (
      motionPreference.matches ||
      connection?.saveData ||
      /(^|-)(2g|3g)$/.test(connection?.effectiveType ?? "")
    )
      return

    const start = async () => {
      let renderer: WebGLRenderer | undefined
      let draco: DRACOLoaderInstance | undefined
      let pmrem: PMREMGenerator | undefined
      let environment: WebGLRenderTarget | undefined
      let gltfScene: Group | undefined
      let resizeObserver: ResizeObserver | undefined
      let intersectionObserver: IntersectionObserver | undefined
      let stopLoop: (() => void) | undefined

      try {
        const [THREE, { GLTFLoader }, { DRACOLoader }, { RoomEnvironment }] =
          await Promise.all([
            import("three"),
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/loaders/DRACOLoader.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js")
          ])
        if (disposed) return

        const compact = window.matchMedia(
          "(max-width: 600px), (pointer: coarse)"
        ).matches
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: compact ? "low-power" : "high-performance"
        })
        const release = () => {
          stopLoop?.()
          intersectionObserver?.disconnect()
          resizeObserver?.disconnect()
          document.removeEventListener("visibilitychange", updateVisibility)
          viewerControls.current = null
          renderer?.dispose()
          draco?.dispose()
          environment?.dispose()
          pmrem?.dispose()
          const disposedTextures = new Set<Texture>()
          gltfScene?.traverse((object) => {
            const mesh = object as Mesh
            if (!mesh.isMesh) return
            mesh.geometry?.dispose()
            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material]
            materials.forEach((material) => {
              Object.values(material).forEach((value) => {
                if (
                  value instanceof THREE.Texture &&
                  !disposedTextures.has(value)
                ) {
                  disposedTextures.add(value)
                  value.dispose()
                }
              })
              material.dispose()
            })
          })
          renderer?.domElement.remove()
          renderer = undefined
          draco = undefined
          environment = undefined
          pmrem = undefined
          gltfScene = undefined
        }
        cleanup = release
        // Start sharp, then step down if frames run long (see `animate`).
        let pixelRatio = Math.min(window.devicePixelRatio, compact ? 1.25 : 1.5)
        renderer.setPixelRatio(pixelRatio)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.86
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFShadowMap

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 100)
        camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z)
        camera.lookAt(0, 0, 0)

        pmrem = new THREE.PMREMGenerator(renderer)
        environment = pmrem.fromScene(new RoomEnvironment(), 0.04)
        scene.environment = environment.texture
        scene.environmentIntensity = 0.3

        const key = new THREE.DirectionalLight(0xfff4e8, 2.35)
        key.position.set(2.6, 3.6, 2.2)
        key.castShadow = true
        const shadowSize = compact ? 1024 : 1536
        key.shadow.mapSize.set(shadowSize, shadowSize)
        key.shadow.bias = -0.0009
        key.shadow.normalBias = 0.012
        const shadowCamera = key.shadow.camera
        shadowCamera.near = 0.5
        shadowCamera.far = 12
        shadowCamera.left = shadowCamera.bottom = -1.1
        shadowCamera.right = shadowCamera.top = 1.1
        shadowCamera.updateProjectionMatrix()
        scene.add(key)

        const fill = new THREE.DirectionalLight(0xbfd4ff, 0.4)
        fill.position.set(-2.8, 0.7, 1.9)
        scene.add(fill)

        const rim = new THREE.DirectionalLight(0xff2b87, 0.95)
        rim.position.set(-2.2, 1.6, -3.2)
        scene.add(rim)

        // Once the user takes control the model is static between inputs, so
        // frames are only drawn when something marks the view dirty.
        let dirty = true
        const resize = () => {
          const width = node.clientWidth
          const height = node.clientHeight
          if (!width || !height || !renderer) return
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          dirty = true
        }
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(node)
        node.appendChild(renderer.domElement)
        renderer.domElement.setAttribute("aria-hidden", "true")

        draco = new DRACOLoader().setDecoderPath("/draco/")
        const loader = new GLTFLoader().setDRACOLoader(draco)
        const gltf = await loader.loadAsync("/models/worlds-bot.glb")
        gltfScene = gltf.scene
        if (disposed) {
          release()
          return
        }

        gltf.scene.traverse((object) => {
          const mesh = object as Mesh
          if (!mesh.isMesh) return
          mesh.castShadow = true
          mesh.receiveShadow = true
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material]
          materials.forEach((raw) => {
            const material = raw as MeshStandardMaterial
            if (!("roughness" in material)) return
            material.roughness = 0.42
            material.metalness = 0.15
            material.envMapIntensity = 0.85
          })
        })

        const pivot = new THREE.Group()
        pivot.add(gltf.scene)
        scene.add(pivot)

        let userRotationY = 0
        let userRotationX = 0
        let zoom = DEFAULT_ZOOM
        let panX = 0
        let panY = 0
        let time = 0
        let interacting = false
        camera.updateMatrixWorld()
        const cameraRight = new THREE.Vector3().setFromMatrixColumn(
          camera.matrix,
          0
        )
        const cameraUp = new THREE.Vector3().setFromMatrixColumn(
          camera.matrix,
          1
        )
        const takeControl = () => {
          dirty = true
          if (interacting) return
          userRotationY = pivot.rotation.y
          userRotationX = pivot.rotation.x
          interacting = true
        }
        viewerControls.current = {
          rotate: (horizontal, vertical = 0) => {
            takeControl()
            userRotationY += horizontal
            userRotationX = THREE.MathUtils.clamp(
              userRotationX + vertical,
              -0.65,
              0.65
            )
          },
          zoom: (amount) => {
            const next = THREE.MathUtils.clamp(
              zoom + amount,
              MIN_ZOOM,
              MAX_ZOOM
            )
            if (next === zoom) return false
            takeControl()
            zoom = next
            camera.zoom = zoom
            camera.updateProjectionMatrix()
            return true
          },
          pan: (horizontal, vertical) => {
            takeControl()
            panX = THREE.MathUtils.clamp(panX + horizontal / zoom, -0.5, 0.5)
            panY = THREE.MathUtils.clamp(panY + vertical / zoom, -0.5, 0.5)
          },
          reset: () => {
            dirty = true
            interacting = true
            userRotationY = userRotationX = panX = panY = 0
            zoom = DEFAULT_ZOOM
            camera.zoom = zoom
            camera.updateProjectionMatrix()
          }
        }

        let previousFrame = performance.now()
        let slowFrames = 0
        const animate = () => {
          raf = 0
          if (disposed || !onScreen || document.hidden || !renderer) return
          const now = performance.now()
          const elapsed = now - previousFrame
          time += Math.min(elapsed / 1000, 0.05)
          previousFrame = now
          raf = requestAnimationFrame(animate)
          if (interacting && !dirty) return
          dirty = false
          // Sustained frames slower than ~45fps: drop resolution a step.
          slowFrames = elapsed > 22 && elapsed < 250 ? slowFrames + 1 : 0
          if (slowFrames > 20 && pixelRatio > 0.85) {
            pixelRatio = Math.max(0.85, pixelRatio - 0.2)
            renderer.setPixelRatio(pixelRatio)
            resize()
            slowFrames = 0
          }
          pivot.rotation.y = interacting ? userRotationY : time * 0.18
          pivot.rotation.x = userRotationX
          pivot.position
            .copy(cameraRight)
            .multiplyScalar(panX)
            .addScaledVector(cameraUp, panY)
          renderer.render(scene, camera)
        }
        const startLoop = () => {
          if (!raf && onScreen && !document.hidden) {
            previousFrame = performance.now()
            raf = requestAnimationFrame(animate)
          }
        }
        stopLoop = () => {
          if (raf) cancelAnimationFrame(raf)
          raf = 0
        }

        intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            onScreen = entry.isIntersecting
            if (onScreen) startLoop()
            else stopLoop?.()
          },
          { rootMargin: "120px" }
        )
        intersectionObserver.observe(node)

        updateVisibility = () => {
          if (document.hidden) stopLoop?.()
          else startLoop()
        }
        document.addEventListener("visibilitychange", updateVisibility)

        startLoop()
        setFailed(false)
        setStatus("3D model loaded")
        requestAnimationFrame(() => {
          if (!disposed) setLive(true)
        })
      } catch {
        cleanup?.()
        if (!disposed) {
          setFailed(true)
          setStatus("3D view unavailable. Showing a still image.")
        }
      }
    }

    // Three.js, the Draco decoder and the 1.6 MB model are heavy, so they wait
    // for two things: the viewer being near the viewport, and the visitor's
    // first input (pointer, touch, key or scroll). Until then the poster shows,
    // which keeps the main thread free while the page loads.
    let nearViewport = false
    let interacted = false
    let started = false
    const maybeStart = () => {
      if (started || !nearViewport || !interacted) return
      started = true
      void start()
    }
    const inputs = [
      "pointermove",
      "pointerdown",
      "touchstart",
      "keydown",
      "wheel",
      "scroll"
    ] as const
    const onInput = () => {
      interacted = true
      inputs.forEach((name) => window.removeEventListener(name, onInput))
      maybeStart()
    }
    inputs.forEach((name) =>
      window.addEventListener(name, onInput, { passive: true })
    )
    const lazy = new IntersectionObserver(
      ([entry]) => {
        nearViewport = entry.isIntersecting
        if (nearViewport) maybeStart()
        if (started) lazy.disconnect()
      },
      { rootMargin: "300px" }
    )
    lazy.observe(node)

    return () => {
      disposed = true
      lazy.disconnect()
      inputs.forEach((name) => window.removeEventListener(name, onInput))
      cleanup?.()
    }
  }, [])

  const pinchSpan = () => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!live || (event.button !== 0 && event.button !== 2)) return
    setTouched(true)
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })
    if (pointers.current.size === 2) {
      pinchDistance.current = pinchSpan()
      drag.current = null
      return
    }
    event.currentTarget.focus({ preventScroll: true })
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      dragging: false,
      touch: event.pointerType === "touch",
      pan: event.shiftKey || event.button === 2
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      })
      if (pointers.current.size === 2) {
        const span = pinchSpan()
        viewerControls.current?.zoom((span - pinchDistance.current) * 0.004)
        pinchDistance.current = span
        return
      }
    }
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId || !live) return

    const dx = event.clientX - current.lastX
    const dy = event.clientY - current.lastY
    if (!current.dragging) {
      const totalX = event.clientX - current.startX
      const totalY = event.clientY - current.startY
      if (current.touch && Math.abs(totalY) > Math.abs(totalX)) return
      if (Math.abs(totalX) + Math.abs(totalY) < 5) return
      current.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    const width = event.currentTarget.clientWidth || 1
    if (current.pan) {
      viewerControls.current?.pan((dx / width) * 2, (-dy / width) * 2)
    } else {
      viewerControls.current?.rotate(
        (dx / width) * Math.PI * 1.6,
        (dy / width) * Math.PI * 1.1
      )
    }
    current.lastX = event.clientX
    current.lastY = event.clientY
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId)
    if (drag.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    drag.current = null
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!live) return
    if (event.shiftKey && event.key.startsWith("Arrow")) {
      const horizontal =
        event.key === "ArrowLeft"
          ? -0.08
          : event.key === "ArrowRight"
            ? 0.08
            : 0
      const vertical =
        event.key === "ArrowUp" ? 0.08 : event.key === "ArrowDown" ? -0.08 : 0
      viewerControls.current?.pan(horizontal, vertical)
      event.preventDefault()
      return
    }
    const rotate = Math.PI / 12
    if (event.key === "ArrowLeft") viewerControls.current?.rotate(-rotate)
    else if (event.key === "ArrowRight") viewerControls.current?.rotate(rotate)
    else if (event.key === "ArrowUp") viewerControls.current?.rotate(0, -rotate)
    else if (event.key === "ArrowDown")
      viewerControls.current?.rotate(0, rotate)
    else if (event.key === "+" || event.key === "=")
      viewerControls.current?.zoom(ZOOM_STEP)
    else if (event.key === "-") viewerControls.current?.zoom(-ZOOM_STEP)
    else if (event.key === "Home") viewerControls.current?.reset()
    else return
    event.preventDefault()
  }

  return (
    <div className={`robot3d ${live ? "robot3d--live" : ""}`}>
      <div className="robot3d-viewport">
        <Image
          className="robot3d-poster"
          src="/models/worlds-bot-poster.webp"
          alt="The RoboKnights Worlds competition robot"
          width={1600}
          height={1600}
          priority
          sizes="(max-width: 960px) 100vw, 900px"
        />
        <div
          className="robot3d-stage"
          ref={mount}
          role="group"
          aria-label="Interactive 3D robot model. Drag to rotate, pinch or use the zoom buttons to zoom, Shift or right-drag to move. Arrow keys turn it, Shift and arrows move it, plus or minus zoom, and Home resets the view."
          aria-hidden={!live}
          tabIndex={live ? 0 : -1}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onLostPointerCapture={onPointerUp}
          onKeyDown={(event) => {
            setTouched(true)
            onKeyDown(event)
          }}
          onDoubleClick={() => viewerControls.current?.reset()}
          onContextMenu={(event) => {
            if (live) event.preventDefault()
          }}
        />
      </div>
      {live && (
        <>
          <span
            className="robot3d-chip"
            data-hidden={touched || undefined}
            aria-hidden="true"
          >
            Drag to rotate
          </span>
          <div className="robot3d-zoom">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => {
                setTouched(true)
                viewerControls.current?.zoom(ZOOM_STEP)
              }}
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => {
                setTouched(true)
                viewerControls.current?.zoom(-ZOOM_STEP)
              }}
            >
              −
            </button>
          </div>
        </>
      )}
      <p
        className={failed ? "robot3d-status" : "sr-only"}
        data-state={failed ? "error" : undefined}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </div>
  )
}
