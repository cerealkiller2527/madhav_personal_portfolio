import { Suspense } from "react"
import { Metadata } from "next"
import { getAllBlogPosts } from "@/lib/notion"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogLoading } from "@/components/blog/blog-loading"
import { BlogError } from "@/components/blog/blog-error"

export const metadata: Metadata = {
  title: "Blog - Madhav Lodha",
  description: "Thoughts on software engineering, web development, and technology.",
}

export const revalidate = 60 // Revalidate every 60 seconds

async function BlogContent() {
  try {
    const posts = await getAllBlogPosts()

    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Thoughts on software engineering, web development, and technology.
              </p>
            </div>
            
            <BlogGrid posts={posts} />
          </div>
        </div>
      </div>
    )
  } catch {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <BlogError message="Unable to load blog posts. Please try again later." showRetry={false} />
          </div>
        </div>
      </div>
    )
  }
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-12 bg-muted rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
            </div>
            <BlogLoading variant="spinner" />
          </div>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}