import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import type { BlogPost } from "@/components/blogs/types"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC"
})

export default function BlogWrapper({
  children,
  blog,
  next
}: Readonly<{
  children: ReactNode
  blog: BlogPost
  next?: { id: number; title: string } | null
}>) {
  return (
    <main>
      <article className="post">
        <header className="post-head">
          <p className="eyebrow">
            <Link href="/blog">Blog</Link>
          </p>
          <h1>{blog.title}</h1>
          <p className="caption post-meta">
            By {blog.author} · {formatDate(blog.date)} · {blog.readTime}
          </p>
          <p className="subhead">{blog.description}</p>
        </header>
        <div className="post-cover media media--16x9">
          <Image
            src={`/api/blog/image/${blog.id}`}
            alt=""
            fill
            priority
            sizes="(max-width: 1028px) 100vw, 980px"
          />
        </div>
        {children}
        <footer className="post-foot">
          {next ? (
            <Link className="more" href={`/blog/${next.id}`}>
              Next post: {next.title}
            </Link>
          ) : (
            <Link className="more" href="/blog">
              All build notes
            </Link>
          )}
        </footer>
      </article>
    </main>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? "" : dateFormatter.format(date)
}
