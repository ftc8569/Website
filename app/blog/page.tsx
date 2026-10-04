import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import styles from "@/components/blogs/blog.module.css"
import PageHeader from "@/components/site/page-header"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Build updates, competition days, and engineering from RoboKnights Team 8569."
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC"
})

export default async function BlogPage() {
  let posts
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        readTime: true,
        createdAt: true,
        author: { select: { firstName: true, lastName: true } }
      }
    })
  } catch {
    return (
      <main className={styles.page}>
        <PageHeader
          eyebrow="06 / Field notes"
          title="RoboKnights Blog"
          lede="Build updates, competition days, and the engineering behind our work."
        />
        <p className={styles.status} role="status">
          Articles are temporarily unavailable. Please try again later.
        </p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <PageHeader
        eyebrow="06 / Field notes"
        title="RoboKnights Blog"
        lede="Build updates, competition days, and the engineering behind our work."
      />

      {posts.length === 0 ? (
        <p className={styles.status}>No articles have been published yet.</p>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <Link href={`/blog/${post.id}`} className={styles.cardLink}>
                <div className={styles.cover}>
                  <Image
                    src={`/api/blog/image/${post.id}`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.cardCopy}>
                  <p className={styles.cardMeta}>
                    {dateFormatter.format(post.createdAt)}{" "}
                    <span aria-hidden="true">·</span> {post.readTime}
                  </p>
                  <h2>{post.title}</h2>
                  <p className={styles.description}>{post.description}</p>
                  <p className={styles.author}>
                    By{" "}
                    {[post.author.firstName, post.author.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
