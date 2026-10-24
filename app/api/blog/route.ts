import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
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

    return Response.json(
      posts.map((post) => ({
        id: String(post.id),
        title: post.title,
        description: post.description,
        readTime: post.readTime,
        date: post.createdAt.toISOString(),
        author: [post.author.firstName, post.author.lastName]
          .filter(Boolean)
          .join(" ")
      }))
    )
  } catch {
    return Response.json(
      { error: "Blog posts are temporarily unavailable." },
      { status: 503 }
    )
  }
}
