import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"

export async function GET(req: Request, { params }: {
  params: Promise<{ id: string }>
}) {
  const prisma = new PrismaClient()
  const blog = await prisma.blogPost.findFirst({
    where: {
      id: parseInt((await params).id)
    }
  })

  if(blog != null)
    return new Response(blog.image, { status: 200, headers: { "Content-Type": "image/" + blog.imageType } })
  else return notFound()
}