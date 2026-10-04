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
const MIN_ZOOM = 1
const MAX_ZOOM = 1.8
const ZOOM_STEP = 0.15

type ViewerControls = {
  rotate: (horizontal: number, vertical?: number) => void
  zoom: (amount: number) => void
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
}

function ControlIcon({
  name
}: {
  name: "left" | "right" | "plus" | "minus" | "reset"
}) {
  if (name === "reset") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </svg>
    )
  }

  if (name === "plus" || name === "minus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M8 11h6M16.5 16.5 21 21" />
        {name === "plus" && <path d="M11 8v6" />}
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={name === "left" ? "m14 5-7 7 7 7" : "m10 5 7 7-7 7"} />
    </svg>
  )
}

export default function RobotViewer() {
  const mount = useRef<HTMLDivElement>(null)
  const viewerControls = useRef<ViewerControls | null>(null)
  const drag = useRef<DragState | null>(null)
  const [live, setLive] = useState(false)
  const [status, setStatus] = useState("Loading 3D robot…")
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const node = mount.current
    if (!node) return

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    if (motionPreference.matches) {
      const statusFrame = window.requestAnimationFrame(() => {
        setStatus("Static view · Reduced motion preference")
      })
      return () => window.cancelAnimationFrame(statusFrame)
    }

    let disposed = false
    let onScreen = false
    let raf = 0
    let cleanup: (() => void) | undefined
    let updateVisibility = () => {}

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
          interactionRef.current = null
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
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, compact ? 1.35 : 1.75)
        )
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
        const shadowSize = compact ? 1024 : 2048
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

        const resize = () => {
          const width = node.clientWidth
          const height = node.clientHeight
          if (!width || !height || !renderer) return
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
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
        let zoom = MIN_ZOOM
        viewerControls.current = {
          rotate: (horizontal, vertical = 0) => {
            userRotationY = THREE.MathUtils.clamp(
              userRotationY + horizontal,
              -Math.PI,
              Math.PI
            )
            userRotationX = THREE.MathUtils.clamp(
              userRotationX + vertical,
              -0.45,
              0.45
            )
          },
          zoom: (amount) => {
            zoom = THREE.MathUtils.clamp(zoom + amount, MIN_ZOOM, MAX_ZOOM)
            camera.zoom = zoom
            camera.updateProjectionMatrix()
          },
          reset: () => {
            userRotationY = 0
            userRotationX = 0
            zoom = MIN_ZOOM
            camera.zoom = zoom
            camera.updateProjectionMatrix()
          }
        }

        let time = 0
        let tiltX = 0
        let tiltY = 0
        let pointerX = 0
        let pointerY = 0
        let previousFrame = performance.now()
        const animate = () => {
          raf = 0
          if (disposed || !onScreen || document.hidden || !renderer) return
          const now = performance.now()
          time += Math.min((now - previousFrame) / 1000, 0.05)
          previousFrame = now
          tiltY += (pointerX * 0.2 - tiltY) * 0.045
          tiltX += (pointerY * 0.1 - tiltX) * 0.045
          pivot.rotation.y =
            Math.sin(time * 0.32) * 0.42 + userRotationY + tiltY
          pivot.rotation.x = userRotationX + tiltX
          pivot.position.y = Math.sin(time * 0.55) * 0.012
          renderer.render(scene, camera)
          raf = requestAnimationFrame(animate)
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

        const setPointerTarget = (x: number, y: number) => {
          const bounds = node.getBoundingClientRect()
          pointerX = THREE.MathUtils.clamp(
            ((x - bounds.left) / bounds.width - 0.5) * 2,
            -1,
            1
          )
          pointerY = THREE.MathUtils.clamp(
            ((y - bounds.top) / bounds.height - 0.5) * 2,
            -1,
            1
          )
        }
        const interactions = {
          pointerMove: setPointerTarget,
          rotate: (horizontal: number, vertical: number) =>
            viewerControls.current?.rotate(horizontal, vertical)
        }
        interactionRef.current = interactions

        startLoop()
        setFailed(false)
        setStatus("Drag to rotate · Arrow keys to turn")
        requestAnimationFrame(() => {
          if (!disposed) setLive(true)
        })
      } catch {
        cleanup?.()
        if (!disposed) {
          setFailed(true)
          setStatus("3D view unavailable · Showing poster")
        }
      }
    }

    // Defer Three.js and the compressed model until after the hero's first paint.
    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number }
      ) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const idle = idleWindow.requestIdleCallback
      ? {
          kind: "idle" as const,
          handle: idleWindow.requestIdleCallback(() => start(), {
            timeout: 2200
          })
        }
      : { kind: "timeout" as const, handle: globalThis.setTimeout(start, 600) }

    return () => {
      disposed = true
      if (idle.kind === "idle") idleWindow.cancelIdleCallback?.(idle.handle)
      else globalThis.clearTimeout(idle.handle)
      cleanup?.()
    }
  }, [])

  const interactionRef = useRef<{
    pointerMove: (x: number, y: number) => void
    rotate: (horizontal: number, vertical: number) => void
  } | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!live || event.button > 0) return
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      dragging: false,
      touch: event.pointerType === "touch"
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
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
    interactionRef.current?.rotate(
      (dx / width) * Math.PI * 1.6,
      (dy / width) * Math.PI * 1.1
    )
    interactionRef.current?.pointerMove(event.clientX, event.clientY)
    current.lastX = event.clientX
    current.lastY = event.clientY
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    drag.current = null
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
      <Image
        className="robot3d-poster"
        src="/models/worlds-bot-poster.webp"
        alt="The RoboKnights Worlds competition robot"
        width={1600}
        height={1600}
        priority
        sizes="(max-width: 900px) 100vw, 62vw"
      />
      <div
        className="robot3d-stage"
        ref={mount}
        role="group"
        aria-label="Interactive 3D robot model. Drag to rotate. Use arrow keys to turn, plus or minus to zoom, and Home to reset."
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
      <div className="robot3d-interface">
        <p
          className="robot3d-status"
          data-state={failed ? "error" : undefined}
          role="status"
          aria-live="polite"
        >
          {status}
        </p>
        <div
          className="robot3d-controls"
          role="group"
          aria-label="Robot view controls"
        >
          <button
            type="button"
            aria-label="Rotate robot left"
            onClick={() => viewerControls.current?.rotate(-Math.PI / 6)}
            disabled={!live}
          >
            <ControlIcon name="left" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => viewerControls.current?.zoom(-ZOOM_STEP)}
            disabled={!live}
          >
            <ControlIcon name="minus" />
          </button>
          <button
            type="button"
            aria-label="Reset robot view"
            onClick={() => viewerControls.current?.reset()}
            disabled={!live}
          >
            <ControlIcon name="reset" />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => viewerControls.current?.zoom(ZOOM_STEP)}
            disabled={!live}
          >
            <ControlIcon name="plus" />
          </button>
          <button
            type="button"
            aria-label="Rotate robot right"
            onClick={() => viewerControls.current?.rotate(Math.PI / 6)}
            disabled={!live}
          >
            <ControlIcon name="right" />
          </button>
        </div>
      </div>
    </div>
  )
}
