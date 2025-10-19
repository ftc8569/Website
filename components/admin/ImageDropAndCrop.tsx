import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Cropper from "react-easy-crop"

interface Point {
  x: number
  y: number
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface ImageDropAndCropProps {
  /* Aspect ratio configuration as width:height */
  aspectRatio?: number
  /* Function to call when crop is complete */
  onCropComplete?: (croppedAreaPixels: Area) => void
  /* Function to call when save button is clicked */
  onSave?: (croppedAreaPixels: Area, image: string) => void
  /* Maximum file size in bytes (default: 5MB) */
  maxFileSize?: number
  /* Accepted file types */
  acceptedFileTypes?: string[]
  /* Minimum zoom level (default: 0.5) */
  minZoom?: number
  /* Maximum zoom level (default: 3) */
  maxZoom?: number
}

const ImageDropAndCrop: React.FC<ImageDropAndCropProps> = ({
  aspectRatio = 3 / 4,
  onCropComplete = () => {},
  onSave = () => {},
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  minZoom = 0.5, // Allow zooming out to 50%
  maxZoom = 3
}) => {
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1) // Default zoom level is 1 (100%)
  const [error, setError] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)

      if (acceptedFiles.length === 0) {
        return
      }

      const file = acceptedFiles[0]

      if (file.size > maxFileSize) {
        setError(`File size exceeds the ${maxFileSize / (1024 * 1024)}MB limit`)
        return
      }

      if (!acceptedFileTypes.includes(file.type)) {
        setError(`File type ${file.type} is not supported`)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setImage(dataUrl)

        // Get image dimensions when loaded
        const img = new Image()
        img.onload = () => {
          setImageDimensions({
            width: img.width,
            height: img.height
          })
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    },
    [maxFileSize, acceptedFileTypes]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (obj, type) => {
        obj[type] = []
        return obj
      },
      {} as Record<string, string[]>
    ),
    maxFiles: 1
  })

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
    onCropComplete(croppedAreaPixels)
  }

  const handleSave = () => {
    onSave(
      croppedAreaPixels != null
        ? croppedAreaPixels
        : {
            x: 0,
            y: 0,
            width: imageDimensions!.width,
            height: imageDimensions!.height
          },
      image!
    )
  }

  const resetImage = () => {
    setImage(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setError(null)
    setImageDimensions(null)
    setCroppedAreaPixels(null)
  }

  // Custom styles for the Cropper component
  const cropperStyles = {
    containerClassName: "absolute inset-0 bottom-16 top-16", // Adjusted top to make room for controls
    mediaClassName: "max-w-none max-h-none" // Prevent media constraints
  }

  const shiftImage = (direction: "left" | "right" | "up" | "down") => {
    const shiftAmount = 10 // pixels to shift
    switch (direction) {
      case "left":
        setCrop((prev) => ({ ...prev, x: prev.x - shiftAmount }))
        break
      case "right":
        setCrop((prev) => ({ ...prev, x: prev.x + shiftAmount }))
        break
      case "up":
        setCrop((prev) => ({ ...prev, y: prev.y - shiftAmount }))
        break
      case "down":
        setCrop((prev) => ({ ...prev, y: prev.y + shiftAmount }))
        break
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-[600px] h-[500px] flex flex-col items-center justify-center">
      {!image ? (
        <div
          {...getRootProps()}
          className={`w-full h-full flex flex-col items-center justify-center border-3 border-dashed rounded-lg ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-neutral-300 bg-neutral-50"
          } text-neutral-600 cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50`}
        >
          <input {...getInputProps()} />
          <div className="text-center p-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 mx-auto text-neutral-500"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
            <p className="mt-2">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-sm opacity-70 mt-2">
              Supports{" "}
              {acceptedFileTypes.map((type) => type.split("/")[1]).join(", ")}
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      ) : (
        <div className="relative w-full h-full bg-neutral-100 rounded-lg overflow-hidden">
          {/* Top navigation bar with controls */}
          <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center px-4 bg-white/90 border-b border-neutral-200 z-10">
            <div className="grid grid-cols-5 gap-2">
              <button
                onClick={() => shiftImage("left")}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-100 rounded-md transition-colors border border-neutral-200"
                aria-label="Move left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#000000"
                  className="w-5 h-5"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <button
                onClick={() => shiftImage("up")}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-100 rounded-md transition-colors border border-neutral-200"
                aria-label="Move up"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#000000"
                  className="w-5 h-5 rotate-90"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <button
                onClick={() => shiftImage("down")}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-100 rounded-md transition-colors border border-neutral-200"
                aria-label="Move down"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#000000"
                  className="w-5 h-5 rotate-270"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <button
                onClick={() => shiftImage("right")}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-100 rounded-md transition-colors border border-neutral-200"
                aria-label="Move right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#000000"
                  className="w-5 h-5 rotate-180"
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
              </button>
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium text-neutral-500">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>
          </div>

          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            classes={cropperStyles}
            minZoom={minZoom}
            maxZoom={maxZoom}
            restrictPosition={false} // Allow movement beyond boundaries
            showGrid={true}
          />

          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-white/90 border-t border-neutral-200">
            <div className="flex items-center gap-2 flex-1">
              <label
                htmlFor="zoom"
                className="text-sm font-medium text-stone-900"
              >
                Zoom
              </label>
              <input
                id="zoom"
                type="range"
                min={minZoom}
                max={maxZoom}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 max-w-[200px] accent-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={resetImage}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageDropAndCrop
