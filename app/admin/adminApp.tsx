"use client"

import { SessionProvider, useSession } from "next-auth/react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import "./markdown.css"
import markdownit from 'markdown-it'
import ImageDropAndCrop from "@/app/admin/ImageDropAndCrop"
import { createCroppedImage } from "@/utils/cropUtils"
import { Area } from "react-easy-crop"

// Define the blog item type
interface BlogItem {
  id: string;
  title: string;
  readTime: string;
  content: string;
  description: string;
  image: string;
  author: string;
  authorUrl: string | null;
  date: string;
  updatedAt: string;
  published?: boolean; // Assuming there's a published field, might need to be added to your API
}

export function AdminApp() {
  const [showBlogEditor, setShowBlogEditor] = useState(false)
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: session } = useSession()

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError('Error loading blogs. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = (id: string) => {
    // Placeholder for delete functionality
    console.log('Delete blog with id:', id);
  };

  const handleEditBlog = (id: string) => {
    // Placeholder for edit functionality
    console.log('Edit blog with id:', id);
  };

  const handlePublishToggle = (id: string, currentState: boolean | undefined) => {
    // Placeholder for publish/unpublish functionality
    console.log(`${currentState ? 'Unpublish' : 'Publish'} blog with id:`, id);
  };

  return (
    <>
      <div
        className="top-0 flex flex-row w-full justify-between
        items-center px-4 py-1 z-[2] bg-roboHotPink"
      >
        <h1 className="text-4xl font-semibold">RoboKnights Admin Panel</h1>
      </div>

      {!showBlogEditor ? (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-stone-100">Blog Posts</h2>
            <button
              onClick={() => setShowBlogEditor(true)}
              className="flex flex-row items-center p-3 bg-blue-500 hover:bg-blue-600 transition-colors rounded-2xl"
            >
              <h1 className="text-xl pr-3 h-full">Create Blog Post</h1>
              <Image
                src="/icons/plus-circle.svg"
                alt="Create Blog Post"
                width={35}
                height={35}
              />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-stone-800 rounded-lg overflow-hidden">
                <thead className="bg-stone-700">
                <tr>
                  <th className="py-3 px-4 text-left text-stone-100">Title</th>
                  <th className="py-3 px-4 text-left text-stone-100">Author</th>
                  <th className="py-3 px-4 text-left text-stone-100">Created</th>
                  <th className="py-3 px-4 text-left text-stone-100">Last Updated</th>
                  <th className="py-3 px-4 text-left text-stone-100">Status</th>
                  <th className="py-3 px-4 text-left text-stone-100">Actions</th>
                </tr>
                </thead>
                <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-center text-stone-300">
                      No blog posts found
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="border-t border-stone-700 hover:bg-stone-700/50 transition-colors">
                      <td className="py-3 px-4 text-stone-200 font-medium">
                        {blog.title.length > 40 ? `${blog.title.substring(0, 40)}...` : blog.title}
                      </td>
                      <td className="py-3 px-4 text-stone-300">{blog.author}</td>
                      <td className="py-3 px-4 text-stone-300">{blog.date}</td>
                      <td className="py-3 px-4 text-stone-300">{blog.updatedAt}</td>
                      <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePublishToggle(blog.id, blog.published)}
                            className={`p-2 rounded-md text-xs font-medium ${blog.published
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-green-600 hover:bg-green-700'} transition-colors text-white`}
                          >
                            {blog.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleEditBlog(blog.id)}
                            className="p-2 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="p-2 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 transition-colors text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <BlogEditor setShowBlogEditor={setShowBlogEditor} />
      )}
    </>
  )
}

