"use client"

import { SessionProvider, useSession } from "next-auth/react"
import Image from "next/image"
import { useState, useRef } from "react"
import showdown from "showdown"
import "./markdown.css"

export function AdminApp() {
  const [showBlogEditor, setShowBlogEditor] = useState(true)

  const { data: session } = useSession()

  return (
    <>
      <div
        className="top-0 flex flex-row w-full justify-between
        items-center px-4 py-1 z-[2] bg-roboHotPink"
      >
        <h1 className="text-4xl font-semibold">RoboKnights Admin Panel</h1>
      </div>
      <div className="p-20">
        <button className="flex flex-row items-center p-5 bg-blue-500 rounded-2xl">
          <h1 className="text-3xl pr-3 h-full">Create Blog Post</h1>
          <Image
            src={"/icons/plus-circle.svg"}
            alt={"Create Blog Post"}
            width={50}
            height={50}
          />
        </button>
      </div>
      {showBlogEditor && <BlogEditor />}
    </>
  )
}

function BlogEditor() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const converter = new showdown.Converter()
  const [text, setText] = useState("")
  const [html, setHtml] = useState("")
  const [textState, setTextState] = useState(true) // true for markdown, false for html
  const [mdOrHtml, setMdOrHtml] = useState(true) // true for markdown, false for html

  if (textState && !mdOrHtml) {
    setText(converter.makeHtml(text))
    if (textareaRef.current)
      textareaRef.current.value = converter.makeHtml(text)
    setTextState(false)
  } else if (!textState && mdOrHtml) {
    setText(converter.makeMarkdown(text))
    if (textareaRef.current)
      textareaRef.current.value = converter.makeMarkdown(text)
    setTextState(true)
  }

  const onChange = (event: any) => {
    setText(event.target.value)
    setHtml(converter.makeHtml(event.target.value))
  }

  return (
    <>
      <div className="flex flex-row pl-5 gap-x-2">
        <button
          className={
            "px-2 rounded-md" + (mdOrHtml ? " bg-gray-600" : " bg-gray-700")
          }
          onClick={() => setMdOrHtml(true)}
        >
          <p>Markdown</p>
        </button>
        <button
          className={
            "px-2 rounded-md" + (mdOrHtml ? " bg-gray-700" : " bg-gray-600")
          }
          onClick={() => setMdOrHtml(false)}
        >
          <p>HTML</p>
        </button>
      </div>
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
    </>
  )
}

export default function AdminSessionWrapper() {
  return (
    <SessionProvider>
      <AdminApp />
    </SessionProvider>
  )
}
