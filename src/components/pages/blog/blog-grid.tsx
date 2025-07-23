import { BlogPreview } from "@/lib/schemas"
import { BlogCard } from "@/components/pages/blog/blog-card"
import { LoadingGrid } from "@/components/common/ui/loading-states"
import { ContentGrid, GRID_CONFIGS } from "@/components/common/content/content-grid"

interface BlogGridProps {
  posts: readonly BlogPreview[]
  loading?: boolean
  error?: string
  onRetry?: () => void
}

export function BlogGrid({ posts, loading, error, onRetry }: BlogGridProps) {
  if (loading) {
    return <LoadingGrid variant="blog" count={6} />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Try again
          </button>
        )}
      </div>
    )
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
    <ContentGrid config={GRID_CONFIGS.blog}>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </ContentGrid>
  )
}