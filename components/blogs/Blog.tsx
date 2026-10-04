import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import type { BlogPost } from "@/components/blogs/types"
import styles from "@/components/blogs/blog.module.css"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC"
})

export default function BlogWrapper({
  children,
  blog
}: Readonly<{ children: ReactNode; blog: BlogPost }>) {
  return (
    <main>
      <article className={styles.post}>
        <div className={styles.postCover}>
          <Image
            src={`/api/blog/image/${blog.id}`}
            alt=""
            fill
            priority
            sizes="(max-width: 940px) 100vw, 900px"
          />
        </div>
        <header className={styles.postHeader}>
          <p className="section-index">
            <Link href="/blog">06 / Field notes</Link>
          </p>
          <h1>{blog.title}</h1>
          <p className={styles.postMeta}>
            By {blog.author} <span aria-hidden="true">·</span>{" "}
            {formatDate(blog.date)} <span aria-hidden="true">·</span>{" "}
            {blog.readTime}
          </p>
          <p className={styles.postDescription}>{blog.description}</p>
        </header>
        {children}
      </article>
    </main>
  )
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? "" : dateFormatter.format(date)
}
