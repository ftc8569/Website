import WebsiteBlog from "@/app/blog/manualBlogs/website"
import { JSX } from "react"

const blogs: BlogItem[] = [
  {
    id: "website",
    title: "Website Creation Process",
    description: "Learn about the process and technologies we used to create our website. You'll learn about the design, the backend, and the frontend. You'll also learn about the challenges we faced and how we overcame them.",
    author: "Trevor Bedson",
    image: "/blogImages/website.png",
    component: WebsiteBlog
  }
]

export interface BlogItem {
  id: string
  title: string
  description: string
  author: string
  image: string
  component: () => JSX.Element
}

export default blogs
