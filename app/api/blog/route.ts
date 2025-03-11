import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { writeFileSync } from "node:fs"
import { uint8ArrayToBase64 } from "@/utils/imageBuffer"
import { BlogItem } from "@/app/blog/page"

export async function GET() {
  const prisma = new PrismaClient()
  const blogs = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      readTime: true,
      content: true,
      description: true,
      imageType: true,
      image: true,
      author: true,
      createdAt: true
    }
  })

  const retBlogs: BlogItem[] = []
  for(const blog of blogs) {
    retBlogs.push({
      id: blog.id.toString(),
      title: blog.title,
      readTime: blog.readTime,
      content: blog.content!,
      description: blog.description,
      image: `data:image/${blog.imageType};base64,${uint8ArrayToBase64(blog.image)}`,
      author: blog.author.firstName + " " + blog.author.lastName,
      authorUrl: null,
      date: blog.createdAt.toDateString()
    })
  }

  return new Response(JSON.stringify(retBlogs), { status: 200 })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if(session) {
    const prisma = new PrismaClient()

    const data = await req.json()

    const imageType = data.image.split(",")[0].split("/")[1].split(";")[0]
    const buffer = Buffer.from(data.image.split(",")[1], "base64")
    writeFileSync("./image.jpg", buffer)

    const blog = await prisma.blogPost.create({
      data: {
        title: data.title,
        userId: session.user.id,
        readTime: data.readTime,
        content: data.content,
        description: data.description,
        imageType: imageType,
        image: buffer
    }})

    return new Response(JSON.stringify(blog), { status: 200 })
  } else return notFound()
}