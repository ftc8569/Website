import type { Metadata } from "next"
import MarkdownIt from "markdown-it"
import { notFound } from "next/navigation"

import BlogWrapper from "@/components/blogs/Blog"
import styles from "@/components/blogs/blog.module.css"
import { prisma } from "@/lib/prisma"

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const id = parseId((await params).id)
  if (id === null) return { title: "Article — RoboKnights 8569" }

  try {
    const post = await prisma.blogPost.findFirst({
      where: { id, published: true },
      select: { title: true, description: true }
    })

    return post
      ? {
          title: `${post.title} — RoboKnights 8569`,
          description: post.description
        }
      : { title: "Article — RoboKnights 8569" }
  } catch {
    return { title: "RoboKnights Blog — RoboKnights 8569" }
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const id = parseId((await params).id)
  if (id === null) notFound()

  let blog
  try {
    blog = await prisma.blogPost.findFirst({
      where: { id, published: true },
      select: {
        id: true,
        title: true,
        readTime: true,
        content: true,
        description: true,
        author: { select: { firstName: true, lastName: true } },
        createdAt: true,
        updatedAt: true
      }
    })
  } catch {
    return (
      <main className={styles.unavailable}>
        <h1>Articles are temporarily unavailable.</h1>
        <p>Please try again later.</p>
      </main>
    )
  }

  if (!blog) notFound()

  const post = {
    id: String(blog.id),
    title: blog.title,
    readTime: blog.readTime,
    content: blog.content ?? "",
    description: blog.description,
    author: [blog.author.firstName, blog.author.lastName]
      .filter(Boolean)
      .join(" "),
    date: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString()
  }

  const html = new MarkdownIt({ html: false, breaks: true }).render(
    post.content
  )

  return (
    <BlogWrapper blog={post}>
      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </BlogWrapper>
  )
}

function parseId(value: string) {
  if (!/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
