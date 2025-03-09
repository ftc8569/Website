"use client"

import { SessionProvider, useSession } from "next-auth/react"
import Image from "next/image"
import { useState, useRef } from "react"
import "./markdown.css"
import markdownit from 'markdown-it'
import ImageDropAndCrop from "@/app/admin/ImageDropAndCrop"
import { createCroppedImage } from "@/app/admin/cropUtils"
import { Area } from "react-easy-crop"

export function AdminApp() {
  const [showBlogEditor, setShowBlogEditor] = useState(true)
  const [showDropAndCrop, setShowDropAndCrop] = useState(true)

  const { data: session } = useSession()

  // Inside your App component
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleSave = async (croppedAreaPixels: Area, image: string) => {
    const croppedImage = await createCroppedImage(image, croppedAreaPixels);
    setShowDropAndCrop(false)
    setImageSrc(image)
  };

  return (
    <>
      <div
        className="top-0 flex flex-row w-full justify-between
        items-center px-4 py-1 z-[2] bg-roboHotPink"
      >
        <h1 className="text-4xl font-semibold">RoboKnights Admin Panel</h1>
      </div>
      <div className="p-10">
        <p className={`text-3xl font-semibold text-stone-100 pb-2`}>Cover Image:</p>
        <div
          className={`mb-4 ${imageSrc != null ? "p-2 rounded-md bg-stone-600 w-1/2" : "w-[40rem] bg-white"}`}
          style={{ height: `${imageSrc != null ? "calc(2*(100vw / 10))" : "20rem"}` }}>
          { imageSrc &&
            <Image
            src={imageSrc!}
            alt={"Blog Image"}
            width={1000}
            height={500}
          />
          }
        </div>

        <button className="flex flex-row items-center p-3 bg-blue-500 rounded-2xl">
          <h1 className="text-xl pr-3 h-full">Create Blog Post</h1>
          <Image
            src={"/icons/plus-circle.svg"}
            alt={"Create Blog Post"}
            width={35}
            height={35}
          />
        </button>
      </div>
      {showBlogEditor && <BlogEditor />}
      {showDropAndCrop && <ImageDropAndCrop
        aspectRatio={5/2} // Default aspect ratio (width/height)
        onSave={handleSave}
        // Optional: customize accepted file types
        acceptedFileTypes={['image/jpeg', 'image/png']}
        // Optional: set maximum file size (in bytes)
        maxFileSize={10 * 1024 * 1024} // 10MB
      />}
    </>
  )
}

function BlogEditor() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const md = markdownit()
  const [html, setHtml] = useState("")

  const onChange = (event: any) => {
    setHtml(md.render(event.target.value))
  }

  return (
    <div className="flex flex-row w-full">
      <div className="w-full p-5">
          <textarea
            className="bg-stone-900 w-full h-[50rem]"
            id="blogpost"
            name="blogpost"
            onChange={onChange}
            ref={textareaRef}
          />
      </div>
      <div className="w-full p-5">
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </div>
  )
}

export default function AdminSessionWrapper() {
  return (
    <SessionProvider>
      <AdminApp />
    </SessionProvider>
  )
}
