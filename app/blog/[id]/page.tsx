import type { Metadata } from "next"
import MarkdownIt from "markdown-it"
import Link from "next/link"
import { notFound } from "next/navigation"

import BlogWrapper from "@/components/blogs/Blog"
import { prisma } from "@/lib/prisma"

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const id = parseId((await params).id)
  if (id === null) return { title: "Article" }

  try {
    const post = await prisma.blogPost.findFirst({
      where: { id, published: true },
      select: { title: true, description: true }
    })

    return post
      ? {
          title: post.title,
          description: post.description,
          alternates: { canonical: `/blog/${id}` },
          openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            url: `/blog/${id}`,
            images: [{ url: `/api/blog/image/${id}`, alt: post.title }]
          },
          twitter: {
            card: "summary_large_image",
            images: [`/api/blog/image/${id}`]
          }
        }
      : { title: "Article" }
  } catch {
    return { title: "Blog" }
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
  let next: { id: number; title: string } | null = null
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
    if (blog)
      next = await prisma.blogPost.findFirst({
        where: { published: true, createdAt: { lt: blog.createdAt } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: { id: true, title: true }
      })
  } catch (error) {
    console.error("Blog post: database unavailable.", error)
    return (
      <main>
        <header className="page-head">
          <div className="wrap">
            <p className="eyebrow">Blog</p>
            <h1 style={{ fontSize: "var(--fs-h2)" }}>
              This post couldn&apos;t load.
            </h1>
            <p className="subhead">
              Refresh in a few minutes, or go back to the list of build notes.
            </p>
            <div className="actions">
              <Link className="btn" href="/blog">
                All build notes
              </Link>
            </div>
          </div>
        </header>
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

  // The page title is the only h1; headings inside the post start at h2.
  const html = new MarkdownIt({ html: false, breaks: true })
    .render(post.content)
    .replace(/<(\/?)h1>/g, "<$1h2>")

  return (
    <BlogWrapper blog={post} next={next}>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
    </BlogWrapper>
  )
}

function parseId(value: string) {
  if (!/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}