// Rest of your code for BlogEditor remains the same
function BlogEditor({ setShowBlogEditor }: { setShowBlogEditor: (show: boolean) => void }) {
  // Your existing BlogEditor code here...
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const md = markdownit()
  const [html, setHtml] = useState("")
  const [showDropAndCrop, setShowDropAndCrop] = useState(false)

  const onChange = (event: any) => {
    setHtml(md.render(event.target.value))
    setContent(event.target.value)
  }

  // Inside your App component
  const [imageSrc, setImageSrc] = useState<Blob | null>(null);

  const handleSave = async (croppedAreaPixels: Area, image: string) => {
    const croppedImage = await createCroppedImage(image, croppedAreaPixels);
    setShowDropAndCrop(false)
    setImageSrc(croppedImage);
  };

  const [title, setTitle] = useState("")
  const [readTime, setReadTime] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")

  const convertToBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreatePost = () => {
    if(title == "" || readTime == "" || content == "" || imageSrc == null) {
      alert("Please fill out all fields before creating a blog post.")
      return
    }

    (async () => {
      const image = await convertToBase64(imageSrc);

      await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          readTime: readTime,
          content: content,
          image: image,
          description: description,
        })
      })

      window.location.reload()
    })();
  }

  const blobUrl = imageSrc && URL.createObjectURL(imageSrc);

  return (
    <>
      <div className="p-10">
        <div className="flex flex-row gap-x-4">
          <div>
            <p className={`text-3xl font-semibold text-stone-100 pb-2`}>Cover Image:</p>
            <div
              className={`mb-4 ${imageSrc != null ? "p-2 rounded-md bg-stone-600 w-[40rem]" : "w-[40rem] bg-white"}`}
              style={{ height: `calc(2*(100vw / 10))` }}>
              {blobUrl &&
                <Image
                  src={blobUrl}
                  alt={"Blog Image"}
                  width={1000}
                  height={400}
                  className={`object-contain w-full h-full`}
                />
              }
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <p className={`text-3xl font-semibold text-stone-100`}>Configure Blog Card:</p>
            <div>
              <p className={`text-lg font-semibold text-stone-100 pb-1`}>Title:</p>
              <div className={`flex flex-row gap-x-8`}>
                  <textarea
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder="Enter Blog Title Here"
                    className="bg-stone-900 w-96 h-20 p-2"
                  />
                <p className={`text-4xl font-oswald`}>{title}</p>
              </div>
            </div>
            <div>
              <p className={`text-lg font-semibold`}>Description: </p>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Once upon a time..."
                className="bg-stone-900 w-96 h-20 p-2"
              />
              <p className={`text-lg font-semibold`}>Read Time: </p>
              <textarea
                onChange={(e) => setReadTime(e.target.value)}
                value={readTime}
                placeholder="8 minutes"
                className="bg-stone-900 w-96 h-10 p-2"
              />
            </div>
          </div>
        </div>

        <div className={`flex flex-row gap-x-4`}>
          <button
            onClick={() => setShowBlogEditor(false)}
            className="flex flex-row items-center p-2 bg-red-400 rounded-2xl">
            <h1 className="text-xl pr-3">Go Back</h1>
          </button>
          <button
            onClick={() => setShowDropAndCrop(true)}
            className="flex flex-row items-center p-2 bg-green-400 rounded-2xl">
            <h1 className="text-xl pr-3">Upload Image</h1>
            <Image
              src={"/icons/plus-circle.svg"}
              alt={"Create Blog Post"}
              width={35}
              height={35}
            />
          </button>
          <button
            onClick={handleCreatePost}
            className="flex flex-row items-center p-2 bg-blue-500 rounded-2xl">
            <h1 className="text-xl pr-3">Upload Blog Post</h1>
            <Image
              src={"/icons/plus-circle.svg"}
              alt={"Create Blog Post"}
              width={35}
              height={35}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full p-5">
          <textarea
            className="bg-stone-900 w-full h-[50rem]"
            content={content}
            id="blogpost"
            name="blogpost"
            onChange={onChange}
            ref={textareaRef}
          />
        </div>
        <div className="w-full p-5">
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      </div>
      {showDropAndCrop && <ImageDropAndCrop
        aspectRatio={5/2} // Default aspect ratio (width/height)
        onSave={handleSave}
        // Optional: customize accepted file types
        acceptedFileTypes={['image/jpeg', 'image/png']}
        // Optional: set maximum file size (in bytes)
        maxFileSize={10 * 1024 * 1024} // 10MB
      />}
    </>
  )
}

export default function AdminSessionWrapper() {
  return (
    <SessionProvider>
      <AdminApp />
    </SessionProvider>
  )
}