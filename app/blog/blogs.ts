import WebsiteBlog from "@/app/blog/manualBlogs/website"
import { JSX } from "react"

const blogs: BlogItem[] = [
  {
    id: "website",
    title: "Website Creation Process",
    description: "Learn about the process and technologies we used to create our website. You'll learn about the design, the backend, and the frontend. You'll also learn about the challenges we faced and how we overcame them.",
    author: "Trevor Bedson",
    authorUrl: "https://bedson.tech",
    image: "/blogImages/website.png",
    date: "03/08/2025",
    readTime: "5 minutes",
    content: "Hey!"
  }
]

export interface BlogItem {
  id: string
  title: string
  description: string
  author: string
  authorUrl: string | null
  image: string
  date: string // MM/DD/YYYY
  readTime: string // "X minutes"
  content: string // In markdown
}

export default blogs
