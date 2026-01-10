// Blog listing page - displays all published blog posts

import { Suspense } from "react"
import { Metadata } from "next"
import { getAllBlogPosts } from "@/lib/notion/notion-service"
import { BlogGrid } from "@/components/pages/blog/blog-card"
import { LoadingGrid } from "@/components/common/ui/loading-states"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Placeholder } from "@/components/common/ui/placeholder"
import { blogDescription } from "@/lib/core/data"

export const metadata: Metadata = {
  title: "Blog - Madhav Lodha",
  description: blogDescription,
}

async function BlogContent() {
  try {
    const posts = await getAllBlogPosts()

    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card variant="glass" className="text-center mb-12 p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {blogDescription}
              </p>
            </Card>
            
            {posts.length > 0 ? (
              <BlogGrid posts={posts} />
            ) : (
              <Card variant="glass" className="text-center py-16">
                <CardContent className="p-0">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-xl overflow-hidden">
                    <Placeholder />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Blog Posts Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Check back later for new content.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } catch {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card variant="glass" className="text-center py-16">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold mb-2">Unable to load blog posts</h3>
                <p className="text-muted-foreground">Please try again later.</p>
              </CardContent>
            </Card>
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
            <Card variant="glass" className="text-center mb-12 p-8">
              <Skeleton className="h-12 w-1/3 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </Card>
            <LoadingGrid count={6} />
          </div>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}
