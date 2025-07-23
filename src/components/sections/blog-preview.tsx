import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { BlogPreview } from "@/schemas"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/common/section"
import { BlogContentCard } from "@/components/blog/blog-post-card"
import { BLOG_PREVIEW_LIMITS } from "@/lib/blog"

interface BlogPreviewSectionProps {
  posts: BlogPreview[]
}

export function BlogPreview({ posts }: BlogPreviewSectionProps) {
  if (posts.length === 0) {
    return null // Don't show section if no posts
  }

  return (
    <Section 
      id="blog" 
      title="Latest Blog Posts"
      description="Thoughts on software engineering, web development, and technology"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, BLOG_PREVIEW_LIMITS.POSTS_TO_SHOW).map((post) => (
          <BlogContentCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length > BLOG_PREVIEW_LIMITS.POSTS_TO_SHOW && (
        <div className="flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </Section>
  )
}