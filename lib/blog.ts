import snapshot from "@/content/blog-snapshot.json"
import { prisma } from "@/lib/prisma"

export type PostSummary = {
  id: number
  title: string
  description: string
  readTime: string
  createdAt: string
  author: string
}

export type PostList = {
  posts: PostSummary[]
  /* "live" from the database, or "snapshot" from the last good export. */
  source: "live" | "snapshot"
}

export const CATEGORIES = [
  "Mechanical",
  "Programming",
  "Outreach",
  "Competition"
] as const
export type Category = (typeof CATEGORIES)[number]

/*
 * BlogPost has no category column, so the chip is derived from the title and
 * description. Add an id to OVERRIDES to pin a post that the keywords get
 * wrong. A real column is the cleaner long-term fix.
 */
const OVERRIDES: Record<number, Category> = {}
const KEYWORDS: [Category, RegExp][] = [
  [
    "Competition",
    /\b(competition|match(es)?|tournament|qualifier|scrimmage|states|worlds|league|ranking)\b/i
  ],
  [
    "Programming",
    /\b(code|coding|program(ming)?|software|kotlin|java|autonomous|auto|pedro|sensor|vision|simulat\w*|control)\b/i
  ],
  [
    "Mechanical",
    /\b(cad|chassis|drivetrain|intake|shooter|gear|motor|build|machin\w*|waterjet|cnc|design)\b/i
  ],
  [
    "Outreach",
    /\b(outreach|school|sponsor\w*|demo|mentor\w*|community|fll|library|museum|volunteer\w*)\b/i
  ]
]

export function categoryFor(
  post: Pick<PostSummary, "id" | "title" | "description">
) {
  if (OVERRIDES[post.id]) return OVERRIDES[post.id]
  const text = `${post.title} ${post.description}`
  return KEYWORDS.find(([, pattern]) => pattern.test(text))?.[0]
}

/*
 * Published posts, newest first. If the database is unreachable we fall back
 * to content/blog-snapshot.json (refresh it with `npm run blog:snapshot`), so
 * the page always renders the last good list instead of an error.
 */
export async function getPosts(): Promise<PostList> {
  // No database configured (local development): use the snapshot quietly.
  if (!process.env.DATABASE_URL)
    return { source: "snapshot", posts: snapshot as PostSummary[] }
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
    return {
      source: "live",
      posts: rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        readTime: row.readTime,
        createdAt: row.createdAt.toISOString(),
        author: [row.author.firstName, row.author.lastName]
          .filter(Boolean)
          .join(" ")
      }))
    }
  } catch (error) {
    console.warn("Blog: database unavailable, using snapshot.", error)
    return { source: "snapshot", posts: snapshot as PostSummary[] }
  }
}
