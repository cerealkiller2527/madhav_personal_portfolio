import Link from "next/link"
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react"
import { BlogPreview } from "@/lib/schemas"
import { Badge } from "@/components/ui/badge"
import { ContentImage } from "@/components/common/content/content-image"
import { ContentGrid, GRID_CONFIGS } from "@/components/common/content/content-grid"
import { LoadingGrid } from "@/components/common/ui/loading-states"
import { ErrorMessage, NotFoundError } from "@/components/common/ui/error-boundaries"
import { formatBlogDate, getDisplayTags } from "@/lib/utils/blog-utils"

interface BlogCardProps {
  post: BlogPreview
  variant?: "default" | "compact"
  showReadMore?: boolean
}

export function BlogCard({ 
  post, 
  variant = "default",
  showReadMore = false 
}: BlogCardProps) {
  const isCompact = variant === "compact"
  const { visible: visibleTags, overflow: overflowCount } = getDisplayTags(
    post.tags, 
    isCompact ? 2 : 3
  )

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className={`relative overflow-hidden ${isCompact ? "h-40" : "h-48"}`}>
        {post.coverImage ? (
          <ContentImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackType="blog"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className={`relative ${isCompact ? "h-40" : "h-48"} bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300`}>
            <FileText className={`${isCompact ? "h-8 w-8" : "h-12 w-12"} text-muted-foreground/50`} />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className={`flex items-center ${isCompact ? "gap-3" : "gap-4"} text-sm text-muted-foreground mb-3`}>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatBlogDate(post.publishedAt)}
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} min{!isCompact && " read"}
            </div>
          )}
        </div>

        <h3 className={`${isCompact ? "text-lg" : "text-xl"} font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2`}>
          {post.title}
        </h3>
        
        {post.description && (
          <p className={`text-muted-foreground mb-4 ${isCompact ? "line-clamp-2" : "line-clamp-3"} text-sm ${!isCompact && "leading-relaxed"}`}>
            {post.description}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className={`flex flex-wrap ${isCompact ? "gap-1 mb-3" : "gap-2"}`}>
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <Badge variant="outline" className="text-xs">
                +{overflowCount}
              </Badge>
            )}
          </div>
        )}

        {showReadMore && (
          <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
            Read more
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </Link>
  )
}

// Export alias for backward compatibility
export { BlogCard as BlogContentCard }

// BlogGrid functionality (consolidated from blog-grid.tsx)
export interface BlogGridProps {
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
      <ErrorMessage
        title="Something went wrong"
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (posts.length === 0) {
    return (
      <NotFoundError
        resource="blog posts"
        onGoBack={() => window.location.reload()}
      />
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