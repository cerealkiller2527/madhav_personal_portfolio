import { BlogPreview } from "@/schemas"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogLoading } from "@/components/blog/blog-loading"
import { BlogError } from "@/components/blog/blog-error"

interface BlogGridProps {
  posts: readonly BlogPreview[]
  loading?: boolean
  error?: string
  onRetry?: () => void
}

export function BlogGrid({ posts, loading, error, onRetry }: BlogGridProps) {
  if (loading) {
    return <BlogLoading variant="grid" count={6} />
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