import type { MetadataRoute } from "next"

import { getPosts } from "@/lib/blog"

const BASE = "https://roboknights.net"
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    "",
    "/season",
    "/robot",
    "/software",
    "/outreach",
    "/team",
    "/blog",
    "/contact"
  ].map((path) => ({ url: `${BASE}${path}` }))
  // getPosts falls back to the snapshot, so a database outage can't break this.
  const { posts } = await getPosts()
  return [
    ...pages,
    ...posts.map((post) => ({
      url: `${BASE}/blog/${post.id}`,
      lastModified: post.createdAt
    }))
  ]
}
