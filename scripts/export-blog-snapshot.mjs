/*
 * Writes the published blog list (no images, no bodies) to
 * content/blog-snapshot.json. /blog falls back to this file when the database
 * is unreachable, so run it after publishing and commit the result:
 *
 *   DATABASE_URL=... npm run blog:snapshot
 */
import { writeFile } from "node:fs/promises"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

try {
  const rows = await prisma.blogPost.findMany({
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
  const posts = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    readTime: row.readTime,
    createdAt: row.createdAt.toISOString(),
    author: [row.author.firstName, row.author.lastName]
      .filter(Boolean)
      .join(" ")
  }))
  await writeFile(
    new URL("../content/blog-snapshot.json", import.meta.url),
    `${JSON.stringify(posts, null, 2)}\n`
  )
  console.log(`Saved ${posts.length} posts to content/blog-snapshot.json`)
} finally {
  await prisma.$disconnect()
}
