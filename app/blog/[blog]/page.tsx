"use client";

import { BlogItem } from "@/app/blog/blogs"
import { redirect } from "next/navigation"
import { ReactNode, useRef } from "react"
import Navbar from "@/app/navbar"
import Image from "next/image"
import MarkdownIt from "markdown-it"

export default async function BlogThing({
  params
}: {
  params: Promise<{ blog: string }>
}) {
  const blogid = (await params).blog
  const blog = blogs.find((b) => b.id == blogid)

  const md = new MarkdownIt()

  if (blog != null) return <BlogWrapper children={
    <>
      {md.render(blog.content)}
    </>
  } blog={blog} />
  else {
    redirect("/blog")
  }
}

function BlogWrapper({ children, blog }: Readonly<{ children: ReactNode, blog: BlogItem }>) {
  const navbarRef = useRef<HTMLDivElement | null>(null)

  let authorComponent = <span>{blog.author}</span>
  if(blog.authorUrl != null) {
    const clickHandler = () => {
      window.open(blog.authorUrl!)
    }

    authorComponent = <span
      onClick={clickHandler}
      className={"hover:text-stone-200 hover:underline hover:cursor-pointer"}>
      {blog.author}</span>
  }

  return (
    <main>
      <Navbar navbarRef={navbarRef} homePageRefs={null} />
      <div className="w-full flex-row py-10">
        <div className="flex flex-col gap-y-5 w-2/3 h-[100rem] p-10 justify-self-center bg-stone-900 rounded-lg">
          <div className="flex flex-row justify-center">
            <Image src={`/api/blog/image/${blog.id}`} alt={"Blog Image"} className={`rounded-2xl`} width={2000} height={1200} />
          </div>
          <div className="px-5">
            <p className="text-5xl pt-4 font-oswald">{blog.title}</p>
            <p className="text-md text-stone-300 pt-4">{authorComponent} • {blog.date} • {blog.readTime}</p>
            <p className="text-lg pt-4">{blog.description}</p>
            <div className={"h-[1px] my-4 w-full mx-auto bg-stone-50"}></div>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}