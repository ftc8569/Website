"use client"

import Image from "next/image"
import { useRef, useState } from "react"

export type GridPhoto = {
  src: string
  alt: string
  position?: string
}

/* Static photo grid. Each photo opens a native <dialog> lightbox. */
export default function PhotoGrid({
  photos,
  ratio = "4x3"
}: {
  photos: GridPhoto[]
  ratio?: "4x3" | "3x2" | "16x9" | "square"
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<GridPhoto | null>(null)

  const open = (photo: GridPhoto) => {
    setActive(photo)
    dialog.current?.showModal()
  }

  return (
    <>
      <ul className="photo-grid">
        {photos.map((photo) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => open(photo)}
              aria-label={`Open photo: ${photo.alt}`}
            >
              <div className={`media media--${ratio}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 734px) 50vw, 400px"
                  style={{ objectPosition: photo.position ?? "center" }}
                />
              </div>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={active?.alt ?? "Photo"}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        {active && (
          <figure>
            <Image
              src={active.src}
              alt={active.alt}
              width={1600}
              height={1200}
              sizes="(max-width: 1232px) 100vw, 1200px"
            />
            <figcaption>{active.alt}</figcaption>
          </figure>
        )}
        <button
          type="button"
          className="lightbox-close"
          aria-label="Close photo"
          onClick={() => dialog.current?.close()}
        >
          ×
        </button>
      </dialog>
    </>
  )
}
