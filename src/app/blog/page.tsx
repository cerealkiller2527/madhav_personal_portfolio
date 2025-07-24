import { Suspense } from "react"
import { Metadata } from "next"
import { getAllBlogPosts } from "@/lib/notion/notion-service"
import { BlogGrid } from "@/components/pages/blog/blog-card"
import { LoadingGrid } from "@/components/common/ui/loading-states"

export const metadata: Metadata = {
  title: "Blog - Madhav Lodha",
  description: "Thoughts on software engineering, web development, and technology.",
}

async function BlogContent() {
  try {
    const posts = await getAllBlogPosts()

    return (
    <div className="min-h-screen bg-background page-padding">
      <div className="container mx-auto px-4 py-8">
        <div className="blog-container">
          <div className="blog-header-center">
            <h1 className="heading-1 mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground content-container">
              Thoughts on software engineering, web development, and technology.
            </p>
          </div>
            
            {posts.length > 0 ? (
              <BlogGrid posts={posts} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No Blog Posts Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Check back later for new content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch {
    return (
    <div className="min-h-screen bg-background page-padding">
      <div className="container mx-auto px-4 py-8">
        <div className="blog-container">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Unable to load blog posts</h3>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default function BlogPage() {
  return (
    <Suspense fallback={
  <div className="min-h-screen bg-background page-padding">
    <div className="container mx-auto px-4 py-8">
      <div className="blog-container">
        <div className="blog-header-center">
          <div className="skeleton-shimmer h-12 rounded w-1/3 mx-auto mb-4"></div>
          <div className="skeleton-shimmer h-6 rounded w-2/3 mx-auto"></div>
        </div>
        <LoadingGrid variant="blog" count={6} />
      </div>
    </div>
  </div>
    }>
      <BlogContent />
    </Suspense>
  )
}