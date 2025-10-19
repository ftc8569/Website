"use client"

import Navbar from "@/components/navbar"
import { useEffect, useRef, useState } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Image from "next/image"

export default function Blog() {
  const navbarRef = useRef<HTMLDivElement | null>(null)
  const [blogs, setBlogs] = useState<BlogItem[]>([])

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
  }, [])

  return (
    <main>
      <Navbar navbarRef={navbarRef} homePageRefs={null} />
      <div className="w-1/3 bg-roboHotPink rounded-lg mt-32 ml-10">
        <h1 className="text-6xl p-3 pl-10">RoboKnights Blog</h1>
        <h1 className="text-3xl p-3 pl-10">
          Where you can hear the minds of great thinkers and doers
        </h1>
      </div>
      <div className={`pb-20`}>
        <ResponsiveMasonry
          className="px-8 pt-16"
          columnsCountBreakPoints={{ 350: 1, 750: 2, 800: 3 }}
        >
          <Masonry gutter="1rem">
            {blogs.map((blog, index) => {
              return <BlogCard data={blog} key={index} />
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </main>
  )
}

function BlogCard({ data }: { data: BlogItem }) {
  return (
    <button onClick={() => window.open("/blog/" + data.id)}>
      <div
        className={`bg-stone-900 ring-2 ring-blue-500/50 hover:ring-blue-300/50 rounded-2xl`}
      >
        <Image
          src={`/api/blog/image/${data.id}`}
          alt={"Blog Image"}
          className={`rounded-t-2xl`}
          width={1000}
          height={600}
        />
        <div className="py-5 px-3 text-left">
          <h1 className="text-3xl font-semibold pb-2">{data.title}</h1>
          <h1>{data.description}</h1>
          <h1 className="text-stone-500 pt-2">Author: {data.author}</h1>
        </div>
      </div>
    </button>
  )
}

export interface BlogItem {
  id: string
  title: string
  description: string
  author: string
  authorUrl: string | null
  date: string // MM/DD/YYYY
  readTime: string // "X minutes"
  content: string // In markdown
  updatedAt: string
  published: boolean
}
