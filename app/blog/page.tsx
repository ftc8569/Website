import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CATEGORIES, categoryFor, getPosts, type PostSummary } from "@/lib/blog"
import { PageHead, SOCIAL_LINKS } from "@/components/site/ui"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Build notes from RoboKnights, FTC Team 8569: what we built, what broke and how we fixed it.",
  alternates: { canonical: "/blog" }
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC"
})

/* Shown when there are no posts at all, so the page is never a dead end. */
const FALLBACK = [
  {
    title: "Articles on LinkedIn",
    body: "We publish our longer engineering write-ups on our LinkedIn page.",
    href: SOCIAL_LINKS[2].href,
    link: "Read on LinkedIn"
  },
  {
    title: "Our code on GitHub",
    body: "The robot code, in Kotlin, with every change reviewed in a pull request.",
    href: SOCIAL_LINKS[0].href,
    link: "Browse on GitHub"
  },
  {
    title: "Season updates on Instagram",
    body: "Build photos and competition days, posted as they happen.",
    href: SOCIAL_LINKS[1].href,
    link: "Follow on Instagram"
  }
]

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const active = CATEGORIES.find((item) => item.toLowerCase() === cat)
  const { posts, source } = await getPosts()
  const withCategory = posts.map((post) => ({
    ...post,
    category: categoryFor(post)
  }))
  const filtered = active
    ? withCategory.filter((post) => post.category === active)
    : withCategory
  const [latest, ...older] = active ? [undefined, ...filtered] : filtered
  const live = source === "live"

  return (
    <main>
      <PageHead
        eyebrow="Blog"
        title="Build notes"
        sub="What we built, what broke and how we fixed it."
      />

      <section className="section section--tight">
        <div className="wrap--media">
          {posts.length === 0 ? (
            <>
              <p className="body blog-empty" role="status">
                There are no posts here right now. Our latest write-ups are on
                these pages instead.
              </p>
              <div className="grid grid--3">
                {FALLBACK.map((card) => (
                  <a
                    className="tile"
                    key={card.title}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h2 style={{ fontSize: 24, lineHeight: 1.17 }}>
                      {card.title}
                    </h2>
                    <p className="body" style={{ marginTop: 10 }}>
                      {card.body}
                    </p>
                    <span className="more">{card.link}</span>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              {latest && (
                <article className="tile tile--split blog-feature">
                  <Cover post={latest} live={live} priority />
                  <div className="tile-copy">
                    <PostMeta post={latest} />
                    <h2>
                      <Link className="stretched" href={`/blog/${latest.id}`}>
                        {latest.title}
                      </Link>
                    </h2>
                    <p className="body">{latest.description}</p>
                    <span className="more" style={{ marginTop: 24 }}>
                      Read the post
                    </span>
                  </div>
                </article>
              )}

              <nav className="segmented" aria-label="Filter posts by category">
                <Link
                  href="/blog"
                  aria-current={!active ? "page" : undefined}
                  scroll={false}
                >
                  All
                </Link>
                {CATEGORIES.map((item) => (
                  <Link
                    key={item}
                    href={`/blog?cat=${item.toLowerCase()}`}
                    aria-current={active === item ? "page" : undefined}
                    scroll={false}
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              {older.length === 0 ? (
                <p className="body blog-empty">
                  {active
                    ? `No ${active.toLowerCase()} posts yet.`
                    : "Older posts will show up here."}
                </p>
              ) : (
                <div className="grid grid--3">
                  {older.map(
                    (post) =>
                      post && (
                        <article className="tile tile--media" key={post.id}>
                          <Cover post={post} live={live} />
                          <div className="tile-copy">
                            {post.category && (
                              <span
                                className="chip"
                                style={{ alignSelf: "flex-start" }}
                              >
                                {post.category}
                              </span>
                            )}
                            <h2 className="blog-card-title">
                              <Link
                                className="stretched"
                                href={`/blog/${post.id}`}
                              >
                                {post.title}
                              </Link>
                            </h2>
                            <p className="body blog-excerpt">
                              {post.description}
                            </p>
                            <p
                              className="caption"
                              style={{ marginTop: "auto", paddingTop: 16 }}
                            >
                              {dateFormatter.format(new Date(post.createdAt))} ·{" "}
                              {post.readTime}
                            </p>
                          </div>
                        </article>
                      )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

function PostMeta({ post }: { post: PostSummary & { category?: string } }) {
  return (
    <p className="caption blog-meta">
      {post.category && <span className="chip">{post.category}</span>}
      {dateFormatter.format(new Date(post.createdAt))} · {post.readTime}
    </p>
  )
}

/*
 * Covers come from the database. When we're serving the snapshot the image
 * endpoint is down too, so show a plain panel instead of a broken image.
 */
function Cover({
  post,
  live,
  priority
}: {
  post: PostSummary
  live: boolean
  priority?: boolean
}) {
  return (
    <div className="media media--16x9 blog-cover">
      {live && (
        <Image
          src={`/api/blog/image/${post.id}`}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 734px) 100vw, (max-width: 1200px) 50vw, 640px"
        />
      )}
    </div>
  )
}
