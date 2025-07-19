import { BlogPostPreview } from "@/types/blog"
import { BlogCard } from "./blog-card"
import { BlogLoading } from "../shared/blog-loading"
import { BlogError } from "../shared/blog-error"

interface BlogGridProps {
  posts: BlogPostPreview[]
  loading?: boolean
  error?: string
  onRetry?: () => void
}

export function BlogGrid({ posts, loading, error, onRetry }: BlogGridProps) {
  if (loading) {
    return <BlogLoading variant="card" count={6} />
  }

  if (error) {
    return <BlogError message={error} onRetry={onRetry} />
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
        <p className="text-muted-foreground">
          Check back later for new content, or configure your Notion database.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}