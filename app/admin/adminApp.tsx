"use client"

import { SessionProvider, useSession } from "next-auth/react"
import Image from "next/image"
import { useState, useRef } from "react"
import "./markdown.css"
import markdownit from 'markdown-it'
import ImageDropAndCrop from "@/app/admin/ImageDropAndCrop"
import { createCroppedImage } from "@/utils/cropUtils"
import { Area } from "react-easy-crop"

export function AdminApp() {
  const [showBlogEditor, setShowBlogEditor] = useState(true)
  const [showDropAndCrop, setShowDropAndCrop] = useState(false)

  const { data: session } = useSession()

  // Inside your App component
  const [imageSrc, setImageSrc] = useState<Blob | null>(null);

  const handleSave = async (croppedAreaPixels: Area, image: string) => {
    const croppedImage = await createCroppedImage(image, croppedAreaPixels);
    setShowDropAndCrop(false)
    setImageSrc(croppedImage);
  };

  const [title, setTitle] = useState("")
  const [readTime, setReadTime] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")

  const convertToBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreatePost = () => {
    if(title == "" || readTime == "" || content == "" || imageSrc == null) {
      alert("Please fill out all fields before creating a blog post.")
      return
    }

    (async () => {
      const image = await convertToBase64(imageSrc);

      await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          readTime: readTime,
          content: content,
          image: image,
          description: description,
        })
      })

      window.location.reload()
    })();
  }

  const blobUrl = imageSrc && URL.createObjectURL(imageSrc);

  return (
    <>
      <div
        className="top-0 flex flex-row w-full justify-between
        items-center px-4 py-1 z-[2] bg-roboHotPink"
      >
        <h1 className="text-4xl font-semibold">RoboKnights Admin Panel</h1>
      </div>
      <div className="p-10">
        <div className="flex flex-row gap-x-4">
          <div>
            <p className={`text-3xl font-semibold text-stone-100 pb-2`}>Cover Image:</p>
            <div
              className={`mb-4 ${imageSrc != null ? "p-2 rounded-md bg-stone-600 w-[40rem]" : "w-[40rem] bg-white"}`}
              style={{ height: `calc(2*(100vw / 10))` }}>
              { blobUrl &&
                <Image
                  src={blobUrl}
                  alt={"Blog Image"}
                  width={1000}
                  height={400}
                  className={`object-contain w-full h-full`}
                />
              }
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className={`text-3xl font-semibold text-stone-100`}>Configure Blog Card:</p>
            <div>
              <p className={`text-lg font-semibold text-stone-100 pb-1`}>Title:</p>
              <div className={`flex flex-row gap-x-8`}>
                <textarea
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  placeholder="Enter Blog Title Here"
                  className="bg-stone-900 w-96 h-20 p-2"
                />
                <p className={`text-4xl font-oswald`}>{title}</p>
              </div>
            </div>
            <div>
              <p className={`text-lg font-semibold`}>Description: </p>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Once upon a time..."
                className="bg-stone-900 w-96 h-20 p-2"
              />
              <p className={`text-lg font-semibold`}>Read Time: </p>
              <textarea
                onChange={(e) => setReadTime(e.target.value)}
                value={readTime}
                placeholder="8 minutes"
                className="bg-stone-900 w-96 h-10 p-2"
              />
            </div>
          </div>
        </div>

        <div className={`flex flex-row gap-x-4`}>
          <button
            onClick={() => setShowDropAndCrop(true)}
            className="flex flex-row items-center p-3 bg-red-400 rounded-2xl">
            <h1 className="text-xl pr-3 h-full">Upload Image</h1>
            <Image
              src={"/icons/plus-circle.svg"}
              alt={"Create Blog Post"}
              width={35}
              height={35}
            />
          </button>
          <button
            onClick={handleCreatePost}
            className="flex flex-row items-center p-3 bg-blue-500 rounded-2xl">
            <h1 className="text-xl pr-3 h-full">Create Blog Post</h1>
            <Image
              src={"/icons/plus-circle.svg"}
              alt={"Create Blog Post"}
              width={35}
              height={35}
            />
          </button>
        </div>
      </div>
      {showBlogEditor && <BlogEditor content={content} setContent={setContent} />}
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

function BlogEditor({ content, setContent }: { content: string, setContent: (content: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const md = markdownit()
  const [html, setHtml] = useState("")

  const onChange = (event: any) => {
    setHtml(md.render(event.target.value))
    setContent(event.target.value)
  }

  return (
    <div className="flex flex-row w-full">
      <div className="w-full p-5">
          <textarea
            className="bg-stone-900 w-full h-[50rem]"
            content={content}
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
