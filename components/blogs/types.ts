export type BlogItem = {
  id: string
  title: string
  description: string
  author: string
  authorUrl: string | null
  date: string
  readTime: string
  content: string
  updatedAt: string
  published: boolean
  imageType: string
}

export type BlogSummary = Pick<
  BlogItem,
  "id" | "title" | "description" | "author" | "date" | "readTime"
>

export type BlogPost = Omit<BlogItem, "imageType" | "authorUrl" | "published">
