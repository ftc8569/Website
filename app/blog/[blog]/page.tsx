import blogs from "@/app/blog/blogs"
import { redirect } from "next/navigation"

export default async function BlogThing({
  params
}: {
  params: Promise<{ blog: string }>
}) {
  const blogid = (await params).blog
  const blog = blogs.find((b) => b.id == blogid)

  if (blog != null) return <blog.component />
  else {
    redirect("/blog")
  }
}
