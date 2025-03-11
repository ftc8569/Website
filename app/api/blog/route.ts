import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { writeFileSync } from "node:fs"
import { uint8ArrayToBase64 } from "@/utils/imageBuffer"
import { BlogItem } from "@/app/blog/page"
import { NextRequest } from "next/server"

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
      createdAt: true,
      updatedAt: true,
      published: true
    }
  })

  const session = await getServerSession(authOptions)

  const retBlogs: BlogItem[] = []
  for(const blog of blogs) {
    if(session == null && !blog.published) continue
    retBlogs.push({
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

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if(session) {
    const prisma = new PrismaClient()
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('id')
    if(query == null) return notFound()

    const id = parseInt(query)

    await prisma.blogPost.delete({
      where: {
        id: id
      }
    })

    return new Response("Deleted Blog Post", { status: 200 })
  } else return notFound()
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) return notFound()

  try {
    const prisma = new PrismaClient()
    const data = await req.json()

    const { id, title, readTime, content, description, image } = data

    const postId = parseInt(id)

    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { userId: true }
    })

    if (!existingPost) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 })
    }

    const updateData: any = {
      title,
      readTime,
      content,
      description,
    }

    if (image && image !== "") {
      const imageType = image.split(",")[0].split("/")[1].split(";")[0]
      const buffer = Buffer.from(image.split(",")[1], "base64")

      updateData.imageType = imageType
      updateData.image = buffer
    }

    const updatedBlog = await prisma.blogPost.update({
      where: {
        id: postId
      },
      data: updateData,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const formattedBlog = {
      id: updatedBlog.id.toString(),
      title: updatedBlog.title,
      readTime: updatedBlog.readTime,
      content: updatedBlog.content,
      description: updatedBlog.description,
      image: `data:image/${updatedBlog.imageType};base64,${uint8ArrayToBase64(updatedBlog.image)}`,
      author: `${updatedBlog.author.firstName} ${updatedBlog.author.lastName}`,
      date: updatedBlog.createdAt.toDateString()
    }

    return new Response(JSON.stringify(formattedBlog), { status: 200 })
  } catch (error: any) {
    console.error("Error updating blog post:", error)
    return new Response(
      JSON.stringify({ error: "Failed to update blog post", details: error.message }),
      { status: 500 }
    )
  }
}