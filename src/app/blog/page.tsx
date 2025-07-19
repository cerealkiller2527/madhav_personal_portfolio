import { Suspense } from "react"
import { Metadata } from "next"
import { getAllBlogPosts } from "@/lib/blog/blog-queries"
import { BlogGridWrapper } from "@/components/blog/blog-list/blog-grid-wrapper"
import { BlogLoading } from "@/components/blog/shared/blog-loading"
import { BlogServerError } from "@/components/blog/shared/blog-server-error"
import { BlogFallback } from "@/components/blog/shared/blog-fallback"

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
            
            <BlogGridWrapper posts={posts} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in BlogContent:", error)
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <BlogServerError 
              title="Unable to load blog posts"
              description="There was an error loading the blog content. Please try again later."
            />
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
            <BlogLoading variant="card" count={6} />
          </div>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}