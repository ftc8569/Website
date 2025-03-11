"use server";

import { notFound } from "next/navigation"
import MarkdownIt from "markdown-it"
import BlogWrapper from "@/app/blog/[id]/Blog"
import { PrismaClient } from "@prisma/client"
import { uint8ArrayToBase64 } from "@/utils/imageBuffer"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
export default async function BlogPage({ params }: {
  params: Promise<{ id: string }>
}) {
  const prisma = new PrismaClient()
  const blog = await prisma.blogPost.findFirst({
    where: {
      id: parseInt((await params).id)
    },
    select: {
      id: true,
      title: true,
      readTime: true,
      content: true,
      description: true,
      imageType: true,
      author: true,
      createdAt: true,
      updatedAt: true,
      published: true
    }
  })

  if(blog == null) return notFound()
  if(!blog.published) {
    const session = await getServerSession(authOptions)
    if(session == null) return notFound()
  }

  const clientBlog = {
    id: blog.id.toString(),
    title: blog.title,
    readTime: blog.readTime,
    content: blog.content!,
    description: blog.description,
    author: blog.author.firstName + " " + blog.author.lastName,
    authorUrl: null,
    date: blog.createdAt.toDateString(),
    updatedAt: blog.updatedAt.toDateString(),
    published: blog.published
  }

  const md = new MarkdownIt()
  const html = md.render(blog.content!)

  console.log(html)

  return <BlogWrapper children={
    <div dangerouslySetInnerHTML={{ __html: html }} />
  } blog={clientBlog} />
}