import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp"
])

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isSafeInteger(id) || id < 1)
    return new Response(null, { status: 404 })

  try {
    const post = await prisma.blogPost.findFirst({
      where: { id, published: true },
      select: { image: true, imageType: true }
    })
    if (!post) return new Response(null, { status: 404 })

    const imageType = post.imageType.toLowerCase()
    if (!IMAGE_TYPES.has(imageType)) {
      return new Response(null, { status: 415 })
    }

    return new Response(post.image, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "Content-Type": imageType,
        "X-Content-Type-Options": "nosniff"
      }
    })
  } catch {
    return Response.json(
      { error: "The blog image is temporarily unavailable." },
      { status: 503 }
    )
  }
}
